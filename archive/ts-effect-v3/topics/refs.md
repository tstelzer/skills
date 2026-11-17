# Refs

## What it is
Mutable references: `Ref`, `SynchronizedRef`, `FiberRef`.

## When to use
- Shared state updates (`Ref`)
- Effectful atomic update logic (`SynchronizedRef`)
- Fiber-local context (`FiberRef`)

## When not to use
- Multi-ref atomic transactions (use `STM`)

## Minimal examples
```ts
import { Effect, Ref } from "effect"

const program = Effect.gen(function* () {
  const counter = yield* Ref.make(0)
  yield* Ref.update(counter, (n) => n + 1)
  return yield* Ref.get(counter)
})
```

## Common pitfalls
- Using `Ref` for cross-ref invariants

## See also
- `../sections/10-core-patterns.md`
- `stm.md`
