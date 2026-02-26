# Cause and Exit

## What it is
`Cause<E>`: structured failure (failures, defects, interruptions). `Exit<A, E>`: `Success(a)` or `Failure(cause)`.

## When to use
- Inspecting or transforming failures
- Handling fiber results (`Fiber.join` yields `Exit`)

## When not to use
- Simple error handling (use `Effect.catchTag`, `Effect.catchAll`)

## Minimal examples
```ts
import { Effect, Exit } from "effect"

const program = Effect.gen(function* () {
  const exit = yield* Effect.exit(Effect.succeed(42))
  const value = yield* Exit.match(exit, {
    onSuccess: (a) => Effect.succeed(a),
    onFailure: (cause) => Effect.failCause(cause)
  })
  return value
})
```

## Common pitfalls
- Ignoring `Cause.defects` when handling failures

## See also
- `../sections/10-core-patterns.md`
- `../sections/00-foundations.md`
