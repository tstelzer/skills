# PubSub

Message broadcasting to multiple subscribers (vs Queue's single consumer).

| Constructor        | Behavior when full                       |
| ------------------ | ---------------------------------------- |
| `PubSub.bounded`   | Suspends publisher                       |
| `PubSub.unbounded` | No limit                                 |
| `PubSub.dropping`  | Drops new messages                       |
| `PubSub.sliding`   | Drops oldest messages                    |

```ts
import { Effect, PubSub, Queue } from "effect"

const program = Effect.scoped(
  Effect.gen(function* () {
    const pubsub = yield* PubSub.bounded<string>(2)
    const sub1 = yield* PubSub.subscribe(pubsub)
    const sub2 = yield* PubSub.subscribe(pubsub)
    
    yield* PubSub.publish(pubsub, "hello")
    
    console.log(yield* Queue.take(sub1)) // "hello"
    console.log(yield* Queue.take(sub2)) // "hello"
  })
)
```
