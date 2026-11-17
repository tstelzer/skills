# Schema Primitives and Composition

## What it is

Build boundary shapes from primitives, literals, structs, tuples, arrays,
records, collections, and template literals.

## Minimal example

```ts
import { Schema } from "effect"

const UserId = Schema.TemplateLiteral(
  "user_",
  Schema.String.pipe(Schema.minLength(1))
)

const Role = Schema.Literal("admin", "member")
const Coordinates = Schema.Tuple(Schema.Number, Schema.Number)

const Metadata = Schema.Record({
  key: Schema.String,
  value: Schema.Union(Schema.String, Schema.Number, Schema.Boolean)
})

const User = Schema.Struct({
  id: UserId,
  name: Schema.NonEmptyString,
  role: Role,
  location: Schema.optionalWith(Coordinates, { exact: true }),
  aliases: Schema.Array(Schema.String),
  metadata: Metadata
})

const decodeUserStrict = (input: unknown) =>
  Schema.decodeUnknown(User)(input, { onExcessProperty: "error" })
```

Use transformation schemas such as `NumberFromString`, `BigIntFromString`,
`DateFromString`, and `DurationFromMillis` when encoded and domain primitives
differ.

## Common pitfalls

- Using `Schema.Number` for values that must be finite or integral
- Copying struct fields instead of deriving related schemas
- Ignoring excess-key behavior at security-sensitive boundaries
- Assuming a refined record key validates values at non-matching keys

## See also

- `schema.md`
- `schema-deriving.md`
- `schema-transformations.md`
