/**
 * @title Opaque types, classes, tagged models, and errors
 *
 * Start with Struct. Use Opaque for nominal typing without runtime instances.
 * Use Class when values need a prototype, methods, or class construction.
 */
import { Effect, Schema } from "effect"

export class AccountId extends Schema.Opaque<AccountId>()(
  Schema.String.check(Schema.isMinLength(1))
) {}

export class User extends Schema.Class<User>("app/User")({
  id: AccountId,
  givenName: Schema.NonEmptyString,
  familyName: Schema.NonEmptyString
}) {
  get displayName(): string {
    return `${this.givenName} ${this.familyName}`
  }
}

export class Admin extends User.extend<Admin>("app/Admin")({
  permissions: Schema.Array(Schema.String)
}) {}

export class Created extends Schema.TaggedClass<Created>()("Created", {
  user: User
}) {}

export class Deleted extends Schema.TaggedClass<Deleted>()("Deleted", {
  id: AccountId
}) {}

export const UserEvent = Schema.Union([Created, Deleted])

export class UserNotFound extends Schema.TaggedError<UserNotFound>()(
  "UserNotFound",
  { id: AccountId }
) {}

export class InvalidUser extends Schema.Error<InvalidUser>("InvalidUser")({
  message: Schema.NonEmptyString
}) {}

declare const loadUser: (id: AccountId) => Effect.Effect<User, UserNotFound>

export const loadOptionalUser = (id: AccountId) =>
  loadUser(id).pipe(
    Effect.catchTag("UserNotFound", () => Effect.succeed(null))
  )

// Use instanceOf for an existing native or third-party class. Use declare only
// when no built-in schema or instanceof check can describe the value.
export const NativeUrl = Schema.instanceOf(URL)

export class Email extends Schema.String.check(Schema.isPattern(/^[^@]+@[^@]+$/)) {
  static readonly decodeUnknown = Schema.decodeUnknownEffect(this)
}

export const UrlLike = Schema.declare(
  (input): input is { readonly href: string } =>
    typeof input === "object" &&
    input !== null &&
    "href" in input &&
    typeof input.href === "string",
  { expected: "an object with an href field" }
)
