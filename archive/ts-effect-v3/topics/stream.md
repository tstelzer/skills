# Stream

## What it is
`Stream<A, E, R>` is a lazy, pull-based emitter of zero or more values. Use it
for async iterables, Node streams, and paginated APIs.

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
