# performance is not optional

## reasoning

A system that returns the right answer too late is wrong. Latency and resource
use are part of the behavior the user sees. Treat them like any other
requirement.

Know the rough scale before you commit to a shape. A loop over ten items and
a loop over ten million items want different code, and changing the shape
after the fact is much more expensive than picking it once.

Resources have different costs. Network, disk, memory, and CPU do not fail
in the same way and do not improve with the same fix. CPU-bound work may
benefit from parallelism. IO-bound work usually benefits first from fewer
round trips, batching, or bounded concurrency.

Removing work usually beats speeding it up. A cache that turns a thousand
repeated database lookups into one almost always saves more wall time than
rewriting the loop that drives them.

Three patterns cause most performance problems: accidental quadratic work,
chatty IO, and unbounded memory. They are easy to miss in tests because tests
usually run on small data. Look for them on every change that touches a hot
path or a collection whose size you do not control. When the rough shape is
right, profile before going deeper. Intuition about hot spots is usually
wrong.

## examples

### know the expected scale

Weak:

```ts
async function buildReport(orders: Order[]): Promise<Report> {
  const customers = await Promise.all(
    orders.map((order) => loadCustomer(order.customerId)),
  )
  return summarize(orders, customers)
}
```

Fine for ten orders. At one hundred thousand orders this is one hundred
thousand customer lookups, most of them duplicates.

Stronger:

```ts
async function buildReport(orders: Order[]): Promise<Report> {
  const customerIds = unique(orders.map((order) => order.customerId))
  const customers = await loadCustomersByIds(customerIds)
  return summarize(orders, customers)
}
```

Now there is one batch query, and the cost scales with the number of unique
customers.

### avoid accidental quadratic work

Weak:

```ts
const enriched = orders.map((order) => ({
  ...order,
  customer: customers.find((c) => c.id === order.customerId),
}))
```

`find` inside `map` is `N * M`. Negligible at a few hundred items each side,
but at ten thousand each side it adds up to a hundred million comparisons per
request.

Stronger:

```ts
const customersById = new Map(customers.map((c) => [c.id, c]))

const enriched = orders.map((order) => ({
  ...order,
  customer: customersById.get(order.customerId),
}))
```

The lookup map is built once. Enrichment is then a single pass over
`orders`. Total cost is `O(N + M)`.

### avoid chatty IO

Weak:

```ts
const users: User[] = []
for (const id of userIds) {
  const row = await db.user.findById(id)
  users.push(toUser(row))
}
```

One round trip per user. A list of five hundred users is five hundred
sequential round trips. Network latency dominates the wall clock.

Stronger (batch):

```ts
const rows = await db.user.findManyByIds(userIds)
const users = rows.map(toUser)
```

Stronger (bounded parallelism, when batching is not available):

```ts
const users = await pMap(userIds, (id) => db.user.findById(id).then(toUser), {
  concurrency: 16,
})
```

When the storage layer offers a batch API, use it. When it does not, use
bounded parallelism. Sequential round trips in a loop are the last resort,
and unbounded parallelism only moves the overload to the dependency.

With Effect:

```ts
const users = yield* Effect.forEach(userIds, loadUser, { concurrency: 16 })
```

`Effect.forEach` with `concurrency` gives you bounded parallelism without
writing the bookkeeping by hand.

### prefer avoiding work over making work faster

Weak:

```ts
async function getExchangeRate(from: Currency, to: Currency): Promise<number> {
  return rates.fetch(from, to)
}
```

If the rate is requested two hundred times in a single request, that is two
hundred calls to a slow upstream.

Stronger:

```ts
const cache = new Map<string, number>()

async function getExchangeRate(from: Currency, to: Currency): Promise<number> {
  const key = `${from}:${to}`
  const cached = cache.get(key)
  if (cached !== undefined) return cached

  const rate = await rates.fetch(from, to)
  cache.set(key, rate)
  return rate
}
```

Speeding up `rates.fetch` would barely move the wall time. The cache turns
two hundred calls into one. Bound the cache size and decide on a staleness
policy if the rate can change during a request.

### bound your memory

Weak:

```ts
async function exportOrders(): Promise<void> {
  const orders = await db.order.findAll()
  await writeCsv(orders.map(toRow))
}
```

`findAll` loads every order into memory. The job works at ten thousand rows
and falls over at ten million.

Stronger:

```ts
async function exportOrders(): Promise<void> {
  for await (const order of db.order.cursor()) {
    await writeCsvRow(toRow(order))
  }
}
```

Memory use becomes constant per row. The job runs at any scale the database
can serve. The same approach applies to file IO, large HTTP responses, and
queue draining.

### ask for less over the wire

Weak:

```ts
const users = await db.user.findMany({ where: { active: true } })
const emails = users.map((u) => u.email)
```

Pulling every column for every active user to use one field is bandwidth and
memory wasted on data the caller throws away.

Stronger:

```ts
const emails = await db.user.findMany({
  where: { active: true },
  select: { email: true },
})
```

Project to the fields you need. The same applies to HTTP responses, GraphQL
queries, and event payloads.

### measure before deep optimization

Weak:

```ts
// rewriting the inner loop in a hand-unrolled form
function sum(xs: number[]): number {
  let s = 0
  let i = 0
  const len = xs.length
  for (; i + 4 <= len; i += 4) {
    s += xs[i] + xs[i + 1] + xs[i + 2] + xs[i + 3]
  }
  for (; i < len; i++) s += xs[i]
  return s
}
```

If the profile shows the cost is in the query that produced `xs`, unrolling
the sum is wasted effort and harder to read.

Stronger:

```ts
function sum(xs: number[]): number {
  return xs.reduce((acc, x) => acc + x, 0)
}
```

Profile first. Optimize whichever entry sits at the top of the profile. A
small per-call cost can dominate the total when the call sits in a tight
loop, which is hard to estimate by eye.
