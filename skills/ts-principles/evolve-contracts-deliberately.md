# evolve contracts deliberately

## reasoning

Everything outside your module that depends on the shape of what you
produce or consume is a contract. Database columns, queue messages, HTTP
responses, events, and config schemas all bind producers and consumers to
a particular shape over time. Treating them like local refactors causes
outages.

Know who consumes before you change. The number and ownership of
consumers determine which kind of change is safe. A single service in the
same deploy unit lets you migrate the contract atomically. A queue with
five subscribers across two languages requires a multi-step rollout.
Treat backwards compatibility as a cost you choose to pay because
specific consumers depend on the old shape.

Prefer additive changes when compatibility matters. Adding an optional
field, a new event variant, or a new endpoint extends the contract
without invalidating existing consumers. Renames, removals, and type
changes invalidate them, and every invalidation has to be coordinated
with the consumer fleet.

Rolling deploys make the old and new shapes coexist. While both versions
are running, every contract has to be readable by both. Plan for the
overlap: write the new field while still writing the old, switch readers
in a later release, then drop the old field. Each step is small enough to
revert on its own.

Compatibility code is temporary. A shim that lets v1 readers consume v2
data has a job to do while both versions exist. Once they do not, the
shim adds branches and clutter without delivering value. Track who is
still on the old version and remove the shim when the last consumer has
migrated.

## examples

### prefer additive changes

Weak:

```ts
// before
type UserRegistered = {
  userId: UserId
  email: string
}

// after: renamed email to contactEmail in one diff
type UserRegistered = {
  userId: UserId
  contactEmail: string
}
```

Every existing consumer breaks the moment the new producer ships. The
queue still holds messages in the old shape, and the consumers that read
those messages cannot decode them.

Stronger:

```ts
type UserRegistered = {
  userId: UserId
  email: string // kept for the migration window
  contactEmail: string
}
```

New producers populate both fields. Old consumers keep reading `email`.
Once every consumer reads `contactEmail`, a later release removes
`email`.

### plan for rolling deploys

The naive change replaces the field in one deploy. Old instances still
write the old shape, and new instances reading those records crash.

Stronger: split the change across releases.

```ts
// release 1: dual-write
type Order = {
  id: OrderId
  orderTotal: Money // legacy, kept for now
  orderTotalCents: number // new canonical field
}
function writeOrder(o: Order): Order {
  return { ...o, orderTotalCents: toCents(o.orderTotal) }
}
// readers still use orderTotal

// release 2: switch readers
function readTotal(o: Order): number {
  return o.orderTotalCents ?? toCents(o.orderTotal)
}

// release 3: remove the old field once no instance still emits it
type Order = {
  id: OrderId
  orderTotalCents: number
}
```

Each step is reversible on its own. No release creates a moment where
running instances disagree on the shape.

### break the contract when no one depends on it

Weak:

```text
PR #1: add new column nullable, dual-write
PR #2: backfill rows
PR #3: switch readers
PR #4: remove the old column
```

For a table used by one service that ships in one deploy unit, this is
ceremony. There is no consumer fleet to coordinate with.

Stronger:

```text
PR #1: migration renames the column. The single reader is updated in
the same diff. Deploy together, done.
```

The discipline that protects external contracts is wasted on internal
ones. Spend it where consumers actually exist on a different release
than the producer.

### delete compatibility code once it is no longer needed

Weak:

```ts
function parseEvent(raw: unknown): Event {
  if (typeof raw === "object" && raw !== null && "version" in raw) {
    const version = (raw as { version: number }).version
    if (version === 2) return parseV2(raw)
    if (version === 1) return parseV1(raw)
  }
  // legacy: events from before "version" was a field, still in the
  // dead-letter queue from a 2023 incident
  return parseLegacy(raw)
}
```

The legacy branch is two years old. Nothing in production has emitted
that shape in eighteen months, but every new contributor still has to
read it and wonder whether it matters.

Stronger:

```ts
function parseEvent(raw: unknown): Event {
  const event = EventSchema.parse(raw)
  if (event.version === 2) return parseV2(event)
  if (event.version === 1) return parseV1(event)
}
```

Confirm no producer still emits the legacy shape, drain or replay the
queue, then delete the branch. Unsupported versions now fail in
`EventSchema` instead of falling through to legacy parsing. Compatibility
code that has outlived its consumers is clutter.

### tolerate both shapes in one place

Weak:

```ts
// scattered across three consumers
const contactEmail =
  event.version === 1 ? event.email : event.contactEmail
const userId = event.userId
```

The compatibility code lives in every consumer. Adding v3 means finding
every dispatch site, and every site is one place to forget.

Stronger:

```ts
type EventV1 = { version: 1; userId: string; email: string }
type EventV2 = { version: 2; userId: string; contactEmail: string }
type Canonical = { userId: string; contactEmail: string }

function normalize(event: EventV1 | EventV2): Canonical {
  if (event.version === 1) {
    return { userId: event.userId, contactEmail: event.email }
  }
  return { userId: event.userId, contactEmail: event.contactEmail }
}
```

Every consumer calls `normalize` once and works in `Canonical`. The
version branch lives in one function.

With Effect:

```ts
const EventV1 = Schema.Struct({
  version: Schema.Literal(1),
  userId: Schema.String,
  email: Schema.String,
})

const EventV2 = Schema.Struct({
  version: Schema.Literal(2),
  userId: Schema.String,
  contactEmail: Schema.String,
})

const Canonical = Schema.Struct({
  userId: Schema.String,
  contactEmail: Schema.String,
})

const Event = Schema.transform(Schema.Union(EventV1, EventV2), Canonical, {
  strict: true,
  decode: (event) =>
    event.version === 1
      ? { userId: event.userId, contactEmail: event.email }
      : { userId: event.userId, contactEmail: event.contactEmail },
  encode: (canonical) => ({
    version: 2 as const,
    userId: canonical.userId,
    contactEmail: canonical.contactEmail,
  }),
})
```

Decoding doubles as the boundary parse: malformed messages fail with a
typed error before any consumer sees them. Deleting v1 is a one-diff
change.
