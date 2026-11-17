# Concurrency

## What it is
Effect concurrency primitives: bounded/unbounded concurrency, fibers, racing, interruption, and schedule composition.

## When to use
- Parallelism with explicit limits
- Lifecycle control of concurrent tasks

## When not to use
- Purely sequential flows with no parallel benefit

## Minimal examples
```ts
import { Effect, Fiber } from "effect"

const program = Effect.gen(function* () {
  const fiber = yield* Effect.fork(longRunningTask)
  yield* Effect.sleep("1 second")
  return yield* Fiber.join(fiber)
})
```

## Key APIs
- Concurrency options: `number | "unbounded" | "inherit"`
- Forking: `fork`, `forkDaemon`, `forkScoped`, `forkIn`
- Fiber ops: `Fiber.join`, `Fiber.await`, `Fiber.interrupt`, `Fiber.zip`
- Racing: `race`, `raceAll`, `raceFirst`, `raceWith`
- Interruption: `onInterrupt`, `disconnect`, `uninterruptible`, `interruptible`

## Common pitfalls
- Using unbounded concurrency where bounded is required
- Ignoring interruption cleanup paths

## See also
- `../sections/10-core-patterns.md`
- `schedule-retry.md`
- `semaphore.md`
