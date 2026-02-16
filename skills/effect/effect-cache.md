# Cache

Concurrent-safe, LRU cache with TTL. Deduplicates concurrent lookups for the same key automatically.

## Constructors

| Constructor    | TTL                                  |
| -------------- | ------------------------------------ |
| `Cache.make`   | Fixed `timeToLive` for all entries   |
| `Cache.makeWith` | Dynamic TTL based on `Exit` value  |

```ts
import { Cache, Effect } from "effect"

const program = Effect.gen(function* () {
  const cache = yield* Cache.make({
    capacity: 100,
    timeToLive: "5 minutes",
    lookup: (key: string) => fetchUser(key)
  })

  const user = yield* cache.get("user-1")    // computes & caches
  const same = yield* cache.get("user-1")    // returns cached
})
```

Dynamic TTL based on result:

```ts
const cache = yield* Cache.makeWith({
  capacity: 100,
  lookup: (key: string) => fetchUser(key),
  timeToLive: (exit) =>
    exit._tag === "Success" ? "10 minutes" : "1 seconds"
})
```

## Cache Operations

| Method              | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `cache.get`         | Get or compute value for key                                 |
| `cache.getEither`   | Like `get`, returns `Left` if cached, `Right` if fresh       |
| `cache.set`         | Manually associate a value with a key                        |
| `cache.refresh`     | Recompute in background, stale value served while refreshing |
| `cache.contains`    | Check if key exists                                          |
| `cache.invalidate`  | Remove a specific key                                        |
| `cache.invalidateWhen` | Remove key if value matches predicate                     |
| `cache.invalidateAll` | Clear entire cache                                         |

## ConsumerCache (read-only view)

| Method                       | Description                              |
| ---------------------------- | ---------------------------------------- |
| `cache.getOption`            | Get if exists, else `Option.none`        |
| `cache.getOptionComplete`    | Get only if lookup finished              |
| `cache.size`                 | Approximate number of entries            |
| `cache.keys`                 | Approximate keys                         |
| `cache.values`               | Approximate values                       |
| `cache.entries`              | Approximate key-value pairs              |
| `cache.cacheStats`           | `{ hits, misses, size }`                 |
| `cache.entryStats`           | `Option<{ loadedMillis }>`               |

Use `ConsumerCache<Key, Value, Error>` to type a read-only reference that cannot create new entries.

## Background Refresh

```ts
const program = Effect.gen(function* () {
  const cache = yield* Cache.make({
    capacity: 100,
    timeToLive: "30 seconds",
    lookup: (key: string) => fetchPrice(key)
  })

  yield* cache.get("AAPL")       // initial lookup
  yield* cache.refresh("AAPL")   // recompute in background, stale value still served
})
```

## Cache Stats

```ts
const program = Effect.gen(function* () {
  const cache = yield* Cache.make({
    capacity: 100,
    timeToLive: "1 seconds",
    lookup: (n: number) => Effect.succeed(n)
  })

  yield* cache.get(42)
  yield* cache.get(42)       // cache hit

  const { hits, misses, size } = yield* cache.cacheStats
  // hits: 1, misses: 1, size: 1
})
```
