# Observability

## What it is
`Logger`, `Metric`, and tracing for structured logging, metrics, and distributed tracing.

## When to use
- Production logging, metrics, trace correlation

## When not to use
- Development-only `console.log` (use `Logger` for consistency)

## Minimal examples
```ts
import { Effect, Metric } from "effect"

const requests = Metric.counter("requests_total")

const program = Effect.gen(function* () {
  yield* Effect.log("request started")
  yield* Metric.increment(requests)
  yield* Effect.log("request handled")
}).pipe(Effect.withSpan("handleRequest"))
```

## Common pitfalls
- Logging outside Effect (breaks trace context)

## See also
- `../sections/10-core-patterns.md`
- `../sections/00-foundations.md`
