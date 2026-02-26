# Foundations

## What it is
Core Effect model: `Effect<A, E, R>`, construction/composition, typed errors, and execution boundaries.

## The Effect type

```ts
Effect<Success, Error, Requirements>
```

- Lazy: describes workflow, does not execute until run
- Immutable: every operation returns a new Effect
- Aliases: `A` (success), `E` (error), `R` (requirements)

## Creating effects

| Combinator      | Input                              | Output                        |
| --------------- | ---------------------------------- | ----------------------------- |
| `succeed`       | `A`                                | `Effect<A>`                   |
| `fail`          | `E`                                | `Effect<never, E>`            |
| `sync`          | `() => A`                          | `Effect<A>`                   |
| `try`           | `() => A`                          | `Effect<A, UnknownException>` |
| `try`           | `{ try, catch }`                   | `Effect<A, E>`                |
| `promise`       | `() => Promise<A>`                 | `Effect<A>`                   |
| `tryPromise`    | `() => Promise<A>`                 | `Effect<A, UnknownException>` |
| `tryPromise`    | `{ try, catch }`                   | `Effect<A, E>`                |
| `async`         | `(resume) => void`                 | `Effect<A, E>`                |
| `suspend`       | `() => Effect<A, E, R>`            | `Effect<A, E, R>`             |

```ts
import { Effect } from "effect"

const ok = Effect.succeed(42)
const err = Effect.fail(new Error("oops"))
const sync = Effect.sync(() => console.log("hi"))
const trySync = Effect.try(() => JSON.parse(str))
const tryAsync = Effect.tryPromise(() => fetch(url))
```

Use `suspend` for lazy side effects, recursion, and return-type unification.

## Running effects

| Runner           | Output                |
| ---------------- | --------------------- |
| `runSync`        | `A` (throws on async) |
| `runPromise`     | `Promise<A>`          |
| `runFork`        | `RuntimeFiber<A, E>`  |

```ts
Effect.runSync(program)
Effect.runPromise(program)
Effect.runFork(program)
```

## Run boundaries

Run effects at program edges only:
- entrypoints (`main`)
- route/controller handlers
- event handlers

Anti-pattern:
```ts
// BAD
async function getUser(id: string) {
  return Effect.runPromise(fetchUser(id))
}
```

Preferred:
```ts
const getUser = (id: string): Effect.Effect<User, Error> => fetchUser(id)
```

## Pipelines

| Operator  | Purpose                                      |
| --------- | -------------------------------------------- |
| `map`     | Transform success value: `A => B`            |
| `flatMap` | Chain effects: `A => Effect<B, E, R>`        |
| `andThen` | Flexible chain (value, function, Effect)     |
| `tap`     | Side effect, keeps original value            |
| `all`     | Combine effects into tuple/struct            |

```ts
import { Effect, pipe } from "effect"

const program = pipe(
  fetchAmount,
  Effect.map((n) => n * 2),
  Effect.flatMap((n) => applyDiscount(n)),
  Effect.tap((n) => Effect.log(`Result: ${n}`))
)

const both = Effect.all([effectA, effectB])
const struct = Effect.all({ a: effectA, b: effectB })
```

## Generators

```ts
const program = Effect.gen(function* () {
  const a = yield* effectA
  const b = yield* effectB
  return a + b
})
```

Use `gen` for control flow; use `pipe` for linear transforms.

## Tagged errors

```ts
import { Data, Effect } from "effect"

class NotFound extends Data.TaggedError("NotFound")<{ id: string }>() {}
class Unauthorized extends Data.TaggedError("Unauthorized")<{}>() {}

const program: Effect.Effect<User, NotFound | Unauthorized> = Effect.gen(function* () {
  yield* Effect.fail(new NotFound({ id }))
})
```

## Common pitfalls
- Running effects in middle layers instead of boundaries
- Mixing `pipe` and `gen` without a reason
- Leaving tagged errors unhandled

## See also
- `10-core-patterns.md`
- `../topics/stream.md`
- `../topics/match.md`
- `../topics/concurrency.md`
- `../topics/deferred.md`
- `../topics/queue.md`
- `../topics/pubsub.md`
- `../topics/semaphore.md`
- `../topics/latch.md`
- `../topics/cache.md`
- `../topics/layer-context.md`
- `../topics/scope-resource.md`
- `../topics/schedule-retry.md`
- `../topics/refs.md`
- `../topics/cause-exit.md`
- `../topics/stm.md`
- `../topics/config.md`
- `../topics/observability.md`
