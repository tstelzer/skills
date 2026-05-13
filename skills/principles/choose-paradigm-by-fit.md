# choose paradigm by fit

## reasoning

No paradigm wins for every problem. The shape of the problem dictates the
right tool. A ten-line list transformation and a thousand-line database
client have nothing structural in common, and forcing one paradigm onto
both makes both worse.

Functional style fits most domain logic. Pure functions, immutable values,
and explicit effects make business rules easy to test and easy to
recombine. Most application code reads "data in, decision out", which is
the shape FP is built for.

Object-oriented style fits identity and lifecycle. A connection pool, a
hardware device, or a long-lived session exists over time, owns resources,
and holds encapsulated mutable state. Modelling those as pure functions
usually produces a thin wrapper around the class you tried to avoid.

Imperative style still wins in some places. Tight inner loops, low-level
state machines, and code where an early `break` or `return` makes the
intent clear all read more clearly as straight imperative code. A `for`
loop with a `break` is usually easier to follow than a `reduce` with a
sentinel value.

Cross paradigm boundaries with plain data. A message that carries methods,
or a database row reconstituted into class instances, locks the consumer
into the producer's paradigm. Plain records let each side pick the style
that fits the work it has to do.

## examples

### imperative when it is clearer

Weak:

```ts
function maxConsecutiveLoginFailures(events: LoginEvent[]): number {
  return events.reduce(
    (state, event) => {
      const current = event.type === "failure" ? state.current + 1 : 0
      return { current, max: Math.max(state.max, current) }
    },
    { current: 0, max: 0 },
  ).max
}
```

The accumulator with two fields is a sign that the operation is stateful.
The `reduce` hides the state changes inside a callback.

Stronger:

```ts
function maxConsecutiveLoginFailures(events: LoginEvent[]): number {
  let max = 0
  let current = 0

  for (const event of events) {
    if (event.type === "failure") {
      current += 1
      if (current > max) max = current
    } else {
      current = 0
    }
  }

  return max
}
```

The state lives in two named variables, and the transitions are explicit
statements. No accumulator object to design and no callback to read.

### functional for domain logic

Weak:

```ts
class TaxCalculator {
  private subtotal: Money = zero

  constructor(private readonly order: Order) {}

  computeSubtotal(): void {
    this.subtotal = sumMoney(this.order.items.map((i) => i.price))
  }

  computeTotal(): Money {
    return addMoney(
      this.subtotal,
      applyRate(this.subtotal, this.order.taxRate),
    )
  }
}

const calc = new TaxCalculator(order)
calc.computeSubtotal()
const total = calc.computeTotal()
```

`TaxCalculator` has no identity, no lifecycle, and no resources to own. It
is a holder for two pure functions, with an instantiation step the caller
has to remember.

Stronger:

```ts
const subtotal = (order: Order): Money =>
  sumMoney(order.items.map((i) => i.price))

const total = (order: Order): Money => {
  const base = subtotal(order)
  return addMoney(base, applyRate(base, order.taxRate))
}

const orderTotal = total(order)
```

Pure functions composing over a value. Each is testable on its own, and
nothing has to be constructed before calling them.

### object-oriented for identity and lifecycle

Weak:

```ts
type PoolState = {
  idle: Connection[]
  inUse: Set<Connection>
  maxSize: number
}

async function acquire(
  state: PoolState,
): Promise<[Connection, PoolState]> {
  // immutable update returning new state
}

function release(state: PoolState, conn: Connection): PoolState {
  // ...
}
```

Every caller has to thread `state` through and decide which copy is
current. Concurrent callers collide because the resource itself is shared
but the "current state" lives in whatever variable was last assigned.

Stronger:

```ts
class ConnectionPool {
  private idle: Connection[] = []
  private inUse = new Set<Connection>()

  constructor(private readonly maxSize: number) {}

  async acquire(): Promise<Connection> {
    // ...
  }

  release(conn: Connection): void {
    // ...
  }

  async close(): Promise<void> {
    // close every connection currently held
  }
}
```

The pool owns its connections and exposes a small set of operations.
Concurrent callers share the same instance and see consistent state.
Identity, lifecycle, and encapsulated mutable state live together where
they belong.

