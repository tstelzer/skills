## Writing `Effect` code

Prefer `Effect.gen` for inline Effect code. For reusable functions, use
`Effect.fn("name")` when tracing is useful and `Effect.fnUntraced` when it is
not, particularly in library implementations and hot paths. Avoid functions
that only wrap and return `Effect.gen`. Attach additional behavior with
combinators.

Keep deterministic transformations pure. A renderer, encoder, comparison, or
data reshaping function should return data when it has no effectful failure or
dependency. Write, send, or log that data at the boundary.

Use `Effect.fn` or `Effect.fnUntraced` for reusable effectful behavior. Do not
add a one-use function, service, result type, or test unless it owns behavior,
an invariant, a dependency boundary, or more than one real consumer.
