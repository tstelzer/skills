# Latch

Gate that blocks fibers until opened.

| Operation    | Description                              |
| ------------ | ---------------------------------------- |
| `whenOpen`   | Run effect only when open (waits)        |
| `open`       | Open the gate                            |
| `close`      | Close the gate                           |
| `await`      | Wait until open                          |
| `release`    | Let waiting fibers through (temporary)   |

```ts
import { Effect, Console } from "effect"

const program = Effect.gen(function* () {
  const latch = yield* Effect.makeLatch() // starts closed
  
  const fiber = yield* Console.log("ready").pipe(
    latch.whenOpen,
    Effect.fork
  )
  
  yield* Effect.sleep("1 second")
  yield* latch.open // releases waiting fiber
})
```
