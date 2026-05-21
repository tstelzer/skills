# Latch

## What it is
Gate that blocks fibers until opened.

## When to use
- One-way or controlled release coordination across fibers

## When not to use
- Multi-message queueing (use `Queue`/`PubSub`)

## Minimal examples
```ts
import { Effect, Console } from "effect"

const program = Effect.gen(function* () {
  const latch = yield* Effect.makeLatch() // starts closed

  const fiber = yield* Console.log("ready").pipe(
    latch.whenOpen,
    Effect.fork
  )

  yield* Effect.sleep("1 second")
  yield* latch.open
})
```

## Common pitfalls
- Waiting on latch without an opening path

## See also
- `../sections/10-core-patterns.md`
- `deferred.md`
