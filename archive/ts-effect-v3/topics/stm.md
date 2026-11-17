# STM

## What it is
`STM` transactions for atomic, composable updates across multiple refs (`TRef`).

## When to use
- Invariants spanning multiple mutable values

## When not to use
- Single-value updates (`Ref`)

## Minimal examples
```ts
import { Effect, STM, TRef } from "effect"

const program = Effect.gen(function* () {
  const a = yield* TRef.make(100).pipe(STM.commit)
  const b = yield* TRef.make(50).pipe(STM.commit)
  yield* STM.commit(
    STM.gen(function* () {
      yield* TRef.update(a, (n) => n - 10)
      yield* TRef.update(b, (n) => n + 10)
    })
  )
})
```

## Common pitfalls
- Running side effects inside STM transactions

## See also
- `../sections/10-core-patterns.md`
- `refs.md`
