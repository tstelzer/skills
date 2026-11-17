## Writing `Effect` code

Prefer `Effect.gen` for inline Effect code. For reusable functions, use
`Effect.fn("name")` when tracing is useful and `Effect.fnUntraced` when it is
not, particularly in library implementations and hot paths. Avoid functions
that only wrap and return `Effect.gen`. Attach additional behavior with
combinators.

- Use `Effect.promise` and `Effect.sync` when the application has no recovery for a rejection or throw.
- Use `Effect.tryPromise` and `Effect.try` only to expose specific errors that callers recognize and can handle.
- Return recognized errors unchanged from `catch`.
- Throw all other errors from `catch` so they become defects.
- Follow the [error rules](../04_errors/index.md) when choosing which failures to expose.

Pass `{ self: this }` before the generator body when `Effect.fnUntraced` or
`Effect.fnUntracedEager` needs to bind `this`.

Convert `Option` and `Result` with `Effect.fromOption` and `Effect.fromResult`
before yielding or passing them to Effect combinators.

Read partition results as `[passes, fails]` and separated Results as
`[successes, failures]`. This applies to `Array`, `Chunk`, `Effect`, `Record`,
and `Option.partitionMap`. `Array.partition`, `Chunk.partition`, and
`Record.partition` take Result-returning filters. Adapt boolean predicates
with `Filter.fromPredicate`.

Keep deterministic transformations pure. A renderer, encoder, comparison, or
data reshaping function should return data when it has no effectful failure or
dependency. Write, send, or log that data at the boundary.

Use `Effect.fn` or `Effect.fnUntraced` for reusable effectful behavior. Do not
add a one-use function, service, result type, or test unless it owns behavior,
an invariant, a dependency boundary, or more than one real consumer.
