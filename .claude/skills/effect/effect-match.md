# Pattern Matching

Type-safe pattern matching with exhaustiveness checking.

```ts
import { Match } from "effect"
```

## Creating Matchers

| Constructor       | Description                |
| ----------------- | -------------------------- |
| `Match.type<T>()` | Match against a type       |
| `Match.value(v)`  | Match against a value      |

```ts
// By type - returns a function
const match = Match.type<string | number>().pipe(
  Match.when(Match.number, (n) => `number: ${n}`),
  Match.when(Match.string, (s) => `string: ${s}`),
  Match.exhaustive
)
match(42) // "number: 42"

// By value - returns result directly
const result = Match.value(input).pipe(
  Match.when({ name: "John" }, (u) => u.age),
  Match.orElse(() => 0)
)
```

## Patterns

| Pattern       | Description                           |
| ------------- | ------------------------------------- |
| `when`        | Match by predicate or value           |
| `not`         | Match anything except specified value |
| `tag`         | Match discriminated union by `_tag`   |

```ts
// Predicates and values
Match.when({ age: (a) => a > 18 }, () => "adult")
Match.when({ age: 18 }, () => "just 18")

// Exclude specific value
Match.not("hi", () => "not hi")

// Discriminated unions
type Event = { _tag: "success"; data: string } | { _tag: "error"; error: Error }

Match.type<Event>().pipe(
  Match.tag("success", (e) => e.data),
  Match.tag("error", (e) => e.error.message),
  Match.exhaustive
)
```

## Built-in Predicates

`Match.string` `Match.number` `Match.boolean` `Match.bigint` `Match.symbol`
`Match.date` `Match.null` `Match.undefined` `Match.defined` `Match.any`
`Match.nonEmptyString` `Match.record` `Match.is(...values)` `Match.instanceOf(Class)`

## Finalizers

| Finalizer    | Description                                  |
| ------------ | -------------------------------------------- |
| `exhaustive` | Require all cases handled (compile error)    |
| `orElse`     | Fallback for unmatched cases                 |
| `option`     | Wrap result in `Option` (None if unmatched)  |
| `either`     | Wrap result in `Either` (Left if unmatched)  |

```ts
Match.exhaustive           // TypeScript error if cases missing
Match.orElse(() => "default")
Match.option               // Some(result) or None
Match.either               // Right(result) or Left(unmatched)
```

## Enforce Return Type

```ts
Match.type<Input>().pipe(
  Match.withReturnType<string>(), // Must be first!
  Match.when(...),
  Match.exhaustive
)
```
