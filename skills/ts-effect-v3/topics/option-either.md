# Option / Either

## What it is
`Option<A>` models absence without an error channel. `Either<A, E>` models pure success/failure without running effects. They are the default sum types for local branching and parsing before you need `Effect`.

## When to use
- Missing optional values (`Option`)
- Pure validation / parsing / branching (`Either`)
- CLI / config plumbing before lifting into `Effect`

## When not to use
- Failures that require effects, defects, interruption, or environment (`Effect`)
- Shared domain models at boundaries (`Schema`)

## Minimal examples
```ts
import { Either, Option, pipe } from "effect"

const color = pipe(
  Option.fromNullable(process.env.COLOR),
  Option.match({
    onNone: () => "default",
    onSome: (value) => value
  })
)

const depth = Either.liftPredicate(
  Number(process.env.DEPTH ?? "0"),
  Number.isInteger,
  () => "DEPTH must be an integer"
)

const message = pipe(
  depth,
  Either.match({
    onLeft: (error) => `invalid: ${error}`,
    onRight: (value) => `depth=${value}`
  })
)
```

## Common patterns
- `Option.fromNullable`, `Option.match`, `Option.getOrElse`
- `Either.liftPredicate`, `Either.match`, `Either.mapLeft`
- `Either.gen(...)` when pure error flow needs multiple steps

## Common pitfalls
- Wrapping effectful work in `Either` instead of `Effect`
- Encoding absence as magic values instead of `Option.none()`
- Returning nested `Option<Either<...>>` when a single abstraction is enough

## See also
- `../sections/00-foundations.md`
- `match.md`
- `schema.md`
