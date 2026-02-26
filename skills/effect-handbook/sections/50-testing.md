# Testing

## What it is
Effect test patterns using `@effect/vitest`.

## When to use
- Tests requiring TestClock, scoped resources, or live-vs-test runtime control

## When not to use
- Pure synchronous unit tests that do not involve Effect

## Minimal examples
```ts
import { it, expect } from "@effect/vitest"
import { Effect } from "effect"

it.effect("works", () => Effect.succeed(expect(1).toBe(1)))
```

## Test modes

| Feature         | Description                                          |
| --------------- | ---------------------------------------------------- |
| `it.effect`     | Injects `TestContext` (includes `TestClock`)         |
| `it.live`       | Uses live Effect environment (real clock, logging)   |
| `it.scoped`     | Provides a `Scope` for resource management           |
| `it.scopedLive` | Combines `scoped` + `live`                           |
| `it.flakyTest`  | Retries flaky tests until success or timeout         |

## Common pitfalls
- Expecting live clock behavior under `it.effect` without `it.live`

## See also
- `10-core-patterns.md`
- `../topics/testing-vitest.md`
