# keep boundaries sharp

## reasoning

A boundary is a promise. Inside it, you can do whatever you like. Outside it,
you only see the contract. The promise is only useful when both sides honor it.

Boundaries blur when implementation details cross them. A function that
returns a database row leaks storage shape into the caller, and a module that
imports its neighbor's `internal/` folder is reading mail addressed to
someone else. Each crack invites more, until the boundary is a name on a
folder and nothing else.

Treat the edge as a translator. External names, wire shapes, library errors,
and protocol details belong outside. Internal names, domain types, and domain
errors belong inside. The mapping happens at the edge, in one place.

Prefer explicit dependencies to ambient coupling. A function that reaches for a
global singleton, a process env var, or a sibling module's private export has
invisible wires. The wires still exist; they are harder to find by reading
the signature. Pass dependencies in, name them, and the boundary becomes
legible.

Co-change is a signal. If two modules are almost always edited together, the
boundary between them is not earning its keep. The contract may be wrong, or
the split may be wrong. Either is fixable; ignoring the signal is not.

When a domain fact or protocol message crosses, prefer data to behavior. A
plain value is easy to inspect, store, and replace. A callback or closure in a
message carries hidden context across the boundary and binds the two sides in
ways that are hard to see and harder to undo.

## examples

### do not leak storage shape outward

Weak:

```ts
async function findUser(id: string): Promise<UserDocument> {
  return collection.findOne({ _id: id })
}
```

Callers now depend on Mongo's `UserDocument`: `_id`, `__v`, BSON types, and
whatever else the driver puts on the result.

Stronger:

```ts
async function findUser(id: UserId): Promise<User | null> {
  const document = await collection.findOne({ _id: id })
  return document ? toUser(document) : null
}
```

The repository owns the mapping. The rest of the system sees `User`.

With Effect:

```ts
const findUser = (
  id: UserId,
): Effect.Effect<Option.Option<User>, RepositoryError> =>
  Effect.gen(function* () {
    const document = yield* Effect.tryPromise({
      try: () => collection.findOne({ _id: id }),
      catch: (cause) => new RepositoryError({ cause }),
    })

    return Option.fromNullable(document).pipe(Option.map(toUser))
  })
```

The signature carries the boundary in its types. No driver shapes leak out.

### map external concepts at the edge

Weak:

```ts
async function importStripeCustomer(stripeId: string): Promise<void> {
  const customer = await stripe.customers.retrieve(stripeId)
  await users.save(customer)
}
```

The Stripe shape now lives in the user store. The next Stripe field rename
becomes a database migration.

Stronger:

```ts
async function importStripeCustomer(stripeId: string): Promise<void> {
  const customer = await stripe.customers.retrieve(stripeId)
  const user = toUser(customer)
  await users.save(user)
}
```

Translate external shapes once, where they enter. The rest of the system works
in domain terms.

### explicit dependencies

Weak:

```ts
import { db } from "../infra/db"
import { logger } from "../infra/logger"
import { metrics } from "../infra/metrics"

export async function activateUser(id: UserId): Promise<void> {
  logger.info({ id }, "activating user")
  await db.user.update({ _id: id }, { $set: { status: "active" } })
  metrics.increment("users.activated")
}
```

The signature says `(UserId) -> Promise<void>`. The function actually touches
the database, the logger, and the metrics client. Tests have to patch modules;
refactors have to chase imports.

Stronger:

```ts
function makeActivateUser({ users, logger, metrics }: ActivateUserDeps) {
  return async (id: UserId): Promise<void> => {
    logger.info({ id }, "activating user")
    await users.update(id, { status: "active" })
    metrics.increment("users.activated")
  }
}
```

The dependencies are visible at the boundary. Whether the codebase wires this
with a factory, NestJS providers, or constructor arguments, the point is the
same: name what you depend on.

With Effect, the dependency lives in the type itself:

