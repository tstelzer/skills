# Schema Optional Fields and Defaults

## What it is

Model missing keys, explicit `undefined`, `null`, `Option`, decoding defaults,
and constructor defaults as separate contracts.

## Minimal example

```ts
import { Schema } from "effect"

const Patch = Schema.Struct({
  displayName: Schema.optionalWith(Schema.NonEmptyString, { exact: true }),
  biography: Schema.optional(Schema.String),
  avatarUrl: Schema.optionalWith(Schema.NullOr(Schema.String), {
    exact: true
  }),
  referralCode: Schema.optionalWith(Schema.String, {
    as: "Option",
    nullable: true
  })
})

const Settings = Schema.Struct({
  retries: Schema.optionalWith(Schema.NumberFromString, {
    default: () => 3
  })
})

class Job extends Schema.Class<Job>("app/Job")({
  id: Schema.String,
  createdAt: Schema.propertySignature(Schema.DateFromSelf).pipe(
    Schema.withConstructorDefault(() => new Date(0))
  )
}) {}
```

The fixed epoch above demonstrates constructor behavior without reading the
current clock. For a current-time default, pass time in explicitly or build the
value in an Effect using `Clock` or `DateTime`.

## Common pitfalls

- Treating missing, `undefined`, and `null` as interchangeable
- Adding a default that hides malformed or missing input callers must see
- Reading current time or environment state in a default callback
- Assuming constructor defaults also apply to boundary decoding

## See also

- `schema.md`
- `schema-deriving.md`
- `option-either.md`
