# Deferred

## What it is
One-shot synchronization: a value is produced once and consumers block until it is available.

## When to use
- Signaling between fibers (e.g. "ready" signal)
- Converting callback-based APIs to Effect

## When not to use
- Multiple values over time (use `Queue` or `PubSub`)

## Minimal examples
```ts
import { Effect, Deferred } from "effect"

const program = Effect.gen(function* () {
  const d = yield* Deferred.make<number>()
  yield* Effect.fork(Deferred.succeed(d, 42))
  return yield* Deferred.await(d)
})
```

## Common pitfalls
- Awaiting a deferred that is never completed (deadlock)

## See also
- `../sections/10-core-patterns.md`
- `queue.md`
