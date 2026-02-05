# Effect Streams

## The Stream Type

```ts
Stream<A, E, R>
```

- Like `Effect`, but emits **zero or more** values of type `A`
- Lazy, immutable, pull-based
- Use cases: async iterables, node streams, observables, paginated APIs

## Creating Streams

| Constructor            | Input                              | Output                     |
| ---------------------- | ---------------------------------- | -------------------------- |
| `make`                 | `...values`                        | `Stream<A>`                |
| `empty`                | -                                  | `Stream<never>`            |
| `range`                | `min, max`                         | `Stream<number>`           |
| `iterate`              | `init, f`                          | `Stream<A>` (infinite)     |
| `succeed` / `fail`     | `A` / `E`                          | `Stream<A>` / `Stream<never, E>` |
| `fromChunk`            | `Chunk<A>`                         | `Stream<A>`                |
| `fromEffect`           | `Effect<A, E, R>`                  | `Stream<A, E, R>`          |
| `fromIterable`         | `Iterable<A>`                      | `Stream<A>`                |
| `fromAsyncIterable`    | `AsyncIterable<A>, errorHandler`   | `Stream<A, E>`             |
| `repeatEffect`         | `Effect<A, E, R>`                  | `Stream<A, E, R>` (infinite) |
| `unfold`               | `init, (s) => Option<[A, S]>`      | `Stream<A>`                |
| `paginate`             | `init, (s) => [A, Option<S>]`      | `Stream<A>`                |
| `fromSchedule`         | `Schedule<A>`                      | `Stream<A>`                |

```ts
import { Stream, Effect } from "effect"

const s1 = Stream.make(1, 2, 3)
const s2 = Stream.range(1, 10) // includes both endpoints
const s3 = Stream.iterate(1, (n) => n + 1) // infinite
const s4 = Stream.fromEffect(Effect.succeed(42))

// Pagination (emits value before checking continuation)
const pages = Stream.paginateChunkEffect(0, (page) =>
  fetchPage(page).pipe(
    Effect.map((p) => [p.results, p.isLast ? Option.none() : Option.some(page + 1)])
  )
)
```

## Consuming Streams

| Runner          | Description                        |
| --------------- | ---------------------------------- |
| `runCollect`    | Collect all elements into `Chunk`  |
| `runForEach`    | Execute effect for each element    |
| `runFold`       | Fold into single value             |
| `run`           | Run with a `Sink`                  |

```ts
const chunks = yield* Stream.runCollect(stream)
const sum = yield* Stream.runFold(stream, 0, (acc, n) => acc + n)
yield* Stream.runForEach(stream, Console.log)
```

## Transformations

| Operator        | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `map`           | Transform each element                               |
| `mapEffect`     | Transform with effect (supports `concurrency`)       |
| `mapAccum`      | Stateful transformation                              |
| `mapConcat`     | Map to iterable and flatten                          |
| `flatMap`       | Map to stream and flatten (supports `switch`)        |
| `filter`        | Keep elements matching predicate                     |
| `take` / `drop` | Take/drop first N elements                           |
| `takeWhile`     | Take while predicate holds                           |
| `takeUntil`     | Take until predicate returns true (inclusive)        |
| `scan`          | Like fold but emits intermediate results             |
| `tap`           | Side effect, keeps original value                    |
| `changes`       | Emit only when value differs from previous           |

```ts
const doubled = stream.pipe(Stream.map((n) => n * 2))
const withIndex = Stream.zipWithIndex(stream)
const filtered = stream.pipe(Stream.filter((n) => n > 0))

// Concurrent mapping
Stream.mapEffect(fetchUrl, { concurrency: 4 })

// flatMap with switch (cancels previous on new element)
Stream.flatMap(createStream, { switch: true })
```

## Combining Streams

| Operator        | Behavior                                              |
| --------------- | ----------------------------------------------------- |
| `concat`        | Append second stream after first completes            |
| `merge`         | Interleave elements (concurrent)                      |
| `zip`           | Pair elements 1:1 (ends when either ends)             |
| `zipAll`        | Pair with defaults when one stream ends               |
| `zipLatest`     | Pair using latest from slower stream                  |
| `cross`         | Cartesian product                                     |
| `interleave`    | Alternate elements one by one                         |

```ts
const merged = Stream.merge(s1, s2, { haltStrategy: "either" })
const zipped = Stream.zip(s1, s2)
const product = Stream.cross(s1, s2)
```

Halt strategies for `merge`: `"left"`, `"right"`, `"both"` (default), `"either"`

## Grouping & Partitioning

```ts
// Group by key
const grouped = Stream.groupByKey(stream, (exam) => Effect.succeed([Math.floor(exam.score / 10), exam.score]))
GroupBy.evaluate(grouped, (key, stream) => /* process each group */)

// Partition by predicate (returns [falsy, truthy])
const [odds, evens] = yield* Stream.partition(stream, (n) => n % 2 === 0)

// Chunk into groups of N
Stream.grouped(stream, 3) // Stream<Chunk<A>>
```

## Error Handling

| Operator            | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `orElse`            | Switch to fallback stream on error           |
| `catchAll`          | Handle error and provide recovery stream     |
| `catchAllCause`     | Handle any failure (including defects)       |
| `catchSome`         | Handle specific errors                       |
| `retry`             | Retry with schedule                          |
| `timeout`           | Terminate after duration                     |
| `timeoutFail`       | Fail with error after duration               |
| `timeoutTo`         | Switch to another stream after duration      |

```ts
const recovered = stream.pipe(
  Stream.catchAll((error) => {
    if (error._tag === "NotFound") return Stream.empty
    return Stream.fail(error)
  })
)

const withRetry = stream.pipe(
  Stream.retry(Schedule.exponential("1 second"))
)
```

## Resourceful Streams

```ts
// Acquire/release pattern
const fileStream = Stream.acquireRelease(
  openFile("data.txt"),
  (file) => file.close
).pipe(Stream.flatMap((file) => file.readLines))

// Finalization
const withCleanup = stream.pipe(
  Stream.concat(Stream.finalizer(cleanup)),
  Stream.ensuring(postFinalizationTask)
)
```

## Rate Control

```ts
// Debounce: emit only after pause
Stream.debounce(stream, "100 millis")

// Throttle: limit rate
Stream.throttle({
  cost: Chunk.size,
  duration: "100 millis",
  units: 1,
  strategy: "shape" // or "enforce"
})

// Schedule emissions
Stream.schedule(stream, Schedule.spaced("1 second"))

// Buffer for producer/consumer speed mismatch
Stream.buffer({ capacity: 100 })
```

## Broadcasting

```ts
// Send same elements to multiple consumers
Effect.scoped(
  stream.pipe(
    Stream.broadcast(2, 5), // 2 consumers, maxLag 5
    Stream.flatMap(([s1, s2]) =>
      Effect.all([
        Stream.runFold(s1, 0, Math.max),
        Stream.runForEach(s2, Console.log)
      ], { concurrency: 2 })
    )
  )
)
```
