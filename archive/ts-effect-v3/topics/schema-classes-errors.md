# Schema Classes, Errors, and Requests

## What it is

Start with `Struct`. Use a brand for nominal values without instances. Use
classes when values need construction, methods, tagged errors, or requests.

## Minimal example

```ts
import { Schema } from "effect"

const AccountId = Schema.NonEmptyString.pipe(Schema.brand("AccountId"))
type AccountId = Schema.Schema.Type<typeof AccountId>

class User extends Schema.Class<User>("app/User")({
  id: AccountId,
  givenName: Schema.NonEmptyString,
  familyName: Schema.NonEmptyString
}) {
  get displayName(): string {
    return `${this.givenName} ${this.familyName}`
  }
}

class Admin extends User.extend<Admin>("app/Admin")({
  permissions: Schema.Array(Schema.String)
}) {}

class Created extends Schema.TaggedClass<Created>()("Created", {
  user: User
}) {}

class UserNotFound extends Schema.TaggedError<UserNotFound>()(
  "UserNotFound",
  { id: AccountId }
) {}

class GetUser extends Schema.TaggedRequest<GetUser>()("GetUser", {
  failure: UserNotFound,
  success: User,
  payload: { id: AccountId }
}) {}
```

Use `Schema.instanceOf` for an existing native or third-party class. Use
`Schema.declare` only when a built-in schema or `instanceof` cannot describe
the value.

## Common pitfalls

- Creating a class when a Struct or brand has all required behavior
- Copying base class fields instead of using `extend`
- Using plain `Error` subclasses for errors that cross encoded boundaries
- Catching a tagged error only to log it and return `void`

## See also

- `schema.md`
- `request-resolver.md`
- `rpc.md`
