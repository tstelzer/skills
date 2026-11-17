# Match

## What it is
`Match` module for exhaustive pattern matching on values. Tagged unions, `Option`, `Either`, custom types.

## When to use
- Exhaustive handling of union types
- Replacing `switch`/`if` chains with structured matching

## When not to use
- Simple `Option`/`Either` handling (use `Option.match`, `Either.match`)

## Minimal examples
```ts
import { Match } from "effect"

const result = Match.value(42).pipe(
  Match.when(Match.number, (n) => n + 1),
  Match.when(Match.string, (s) => s.length),
  Match.exhaustive
)
```

## Common pitfalls
- Forgetting `Match.exhaustive` and leaving cases unhandled

## See also
- `../sections/00-foundations.md`
- `cause-exit.md`
