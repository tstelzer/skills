/**
 * @title Validation, refinements, brands, and constructors
 *
 * Use synchronous filters for pure checks. Use an effectful schema getter when
 * validation needs a service or asynchronous operation.
 */
import { Context, Effect, Schema, SchemaGetter, SchemaIssue } from "effect"

export const Username = Schema.String.check(
  Schema.isMinLength(3),
  Schema.isMaxLength(32),
  Schema.isPattern(/^[a-z0-9_]+$/)
)

export const PasswordChange = Schema.Struct({
  password: Schema.String,
  confirmation: Schema.String
}).check(
  Schema.makeFilter(({ confirmation, password }) =>
    password === confirmation
      ? undefined
      : {
        path: ["confirmation"],
        issue: "password and confirmation must match"
      }
  )
)

export const NonEmptyStrings = Schema.Array(Schema.String).pipe(
  Schema.refine(
    (values): values is readonly [string, ...Array<string>] => values.length > 0
  )
)

export const UserId = Schema.String.pipe(Schema.brand("UserId"))
export type UserId = typeof UserId.Type

// make() validates and throws on invalid input. makeOption() treats schema
// failure as Option.none().
export const makeUserId = UserId.make
export const maybeUserId = UserId.makeOption

export class UserDirectory extends Context.Service<UserDirectory, {
  exists(id: string): Effect.Effect<boolean>
}>()("app/UserDirectory") {}

export const ExistingUserId = Schema.String.pipe(
  Schema.decode({
    decode: SchemaGetter.checkEffect((id) =>
      Effect.gen(function*() {
        const directory = yield* UserDirectory
        const exists = yield* directory.exists(id)
        return exists
          ? undefined
          : new SchemaIssue.InvalidValue({
            title: "an existing user id"
          })
      })
    ),
    encode: SchemaGetter.passthrough()
  })
)

// The UserDirectory requirement remains in the decoding environment.
export const decodeExistingUserId = Schema.decodeUnknownEffect(ExistingUserId)
