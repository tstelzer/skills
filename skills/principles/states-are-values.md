# states are values

## reasoning

A type defines the set of states a value can hold. Every combination the type
admits is a state the program will eventually reach, including the ones
nobody meant to allow.

When a type permits combinations that should be impossible, every consumer
has to invent rules for which ones are real. Those rules tend to be implicit
and inconsistent across the codebase. Excluding the combinations from the
type turns the same question into a compile error.

Name the in-flight states. State machines spend most of their time between
the terminal ones, and a field like `done: boolean` flattens "submitted, not
acknowledged", "acknowledged, not settled", and "settled, then refunded"
into the same `false`. Once each case has a name, dashboards, logs, and
retry code can share the same vocabulary.

Duplicated state can drift. When two stored fields must always agree, every
code path has to remember to update both, and forgetting one creates a
silent inconsistency. The exception is a snapshot that must stay stable
while its inputs change, like the price recorded against an order at
checkout.

## examples

### model impossible states as impossible

Weak:

```ts
type RemoteData<A> = {
  isLoading: boolean
  data?: A
  error?: Error
}
```

This type permits eight combinations, including `isLoading: true` with both
`data` and `error` already set. Every consumer has to guess which
combinations are real.

Stronger:

```ts
type RemoteData<A> =
  | { status: "Idle" }
  | { status: "Loading" }
  | { status: "Success"; data: A }
  | { status: "Failure"; error: Error }
```

Four exact states. The compiler rules out the rest.

With Effect Schema:

```ts
const Idle = Schema.Struct({ _tag: Schema.Literal("Idle") })
const Loading = Schema.Struct({ _tag: Schema.Literal("Loading") })
const Success = Schema.Struct({
  _tag: Schema.Literal("Success"),
  user: Schema.Struct({ id: Schema.Number, name: Schema.String }),
})
const Failure = Schema.Struct({
  _tag: Schema.Literal("Failure"),
  message: Schema.String,
})

const UserState = Schema.Union(Idle, Loading, Success, Failure)
```

Decoding an unknown payload produces one of four exact shapes. The rest of
the code never sees the loose form.

### name in-flight states

Weak:

```ts
type Payment = {
  id: PaymentId
  amount: Money
  confirmed: boolean
}
```

`confirmed: false` covers every non-terminal state. A payment that was
recently submitted looks identical to one that has been retried five times.

Stronger:

```ts
type Payment =
  | { status: "Draft"; id: PaymentId; amount: Money }
  | { status: "Submitting"; id: PaymentId; amount: Money; attempt: number }
  | { status: "Settling"; id: PaymentId; amount: Money; submittedAt: Date }
  | { status: "Settled"; id: PaymentId; amount: Money; settledAt: Date }
  | { status: "Failed"; id: PaymentId; amount: Money; reason: FailureReason }
```

Each state carries only the fields that make sense for it. `attempt` exists
where retries happen. `submittedAt` exists once submission succeeded. The
state names show up in dashboards, retry policies, and support tooling with
the same meaning everywhere.

### exhaustive matching makes new states visible

A discriminated union pairs naturally with exhaustive matching. Adding a new
variant forces every caller to handle it.

```ts
function describe(state: Payment): string {
  switch (state.status) {
    case "Draft":
      return "not submitted"
    case "Submitting":
      return `attempt ${state.attempt}`
    case "Settling":
      return "awaiting bank"
    case "Settled":
      return "complete"
    case "Failed":
      return state.reason
  }
}
```

When `Payment` grows a `Refunded` variant, `describe` and every other
exhaustive switch produce a type error pointing at the missing case.

With Effect's `Match`:

```ts
const describe = Match.type<Payment>().pipe(
  Match.tag("Draft", () => "not submitted"),
  Match.tag("Submitting", (s) => `attempt ${s.attempt}`),
  Match.tag("Settling", () => "awaiting bank"),
  Match.tag("Settled", () => "complete"),
  Match.tag("Failed", (s) => s.reason),
  Match.exhaustive,
)
```

Same exhaustiveness guarantee as the switch above.

### do not store what you can derive

Weak:

```ts
type Order = {
  id: OrderId
  items: OrderItem[]
  subtotal: Money
  tax: Money
  total: Money
}
```

`subtotal`, `tax`, and `total` can disagree with each other and with
`items`. Every update path has to remember to recompute three fields, and
any path that forgets one creates a silent inconsistency.

Stronger:

```ts
type Order = {
  id: OrderId
  items: OrderItem[]
  taxRate: TaxRate
}

const subtotal = (order: Order): Money =>
  sumMoney(order.items.map((i) => i.price))

const tax = (order: Order): Money =>
  applyRate(subtotal(order), order.taxRate)

const total = (order: Order): Money => addMoney(subtotal(order), tax(order))
```

`items` and `taxRate` are the only stored fields. The totals are computed at
the call site.

### snapshots are not derived state

```ts
type Order = {
  id: OrderId
  items: ReadonlyArray<{
    productId: ProductId
    priceAtPurchase: Money
    quantity: number
  }>
  taxRate: TaxRate
}
```

`priceAtPurchase` is stored on the order even though `Product` already
carries a current price. The order records what the customer agreed to at
checkout, and that value must stay stable when the catalog price changes
later. The "do not store what you can derive" rule does not apply when the
input changes underneath the snapshot.
