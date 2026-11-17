# Schema Transformations

## What it is

Transformations describe different encoded and domain forms. Composition joins
existing schemas. `transformOrFail` handles conversions that may fail.

## Minimal example

```ts
import { Schema } from "effect"

const Port = Schema.NumberFromString.pipe(
  Schema.compose(
    Schema.Int.pipe(Schema.between(1, 65_535))
  )
)

const BooleanFromString = Schema.transform(
  Schema.Literal("on", "off"),
  Schema.Boolean,
  {
    strict: true,
    decode: (value) => value === "on",
    encode: (value) => value ? "on" : "off"
  }
)

const User = Schema.Struct({
  user_id: Schema.NumberFromString,
  display_name: Schema.NonEmptyString
}).pipe(
  Schema.rename({
    user_id: "userId",
    display_name: "displayName"
  })
)

const UserEncoded = Schema.encodedSchema(User)
const UserType = Schema.typeSchema(User)
```

Use `transformOrFail` when decoding or encoding can produce a `ParseIssue` or
requires an Effect. Keep normalization out of transformations for opaque data
unless the wire contract requires it.

## Common pitfalls

- Forgetting that `Schema.rename` maps encoded keys to domain keys
- Returning the wrong side's type from `decode` or `encode`
- Using `strict: false` without a concrete compatibility reason
- Trimming or case-folding secrets and arbitrary external output

## See also

- `schema.md`
- `schema-context.md`
- `schema-serialization.md`
