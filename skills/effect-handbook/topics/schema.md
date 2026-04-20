# Schema

## What it is
`Schema<A, I, R>` is Effect's runtime schema system for validation, decoding, encoding, transformations, metadata, and generated models. `A` is the domain type, `I` is the encoded/input type, and `R` is additional Effect context needed during parsing.

## When to use
- External boundaries: HTTP payloads, RPC messages, config, persistence, queues
- Shared domain models that need both static types and runtime validation
- Tagged domain errors or requests via `Schema.TaggedError` / `Schema.TaggedRequest`

## When not to use
- Internal-only shapes that never cross a runtime boundary and do not need decoding or encoding

## Minimal examples
```ts
import { Either, Schema } from "effect"

class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  name: Schema.String
}) {}

class NotFound extends Schema.TaggedError<NotFound>()("NotFound", {
  id: Schema.Number
}) {}

const decodeUser = Schema.decodeUnknownEither(User)
const encodedUser = Schema.encodeSync(User)(new User({ id: 1, name: "Ada" }))

const user = decodeUser({ id: 1, name: "Ada" }).pipe(
  Either.getOrThrow
)
```

## High-value builders
- `Schema.Struct`, `Schema.Array`, `Schema.Union`, `Schema.Literal`
- `Schema.Class` for nominal models with generated constructors
- `Schema.TaggedError` / `Schema.TaggedRequest` for domain errors and request models
- `Schema.transform` / `Schema.transformOrFail` when encoded and domain forms differ
- `Schema.annotations(...)` to improve parse errors, docs, and generated OpenAPI / JSON Schema

## Common pitfalls
- Forgetting that encoded type `I` can differ from runtime type `A`
- Using plain TypeScript interfaces at boundaries and losing runtime validation
- Skipping identifiers / annotations, which makes errors and generated docs worse

## See also
- `../sections/00-foundations.md`
- `../sections/30-http-server.md`
- `request-resolver.md`
- `http-swagger.md`
