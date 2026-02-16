# Deferred

One-time variable for signaling between fibers. Similar to `Promise`.

```ts
Deferred<Success, Error>
```

| Operation          | Description                              |
| ------------------ | ---------------------------------------- |
| `Deferred.make`    | Create empty deferred                    |
| `Deferred.await`   | Wait for completion                      |
| `Deferred.succeed` | Complete with success                    |
| `Deferred.fail`    | Complete with error                      |
| `Deferred.complete`| Complete with effect result              |
| `Deferred.poll`    | Check without waiting (`Option<Effect>`) |
| `Deferred.isDone`  | Check if completed                       |

```ts
import { Effect, Deferred, Fiber } from "effect"

const program = Effect.gen(function* () {
  const deferred = yield* Deferred.make<string, never>()
  
  const consumer = yield* Effect.fork(Deferred.await(deferred))
  yield* Effect.sleep("1 second")
  yield* Deferred.succeed(deferred, "hello")
  
  return yield* Fiber.join(consumer)
})
```
