# Schema Validation and Constructors

## What it is

Use filters for pure checks, brands for nominal values, and `filterEffect` when
validation needs an Effect service.

## Minimal example

```ts
import { Context, Effect, Schema } from "effect"

const Username = Schema.String.pipe(
  Schema.minLength(3),
  Schema.maxLength(32),
  Schema.pattern(/^[a-z0-9_]+$/)
)

const PasswordChange = Schema.Struct({
  password: Schema.String,
  confirmation: Schema.String
}).pipe(
  Schema.filter(({ confirmation, password }) =>
    password === confirmation || {
      path: ["confirmation"],
      message: "password and confirmation must match"
    }
  )
)

const UserId = Schema.NonEmptyString.pipe(Schema.brand("UserId"))
type UserId = Schema.Schema.Type<typeof UserId>

class UserDirectory extends Context.Tag("app/UserDirectory")<
  UserDirectory,
  { readonly exists: (id: string) => Effect.Effect<boolean> }
>() {}

const ExistingUserId = Schema.String.pipe(
  Schema.filterEffect((id) =>
    Effect.gen(function* () {
      const directory = yield* UserDirectory
      return (yield* directory.exists(id)) || "unknown user"
    })
  )
)
```

`UserId.make(value)` validates and throws on failure. Use it for trusted domain
assembly where throwing is intended. Use `decodeUnknown*` at untrusted
boundaries.

## Common pitfalls

- Using effectful validation for a pure predicate
- Hiding a service used by `filterEffect` with an internal `Effect.provide`
- Using throwing constructors on untrusted input
- Adding a brand without the runtime constraint that gives it meaning

## See also

- `schema.md`
- `schema-context.md`
- `layer-context.md`
