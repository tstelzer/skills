# PubSub

## What it is
Message broadcasting to multiple subscribers. Each subscriber gets a `Queue`. Use `Effect.scoped` when subscribing.

## When to use
- Broadcasting to multiple consumers
- Fan-out patterns

## When not to use
- Single consumer (use `Queue`)

## Minimal examples
```ts
import { Effect, PubSub, Queue } from "effect"

const program = Effect.scoped(
  Effect.gen(function* () {
    const pubsub = yield* PubSub.bounded<string>(2)
    const sub = yield* PubSub.subscribe(pubsub)
    yield* PubSub.publish(pubsub, "hello")
    return yield* Queue.take(sub)
  })
)
```

## Common pitfalls
- Forgetting `Effect.scoped` around subscribe/publish

## See also
- `queue.md`
- `../sections/10-core-patterns.md`