With Effect:

```ts
class ConnectionPool extends Context.Tag("ConnectionPool")<
  ConnectionPool,
  { readonly acquire: Effect.Effect<Connection, never, Scope.Scope> }
>() {}

const ConnectionPoolLive = (maxSize: number) =>
  Layer.scoped(
    ConnectionPool,
    Effect.gen(function* () {
      const idle: Connection[] = []
      const inUse = new Set<Connection>()

      yield* Effect.addFinalizer(() =>
        Effect.forEach(
          [...idle, ...inUse],
          (conn) => Effect.promise(() => conn.close()),
          { discard: true },
        ),
      )

      return ConnectionPool.of({
        acquire: Effect.acquireRelease(
          openOrReuse(idle, inUse, maxSize),
          (conn) => Effect.sync(() => returnToIdle(conn, idle, inUse)),
        ),
      })
    }),
  )
```

Connection release and pool shutdown are wired into the runtime. Callers
cannot leak.

### plain data at boundaries

Weak:

```ts
class UserDocument {
  constructor(
    public id: string,
    public email: string,
    private hashedPassword: string,
  ) {}

  isPasswordValid(plain: string): boolean {
    return bcrypt.compareSync(plain, this.hashedPassword)
  }
}

queue.publish("user-registered", new UserDocument(/* ... */))
```

The class crosses the boundary. A consumer in another service or another
language cannot reconstruct the method, and the wire format now leaks
prototype shape.

Stronger:

```ts
queue.publish("user-registered", {
  id: user.id,
  email: user.email,
  registeredAt: clock.now(),
})
```

A plain record crosses. The consumer reads it as data and applies whatever
local behavior its own paradigm prefers.

### composition over inheritance

Weak:

```ts
class BaseLogger {
  log(message: string): void {
    /* write */
  }
}

class FormattingLogger extends BaseLogger {
  override log(message: string): void {
    super.log(`[${new Date().toISOString()}] ${message}`)
  }
}

class FilteringLogger extends FormattingLogger {
  override log(message: string): void {
    if (!message.includes("noise")) super.log(message)
  }
}
```

Adding a fourth concern means another subclass and another `override`.
Whichever subclass sits at the bottom of the chain determines the final
behavior, and the chain order becomes load-bearing in invisible ways.

Stronger:

```ts
type LogFn = (message: string) => void

const withTimestamp =
  (next: LogFn): LogFn =>
  (message) =>
    next(`[${new Date().toISOString()}] ${message}`)

const withFilter =
  (predicate: (message: string) => boolean) =>
  (next: LogFn): LogFn =>
  (message) => {
    if (predicate(message)) next(message)
  }

const log = withFilter((m) => !m.includes("noise"))(
  withTimestamp(console.log),
)
```

Each piece is a small function. The composition is explicit at the call
site, and dropping or reordering a piece is a one-line edit.

### paradigms combine in real systems

```ts
class UserService {
  constructor(private readonly repo: UserRepository) {}

  async rename(id: UserId, newName: string): Promise<User> {
    const user = await this.repo.findById(id)
    if (user === null) throw new UserNotFound(id)
    const renamed = renamePure(user, newName)
    await this.repo.save(renamed)
    return renamed
  }
}

const renamePure = (user: User, newName: string): User => ({
  ...user,
  name: newName,
})
```

`UserService` is framework-facing orchestration. It uses constructor
injection because the framework wires dependencies that way. The domain
rule stays a pure function over a `User` value.

With Effect:

```ts
class UserRepository extends Context.Tag("UserRepository")<
  UserRepository,
  {
    readonly findById: (id: UserId) => Effect.Effect<User | null>
    readonly save: (user: User) => Effect.Effect<void>
  }
>() {}

const renameUser = (id: UserId, newName: string) =>
  Effect.gen(function* () {
    const repo = yield* UserRepository
    const user = yield* repo.findById(id)
    if (user === null) {
      return yield* Effect.fail(new UserNotFound({ id }))
    }
    const renamed = renamePure(user, newName)
    yield* repo.save(renamed)
    return renamed
  })
```

The dependency and the failure case are in the type. The domain rule is
still plain data in, plain data out.
