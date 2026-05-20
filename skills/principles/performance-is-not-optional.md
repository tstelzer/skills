# performance is not optional

## reasoning

A system that returns the right answer too late is wrong. Latency and resource
use are part of the behavior the user sees. Treat them like any other
requirement.

Optimize shape before code. Know the rough scale before you commit to a
design: item count, request rate, fan-out, bytes moved, rows scanned, objects
allocated, locks held, retries attempted, and external calls made. If the bound
is not named, assume it will be exceeded.

Averages are weak evidence. Users feel tail latency. Mean latency hides it. In
a fan-out path, the slowest child often sets the parent latency. Track p95,
p99, and worst-case behavior for critical paths.

Resources queue before they look full. Low average utilization can hide short
bursts of saturation. Check utilization, saturation, and errors for every
resource that can block progress: CPU, memory, disk, network, database,
connection pool, worker pool, lock, queue, rate limit, and third-party service.

Concurrency is a budget. Parallelism helps only when the parallel part is the
bottleneck and the downstream resource can absorb it. Unbounded concurrency is
load amplification. It moves the queue to a dependency, a pool, or the kernel.

Overload is a design case. A system past capacity should reject, shed, defer,
or degrade before it fills every queue and times out every caller. Slow failure
is worse than fast refusal.

Removing work usually beats speeding it up. A cache that turns a thousand
repeated database lookups into one almost always saves more wall time than
rewriting the loop that drives them.

Caches are contracts. Every cache needs an owner, a key, a maximum size, a
freshness rule, an invalidation rule, and a failure mode. An unbounded cache is
a memory leak.

Three patterns cause most performance problems: accidental quadratic work,
chatty IO, and unbounded memory. They are easy to miss in tests because tests
usually run on small data. Add fan-out, queue growth, and allocation churn to
that list for service code. When the rough shape is right, profile before going
deeper. Intuition about hot spots is usually wrong.

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

### model the request cost

Weak:

```ts
async function listDashboard(userId: UserId): Promise<Dashboard> {
  const projects = await projectsForUser(userId)
  const cards = await Promise.all(
    projects.map((project) => loadCards(project.id)),
  )
  const comments = await Promise.all(
    cards.flat().map((card) => loadRecentComments(card.id)),
  )

  return buildDashboard(projects, cards.flat(), comments.flat())
}
```

The endpoint looks like one request. Its cost is `1 + projects + cards`
queries, and the caller controls the shape through account size.

Stronger:

```ts
async function listDashboard(userId: UserId): Promise<Dashboard> {
  const projects = await projectsForUser(userId, { limit: 50 })
  const projectIds = projects.map((project) => project.id)
  const cards = await loadCardsForProjects(projectIds, { limitPerProject: 20 })
  const comments = await loadRecentCommentsForCards(
    cards.map((card) => card.id),
    { limitPerCard: 5 },
  )

  return buildDashboard(projects, cards, comments)
}
```

The operation has visible bounds and batch points. Review the cost from the
public request inward.

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

### measure the tail

Weak:

```ts
metrics.histogram("http.request.latency", durationMs)
metrics.gauge("http.request.latency.avg", averageLatencyMs)
```

The average can stay flat while one user in a hundred waits seconds.

Stronger:

```ts
metrics.histogram("http.request.latency", durationMs, {
  route,
  status,
})
```

```text
Dashboard:
- request rate by route
- error rate by route
- p50, p95, p99 latency by route and status
- saturation for the limiting pool or dependency
```

Measure the distribution. Split success and failure latency when failures have
a different path.

### cap concurrency at the bottleneck

Weak:

```ts
await Promise.all(files.map((file) => uploadFile(file)))
```

A large import opens every upload at once. The queue moves to the network,
object store, file descriptors, or memory.

Stronger:

```ts
await pMap(files, uploadFile, { concurrency: 8 })
```

With Effect:

```ts
yield* Effect.forEach(files, uploadFile, {
  concurrency: 8,
  discard: true,
})
```

Pick the limit from the downstream resource, then measure. More concurrency
must earn its cost.

### reject before queues fill

Weak:

```ts
const queue: Job[] = []

function enqueue(job: Job): void {
  queue.push(job)
}
```

Under load, memory becomes the backpressure mechanism. The caller times out
after the service has already accepted work it cannot finish.

Stronger:

```ts
const queue = new BoundedQueue<Job>({ capacity: 1000 })

async function enqueue(job: Job): Promise<EnqueueResult> {
  const accepted = await queue.offer(job, { timeoutMs: 50 })
  return accepted
    ? { _tag: "Accepted" }
    : { _tag: "Rejected", retryAfterMs: 5000 }
}
```

Capacity is part of the interface. The service refuses work before it loses
control of memory and latency.

### make cache contracts explicit

Weak:

```ts
const usersById = new Map<UserId, User>()

async function loadUser(id: UserId): Promise<User> {
  const cached = usersById.get(id)
  if (cached) return cached

  const user = await users.findById(id)
  usersById.set(id, user)
  return user
}
```

The cache has no size, freshness rule, invalidation path, or failure mode.

Stronger:

```ts
const usersById = new LruCache<UserId, User>({
  maxEntries: 10_000,
  ttlMs: 60_000,
})

async function loadUser(id: UserId): Promise<User> {
  const cached = usersById.get(id)
  if (cached) return cached

  const user = await users.findById(id)
  usersById.set(id, user)
  return user
}

events.on("user.updated", (event) => {
  usersById.delete(event.userId)
})
```

The cache names its memory bound, staleness bound, and invalidation event.
