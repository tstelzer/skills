# Testing with @effect/vitest

## What it is
Effect-aware vitest integration via `@effect/vitest`.

## When to use
- Test Effect programs with `TestContext`, `TestClock`, scoped resources, and live runtime toggles

## When not to use
- Pure non-Effect tests without runtime dependencies

## Minimal examples
```ts
import { it, expect } from "@effect/vitest"
import { Effect } from "effect"

it.effect("test success", () =>
  Effect.gen(function* () {
    const result = yield* Effect.succeed(42)
    expect(result).toBe(42)
  })
)
```

## Test modes

| Feature         | Description                                        |
| --------------- | -------------------------------------------------- |
| `it.effect`     | Injects `TestContext` (`TestClock`)                |
| `it.live`       | Uses live runtime (real clock/logging)             |
| `it.scoped`     | Provides scope for resource management             |
| `it.scopedLive` | `scoped` + `live`                                  |
| `it.flakyTest`  | Retries flaky tests until success/timeout          |

## Time and resource patterns

```ts
import { Clock, Effect, TestClock } from "effect"

it.effect("with simulated time", () =>
  Effect.gen(function* () {
    yield* TestClock.adjust("1000 millis")
    const now = yield* Clock.currentTimeMillis
  })
)
```

## Common pitfalls
- Expecting real-time behavior under `it.effect` instead of `it.live`
- Forgetting `it.scoped` for acquire/release resources

## See also
- `../sections/50-testing.md`
- `scope-resource.md`
