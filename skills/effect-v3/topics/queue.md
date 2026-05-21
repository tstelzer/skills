# Queue

## What it is
In-memory queue with back-pressure. `Queue.bounded` (suspend), `Queue.unbounded`, `Queue.dropping`, `Queue.sliding`.

## When to use
- Producer-consumer with back-pressure
- Single consumer per queue

## When not to use
- Broadcasting to multiple subscribers (use `PubSub`)

## Minimal examples
```ts
import { Effect, Queue } from "effect"

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(100)
  yield* Queue.offer(queue, 1)
  const value = yield* Queue.take(queue)
})
```

## Common pitfalls
- Using `Queue.unbounded` when back-pressure is needed

## See also
- `pubsub.md`
- `../sections/10-core-patterns.md`
