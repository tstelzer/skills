# Scope and Resource Safety

## What it is
`Scope`: lifetime boundary for resources. `Effect.scoped` + `acquire/release` for safe resource management.

## When to use
- File handles, connections, subscriptions
- Resources that must be released on exit or interruption

## When not to use
- Stateless computations (plain `Effect`)

## Minimal examples
```ts
import { Effect } from "effect"

const program = Effect.scoped(
  Effect.acquireRelease(
    Effect.sync(() => ({ id: 1 })),
    () => Effect.void
  )
)
```

## Common pitfalls
- Forgetting `Effect.scoped` when using scoped resources (e.g. `Stream.broadcast`)
- Writing catch-cleanup-rethrow pipelines instead of using scoped combinators
- Applying `orDie` to expected cleanup failures
- Suppressing cleanup failures without naming the path as best effort

## Cleanup policy

- Use `acquireRelease`, `acquireUseRelease`, `Scope`, and scoped platform
  helpers for resource lifetime.
- Preserve cleanup errors when cleanup is part of the operation's contract.
- Ignore cleanup errors only on a named best-effort path where the original
  result must win.
- Use `onError` for failure-only cleanup instead of catching and re-emitting
  the original failure.
- Catch only the expected condition when probing for `NotFound`,
  `AlreadyExists`, or similar states.

## See also
- `../sections/10-core-patterns.md`
- `stream.md`
