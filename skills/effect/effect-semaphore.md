# Semaphore

Permit-based concurrency control.

```ts
import { Effect } from "effect"

const program = Effect.gen(function* () {
  const sem = yield* Effect.makeSemaphore(3) // 3 permits
  
  // Acquire 1 permit, run effect, release
  const guarded = sem.withPermits(1)(task)
  
  // Run 10 tasks, max 3 concurrent
  yield* Effect.all(Array(10).fill(guarded), { concurrency: "unbounded" })
})
```
