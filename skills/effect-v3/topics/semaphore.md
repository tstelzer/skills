# Semaphore

## What it is
Limits concurrent access to a resource. `Effect.makeSemaphore(n)` creates a semaphore with `n` permits.

## When to use
- Rate limiting, connection pools, bounded concurrency

## When not to use
- Single-access resources (no semaphore needed)

## Minimal examples
```ts
import { Effect } from "effect"

const program = Effect.gen(function* () {
  const sem = yield* Effect.makeSemaphore(4)
  yield* sem.withPermits(1)(Effect.void)
})
```

## Common pitfalls
- Holding permits across async boundaries without scoping

## See also
- `../sections/10-core-patterns.md`
- `queue.md`
