# Stream

## What it is
`Stream<A, E, R>`: lazy, immutable, pull-based emitter of zero or more values. Like `Effect` but for async iterables, node streams, paginated APIs.

## When to use
- Async iterables, pagination, file processing, observables

## When not to use
- Single-value computations (use `Effect`)

## Minimal examples
```ts
import { Effect, Stream } from "effect"

const program = Effect.gen(function* () {
  const s = Stream.make(1, 2, 3)
  const doubled = yield* Stream.runCollect(
    s.pipe(Stream.map((n) => n * 2))
  )
  return doubled
})
```

## Common pitfalls
- Forgetting `Effect.scoped` when using `Stream.broadcast`

## See also
- `../sections/10-core-patterns.md`