```ts
class Users extends Context.Tag("Users")<
  Users,
  { readonly update: (id: UserId, patch: UserPatch) => Effect.Effect<void> }
>() {}

const activateUser = (id: UserId): Effect.Effect<void, never, Users> =>
  Effect.gen(function* () {
    const users = yield* Users
    yield* Effect.logInfo("activating user").pipe(Effect.annotateLogs({ id }))
    yield* users.update(id, { status: "active" })
  })
```

The third type parameter, `Users`, says exactly what this function needs from
its environment. A `Layer` supplies it at the edge. Forgetting to provide it is
a type error.

### do not reach into a sibling's internals

Weak:

```ts
// in machines/scheduler.ts
import { normalizeUserId } from "../users/internal/normalize"
```

The folder name says "do not". The import says "anyway". When `users` changes
its internals, `machines` breaks at a distance.

Stronger:

```ts
// in machines/scheduler.ts
import { normalizeUserId } from "../users"
```

If the helper is not on the `users` public surface, either expose it
deliberately, move it to `lib`, or duplicate the small bit you need until a
real shared concept emerges.

### co-change is a signal

Suspicious:

```ts
// users/user.service.ts
import { recalculateInvoice } from "../billing/invoice.service"

export async function updateUserAddress(/* ... */) {
  // ...
  await recalculateInvoice(user.activeInvoiceId)
}

// billing/invoice.service.ts
import { findUserBillingDetails } from "../users/user.service"

export async function recalculateInvoice(/* ... */) {
  const details = await findUserBillingDetails(/* ... */)
  // ...
}
```

A cycle, or a strong co-change pattern even without a cycle, says the boundary
is in the wrong place.

Stronger:

```ts
// users/user.service.ts
export async function updateUserAddress(/* ... */) {
  await users.update(/* ... */)
  await events.publish(new UserAddressChanged({ userId: user.id }))
}

// billing/invoice.service.ts
events.subscribe(UserAddressChanged, async (event) => {
  await invoices.recalculateFor(event.userId)
})
```

One side owns the change. The other side reacts. Merging the modules is also
a valid answer when the split was never real to begin with.

### cross boundaries with data, not behavior

Weak:

```ts
queue.publish("user-registered", {
  email: input.email,
  onSuccess: () => analytics.track("registered", input),
})
```

A callback in a queue message turns the queue into a hidden RPC. The closure
carries context that the message body cannot describe.

Stronger:

```ts
queue.publish("user-registered", {
  userId: user.id,
  email: user.email,
  registeredAt: clock.now(),
})

queue.consume("user-registered", async (event) => {
  await analytics.track("registered", event)
})
```

Plain data crosses well. It serializes, stores, replays, and versions. A
service written in another language a year from now can still read it. The
consumer owns its own behavior.

With Effect, the contract can be a schema:

```ts
class UserRegistered extends Schema.Class<UserRegistered>("UserRegistered")({
  userId: Schema.String,
  email: Schema.String,
  registeredAt: Schema.String,
}) {}

const encodeUserRegistered = Schema.encodeSync(UserRegistered)
const decodeUserRegistered = Schema.decodeUnknown(UserRegistered)

// publisher: build a domain value, encode it once
yield* queue.publish(
  "user-registered",
  encodeUserRegistered(
    new UserRegistered({
      userId: user.id,
      email: user.email,
      registeredAt: new Date().toISOString(),
    }),
  ),
)

// consumer: decode at its own boundary, then react
const event = yield* decodeUserRegistered(message.body)
yield* analytics.track("registered", event)
```

The schema is the contract. The wire is data on both sides; behavior stays
local to each consumer.

### narrow the public surface

Weak:

```ts
// users/index.ts
export * from "./internal"
```

The module's public surface is now everything it happens to contain. Every
consumer can reach for anything; future cleanup will hurt.

Stronger:

```ts
// users/index.ts
export { createUser, activateUser, type User, type UserId } from "./user"
```

A named export list is the contract. Anything not on the list is private.
Internal refactors stop being API changes.
