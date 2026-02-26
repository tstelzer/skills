# Schedule / Retry

## What it is
`Schedule<Out, In, R>`: recurring patterns for repetition and retry. Built-in: `exponential`, `fibonacci`, `spaced`, `recurs`, `jittered`.

## When to use
- Retry policies with backoff
- Repeat patterns (polling, rate-limited)

## When not to use
- One-off delays (use `Effect.sleep`)

## Minimal examples
```ts
import { Effect, Schedule } from "effect"

const withRetry = Effect.retry(task, Schedule.exponential("100 millis"))
const withJitter = Effect.retry(task, Schedule.jittered(Schedule.exponential("100 millis")))
```

## Common pitfalls
- Duplicating retry logic at multiple layers
- Forgetting `jittered` for network retries

## See also
- `../sections/10-core-patterns.md`
