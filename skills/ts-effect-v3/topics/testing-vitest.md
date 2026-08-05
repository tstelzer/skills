# Testing with @effect/vitest

## What it is
Effect-aware vitest integration via `@effect/vitest`.

## When to use
- Test Effect programs with `TestContext`, `TestClock`, scoped resources, and live runtime toggles

## When not to use
- Pure non-Effect tests without runtime dependencies

## Minimal examples
```ts
import { assert, it } from "@effect/vitest"
import { Effect } from "effect"

it.effect("test success", () =>
  Effect.gen(function* () {
    const result = yield* Effect.succeed(42)
    assert.strictEqual(result, 42)
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
| `it.flakyTest(effect, timeout?)` | Wrap an Effect with retry-until-timeout behavior |

## Useful helpers

`@effect/vitest/utils` provides `assertRight`, `assertLeft`, `assertSome`,
`assertNone`, and `assertInclude`.

Use `it.effect.each` for repeated cases:

```ts
it.effect.each([
  { input: "a", expected: 1 },
  { input: "abcd", expected: 4 }
])("length of $input", ({ expected, input }) =>
  Effect.sync(() => assert.strictEqual(input.length, expected))
)
```

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
- Treating `it.flakyTest` like `it.effect`; it is an Effect wrapper used inside the test body
- Repeating cases as separate tests instead of using `it.effect.each`
- Asserting messages or mock calls when tags and complete data values are available

## See also
- `../sections/50-testing.md`
- `scope-resource.md`
