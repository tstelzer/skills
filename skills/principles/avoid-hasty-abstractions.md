# avoid hasty abstractions

## reasoning

An abstraction is a bet about what will vary across its call sites. A wrong
bet is expensive to undo, because every caller already depends on the wrong
shape. Duplication costs less in practice. Two similar functions in the same
module can be consolidated later, once the actual pattern is clear.

Wait until the pattern is clear before extracting it. Two similar functions
are not enough data to know what should vary across them and what should
stay shared. The third instance usually reveals which differences are
coincidental and which actually have to be reflected in code.

When an abstraction is wrong, the symptom is usually boolean flags or option
bags. New callers add knobs to bend the shared function toward their case.
Every knob adds branching, and the function becomes harder to read than the
duplications it replaced. The fix is to split the function back into focused
versions. Adding another flag postpones the same problem.

Configuration is an abstraction over time. Every config key is a claim that
the value varies between environments or over the life of the system. Most
config keys do not earn that claim: ops never touches them, and the default
ships everywhere. Inline values that have never varied and probably never
will. A config key adds documentation, an ops surface, and a chance of
misconfiguration.

## examples

### duplicate until the pattern is clear

Weak:

```ts
async function notify(
  type: "user" | "admin",
  id: string,
  message: string,
): Promise<void> {
  const recipient =
    type === "user"
      ? await users.findById(id as UserId)
      : await admins.findById(id as AdminId)
  await notifications.send(recipient.email, message)
}
```

The `type` parameter and the casts are signs the two shapes do not actually
match. The abstraction was extracted on the second instance, before the real
variation showed up.

Stronger:

```ts
async function notifyUser(userId: UserId, message: string): Promise<void> {
  const user = await users.findById(userId)
  await notifications.send(user.email, message)
}

async function notifyAdmin(adminId: AdminId, message: string): Promise<void> {
  const admin = await admins.findById(adminId)
  await notifications.send(admin.email, message)
}
```

The duplication is small and local. When a third recipient type appears, the
real shape of the abstraction becomes visible.

### wrong abstractions accumulate flags

Weak:

```ts
async function fetchUser(
  id: UserId,
  options: {
    includeProfile?: boolean
    includeOrders?: boolean
    includeAddresses?: boolean
    skipCache?: boolean
    raw?: boolean
  } = {},
): Promise<User | RawUser> {
  // ~80 lines of branching on `options`
}
```

Each new caller added a flag to make `fetchUser` fit its case. The result is
one function that no caller fully exercises and that nobody can refactor
safely.

Stronger:

```ts
async function getUser(id: UserId): Promise<User>
async function getUserWithOrders(id: UserId): Promise<UserWithOrders>
async function getRawUserDocument(id: UserId): Promise<UserDocument>
```

Three focused functions, each readable on its own. Shared helpers like
`toUser` and `toUserDocument` still exist, but the call sites stop carrying
configuration.

### shape similarity is not the signal

Weak:

```ts
function processItems<T extends { active: boolean }>(
  items: T[],
  transform: (item: T) => T,
): T[] {
  return items.filter((x) => x.active).map(transform)
}

const activeUsers = processItems(users, redact)
const activeProducts = processItems(products, applyDiscount)
const activeOrders = processItems(orders, summarize)
```

`User`, `Product`, and `Order` all carry an `active` field today. They will
not stay aligned. The first time "active" means something different for
`Order` than for `User`, the abstraction either breaks or grows another
flag.

Stronger:

```ts
const activeUsers = users.filter(isActive).map(redact)
const activeProducts = products.filter(isAvailable).map(applyDiscount)
const activeOrders = orders.filter(isOpen).map(summarize)
```

Each domain has its own predicate, named for the domain concept rather than
the row shape.

### inline values that are not shared

Weak:

```ts
export const MAX_RECENT_ORDERS = 25
export const RECENT_ORDER_DAYS = 30

function recentOrders(customerId: CustomerId): Promise<Order[]> {
  return orders.findRecent({
    customerId,
    days: RECENT_ORDER_DAYS,
    limit: MAX_RECENT_ORDERS,
  })
}
```

The constants are exported before another caller exists. The names make a
local product choice look like a shared contract.

Stronger:

```ts
function recentOrders(customerId: CustomerId): Promise<Order[]> {
  return orders.findRecent({
    customerId,
    days: 30,
    limit: 25,
  })
}
```

If another use appears, name the concept then. If ops needs to tune it,
promote it to config then.

### configuration is an abstraction

Weak:

```ts
const Config = Schema.Struct({
  retryAttempts: Schema.Number,
  retryInitialDelayMs: Schema.Number,
  retryBackoffMultiplier: Schema.Number,
  retryMaxDelayMs: Schema.Number,
  retryJitter: Schema.Boolean,
})
```

Five env vars, five schema fields, five documentation entries. Every field
claims that ops will tune this independently.

Stronger:

```ts
const retrySchedule = Schedule.exponential("100 millis").pipe(
  Schedule.compose(Schedule.recurs(3)),
)

const fetchUser = (id: UserId) =>
  http.get(`/users/${id}`).pipe(Effect.retry(retrySchedule))
```

The schedule lives in the code that retries. Changing it later is a code
edit in one place. Promote pieces of it to config only when ops actually
needs to tune them.
