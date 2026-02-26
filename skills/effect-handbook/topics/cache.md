# Cache

## What it is
Concurrent-safe caching with TTL. `Cache.make` for key-value lookup with automatic invalidation.

## When to use
- Expensive computations or lookups with temporal locality

## When not to use
- One-off computations (plain `Effect`)

## Minimal examples
```ts
import { Effect, Cache, Duration } from "effect"

const program = Effect.gen(function* () {
  const cache = yield* Cache.make({
    capacity: 100,
    timeToLive: Duration.minutes(60),
    lookup: (k: string) => Effect.succeed(k)
  })
  return yield* cache.get("key")
})
```

## Common pitfalls
- Cache keys that are not stable or comparable

## See also
- `../sections/10-core-patterns.md`
- `refs.md`
