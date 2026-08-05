# Schema Context

## What it is

A schema can require services while decoding or encoding. The requirement stays
in `Schema<A, I, R>` and in the parser Effect until a boundary provides it.

## Minimal example

```ts
import { Context, Effect, ParseResult, Schema } from "effect"

interface UserRecord {
  readonly id: string
  readonly name: string
}

const UserRecord = Schema.Struct({
  id: Schema.String,
  name: Schema.NonEmptyString
})

class UserDirectory extends Context.Tag("app/UserDirectory")<
  UserDirectory,
  { readonly getById: (id: string) => Effect.Effect<UserRecord> }
>() {}

const UserById = Schema.transformOrFail(
  Schema.String,
  UserRecord,
  {
    strict: true,
    decode: (id) =>
      Effect.gen(function* () {
        const directory = yield* UserDirectory
        return yield* directory.getById(id)
      }),
    encode: (user) => ParseResult.succeed(user.id)
  }
)

const decodeUserById = Schema.decodeUnknown(UserById)
```

Effect v3 has one context parameter for the whole schema. A requirement used in
one direction remains visible on both parser types. Provide it at the adapter or
application boundary.

Use `decodingFallback` only when the boundary contract defines a valid fallback
value. Do not use it to erase malformed input that callers must reject.

## Common pitfalls

- Providing a requirement inside the transformation and hiding the dependency
- Reading ambient process state inside parsing code
- Falling back from malformed input when missing and malformed mean different
  things
- Assuming decode and encode requirements are represented separately in v3

## See also

- `schema.md`
- `schema-transformations.md`
- `layer-context.md`
