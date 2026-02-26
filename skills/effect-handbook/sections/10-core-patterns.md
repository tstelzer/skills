# Core Patterns

## What it is
Reference section for layers/context, scope/resource safety, retries/schedules, refs, cause/exit, stm, streams, and concurrency primitives.

## When to use
- Building production-grade Effect applications with typed dependencies and safe concurrency

## When not to use
- Single-step scripts where advanced composition adds no value

## Minimal examples
```ts
import { Effect, Schedule } from "effect"

const withRetry = Effect.retry(task, Schedule.exponential("100 millis"))
```

## Common pitfalls
- Duplicating retry logic at too many layers
- Choosing `Ref` where STM is required for multi-ref atomicity

## See also
- `../topics/refs.md`
- `../topics/cause-exit.md`
- `../topics/stm.md`
- `../topics/scope-resource.md`
- `../topics/deferred.md`
- `../topics/semaphore.md`
- `../topics/cache.md`
- `../topics/match.md`
- `../topics/observability.md`
- `../topics/concurrency.md`
- `../topics/latch.md`
- `00-foundations.md`
- `30-http-server.md`
- `40-platform.md`
