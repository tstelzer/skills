# Request / RequestResolver

## What it is
`Request`, `RequestResolver`, and `Effect.request` provide batched and cached data fetching. They are the right abstraction for N+1-heavy lookups, deduping identical requests, and plugging custom caches or persistence into fetch paths.

## When to use
- Data loading where batching materially reduces IO
- Deduping repeated requests in a single program run
- Shared fetch layers that should expose request-shaped APIs

## When not to use
- Simple one-off effects with no batching or cache value
- Stateful workflows better modeled as queues, streams, or services

## Minimal examples
```ts
import { Effect, PrimaryKey, RequestResolver, Schema } from "effect"

class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  name: Schema.String
}) {}

class GetUserById extends Schema.TaggedRequest<GetUserById>()("GetUserById", {
  failure: Schema.String,
  success: User,
  payload: { id: Schema.Number }
}) {
  [PrimaryKey.symbol]() {
    return `GetUserById:${this.id}`
  }
}

const program = Effect.gen(function* () {
  const resolver = yield* RequestResolver.fromEffectTagged<GetUserById>()({
    GetUserById: (requests) =>
      Effect.forEach(requests, (request) =>
        Effect.succeed(new User({ id: request.id, name: "John" }))
      )
  })

  return yield* Effect.forEach([1, 2, 2], (id) => Effect.request(new GetUserById({ id }), resolver), {
    batching: true
  })
})
```

## Common pitfalls
- Calling the underlying fetch effect directly instead of `Effect.request(...)`
- Forgetting stable request identity when cache keys matter
- Expecting batching without enabling batched call sites (`{ batching: true }`)

## See also
- `../sections/10-core-patterns.md`
- `schema.md`
- `cache.md`
