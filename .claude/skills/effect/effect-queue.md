# Queue

In-memory queue with back-pressure support.

| Constructor        | Behavior when full                       |
| ------------------ | ---------------------------------------- |
| `Queue.bounded`    | Suspends producer (back-pressure)        |
| `Queue.unbounded`  | No limit                                 |
| `Queue.dropping`   | Drops new values                         |
| `Queue.sliding`    | Drops oldest values                      |

| Operation          | Description                              |
| ------------------ | ---------------------------------------- |
| `Queue.offer`      | Add single item                          |
| `Queue.offerAll`   | Add multiple items                       |
| `Queue.take`       | Remove and return oldest (waits)         |
| `Queue.takeAll`    | Take all available                       |
| `Queue.takeUpTo`   | Take up to N available                   |
| `Queue.takeN`      | Take exactly N (waits)                   |
| `Queue.poll`       | Take without waiting (`Option`)          |
| `Queue.shutdown`   | Interrupt all waiting fibers             |

```ts
import { Effect, Queue } from "effect"

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(100)
  yield* Queue.offer(queue, 1)
  const value = yield* Queue.take(queue)
})
```

Type restrictions: `Queue.Enqueue<A>` (offer only), `Queue.Dequeue<A>` (take only).
