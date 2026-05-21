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

## See also
- `../sections/10-core-patterns.md`
- `stream.md`
