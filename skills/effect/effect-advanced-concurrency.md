# Effect Concurrency

## Concurrency Options

Many Effect APIs accept a `concurrency` option:

```ts
type Concurrency = number | "unbounded" | "inherit"
```

| Value         | Behavior                                                    |
| ------------- | ----------------------------------------------------------- |
| `undefined`   | Sequential execution (default)                              |
| `number`      | At most N effects run concurrently                          |
| `"unbounded"` | No limit on concurrent effects                              |
| `"inherit"`   | Inherits from `Effect.withConcurrency`, defaults unbounded  |

```ts
import { Effect } from "effect"

// Run up to 3 tasks concurrently
Effect.all([task1, task2, task3, task4], { concurrency: 3 })

// Set inherited concurrency for nested operations
program.pipe(Effect.withConcurrency(2))
```

## Fibers

Fibers are lightweight virtual threads. Every effect runs on a fiber.

```text
Fiber<Success, Error>
```

### Forking

| Combinator     | Lifetime                                    |
| -------------- | ------------------------------------------- |
| `fork`         | Tied to parent (structured concurrency)     |
| `forkDaemon`   | Tied to global scope                        |
| `forkScoped`   | Tied to current `Scope`                     |
| `forkIn`       | Tied to specified `Scope`                   |

```ts
import { Effect, Fiber } from "effect"

const program = Effect.gen(function* () {
  const fiber = yield* Effect.fork(longRunningTask)
  // fiber runs concurrently with parent
  yield* Effect.sleep("1 second")
  const result = yield* Fiber.join(fiber)
})
```

### Fiber Operations

| Operation         | Description                                       |
| ----------------- | ------------------------------------------------- |
| `Fiber.join`      | Wait for fiber, return result (or fail)           |
| `Fiber.await`     | Wait for fiber, return `Exit`                     |
| `Fiber.interrupt` | Interrupt fiber, wait for termination             |
| `Fiber.interruptFork` | Interrupt fiber in background                 |
| `Fiber.zip`       | Combine two fibers into tuple                     |
| `Fiber.orElse`    | Fallback if first fiber fails                     |

## Racing

| Combinator  | Behavior                                                        |
| ----------- | --------------------------------------------------------------- |
| `race`      | First success wins, loser interrupted; fails if both fail       |
| `raceAll`   | First success among many wins; fails with last error            |
| `raceFirst` | First to complete wins (success or failure)                     |
| `raceWith`  | Custom handlers for winner/loser via `onSelfDone`/`onOtherDone` |

```ts
import { Effect } from "effect"

// First successful response wins
const fastest = Effect.race(fetchFromA, fetchFromB)

// Race multiple
const winner = Effect.raceAll([task1, task2, task3])

// First to complete (even if failure)
const first = Effect.raceFirst(task1, task2)
```

Use `Effect.disconnect` for non-blocking interruption:

```ts
Effect.raceFirst(Effect.disconnect(task1), Effect.disconnect(task2))
```

## Interruption

| Combinator          | Description                                      |
| ------------------- | ------------------------------------------------ |
| `Effect.interrupt`  | Interrupt current fiber                          |
| `Effect.onInterrupt`| Register cleanup on interruption                 |
| `Effect.disconnect` | Detach interruption signal (non-blocking)        |
| `Effect.uninterruptible` | Make region uninterruptible                 |
| `Effect.interruptible`   | Make region interruptible                   |

```ts
import { Effect, Console } from "effect"

const task = Console.log("working").pipe(
  Effect.onInterrupt(() => Console.log("cleanup"))
)
```

## Scheduling

Schedules define recurring patterns for repetition/retry.

```text
Schedule<Out, In, Requirements>
```

### Built-in Schedules

| Schedule               | Behavior                                         |
| ---------------------- | ------------------------------------------------ |
| `forever`              | Repeat indefinitely, no delay                    |
| `once`                 | Single recurrence                                |
| `recurs(n)`            | Repeat n times                                   |
| `spaced(duration)`     | Fixed delay between end and start                |
| `fixed(duration)`      | Fixed interval from start to start               |
| `exponential(base)`    | Exponential backoff: base, 2×base, 4×base...     |
| `fibonacci(base)`      | Fibonacci delays: base, base, 2×base, 3×base...  |

### Repetition

| Combinator       | Description                                       |
| ---------------- | ------------------------------------------------- |
| `repeat`         | Repeat on success according to schedule           |
| `repeatN`        | Repeat n additional times                         |
| `repeatOrElse`   | Repeat with failure handler                       |
| `schedule`       | Like repeat but skips initial execution           |

```ts
import { Effect, Schedule } from "effect"

// Repeat 3 times with 1s delay
Effect.repeat(task, Schedule.addDelay(Schedule.recurs(3), () => "1 second"))

// Repeat until condition
Effect.repeat(task, { until: (result) => result > 10 })

// Repeat while condition
Effect.repeat(task, { while: (result) => result < 10 })
```

### Schedule Combinators

| Combinator     | Description                                        |
| -------------- | -------------------------------------------------- |
| `union`        | Recur if either wants, use shorter delay           |
| `intersect`    | Recur if both want, use longer delay               |
| `andThen`      | Run first fully, then switch to second             |
| `jittered`     | Add randomness to delays (0.0-1.0 range)           |
| `whileInput`   | Continue while input satisfies predicate           |
| `whileOutput`  | Continue while output satisfies predicate          |
| `modifyDelay`  | Dynamically adjust delays                          |
| `addDelay`     | Add constant delay to schedule                     |

```ts
import { Schedule } from "effect"

// Exponential backoff capped at 5 retries
Schedule.intersect(Schedule.exponential("100 millis"), Schedule.recurs(5))

// Exponential with jitter (recommended for retries)
Schedule.jittered(Schedule.exponential("100 millis"))

// Fast retries then slow polling
Schedule.andThen(Schedule.recurs(3), Schedule.spaced("10 seconds"))
```
