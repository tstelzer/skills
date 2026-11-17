# Deriving Schemas

## What it is

Derive related contracts from one source schema. Do not copy fields that must
evolve together.

## Minimal example

```ts
import { Schema } from "effect"

const User = Schema.Struct({
  id: Schema.String,
  name: Schema.NonEmptyString,
  email: Schema.String,
  active: Schema.Boolean
})

const PublicUser = User.pipe(Schema.pick("id", "name"))
const UserWithoutEmail = User.pipe(Schema.omit("email"))
const UserPatch = User.pipe(Schema.partialWith({ exact: true }))

const UserWithRevision = User.pipe(
  Schema.extend(Schema.Struct({ revision: Schema.Int }))
)

const WireUser = User.pipe(
  Schema.rename({ id: "userId", name: "displayName" })
)
```

`partial` allows explicit `undefined`. Use `partialWith({ exact: true })` when
an absent key and a present `undefined` value must remain distinct.

## Common pitfalls

- Repeating field schemas in DTOs, patches, and public views
- Using `partial` when exact optional keys are required
- Renaming values in application code instead of describing the boundary map
- Extending schemas with incompatible transformed fields

## See also

- `schema.md`
- `schema-primitives.md`
- `schema-optional-defaults.md`
