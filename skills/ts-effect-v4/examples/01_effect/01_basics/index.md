## Writing `Effect` code

Prefer writing Effect code with `Effect.gen` & `Effect.fn("name")`. Then attach
additional behaviour with combinators. This style is more readable and easier to
maintain than using combinators alone.

Keep deterministic transformations pure. A renderer, encoder, comparison, or
data reshaping function should return data when it has no effectful failure or
dependency. Write, send, or log that data at the boundary.

Use `Effect.fn` for effectful behavior. Do not add a one-use `Effect.fn`,
service, result type, or test unless it owns behavior, an invariant, a
dependency boundary, or more than one real consumer.
