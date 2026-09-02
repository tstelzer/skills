/**
 * @title Schema basics
 *
 * Define `Schema.Class`s, decode unknown input into typed values, and
 * encode typed values back into their external representation.
 */
import { Effect, Schema } from "effect"

// Schema.Class defines both a runtime validator and a TypeScript class.
// This is useful for domain models that should only be constructed from valid
// data.
//
// The static `Type` and `Encoded` members are available when you need
// the decoded or encoded TypeScript representation.
export class User extends Schema.Class<User>("path/to/module/User")({
  id: Schema.Int,
  name: Schema.NonEmptyString,
  email: Schema.String,
  role: Schema.Literals(["admin", "member"])
}) {}

// `UserType` will be the type `User`, as schema classes use the class type as
// the validated type.
export type UserType = typeof User["Type"]

// Access the encoded type with `typeof YourSchema["Encoded"]`.
export type UserEncoded = typeof User["Encoded"]

// Reuse parsers at the edges of your application instead of rebuilding them for
// every request. Use the Effect-returning APIs when you are already inside
// Effect code so validation errors remain typed in the error channel.
export const decodeUser = Schema.decodeUnknownEffect(User)
export const encodeUser = Schema.encodeEffect(User)

// Pick the parser result that matches the caller's contract. Effect is the
// default inside an Effect program. Exit and Option are useful when failure is
// data. Sync intentionally throws, and Promise is for a non-Effect async edge.
export const decodeUserExit = Schema.decodeUnknownExit(User)
export const decodeUserOption = Schema.decodeUnknownOption(User)
export const decodeUserSync = Schema.decodeUnknownSync(User)
export const decodeUserPromise = Schema.decodeUnknownPromise(User)

export class InvalidUserPayload extends Schema.TaggedError<InvalidUserPayload>()("InvalidUserPayload", {
  reason: Schema.instanceOf(Schema.SchemaError)
}) {}

export const parseUserPayload = Effect.fn("parseUserPayload")((input: unknown) =>
  decodeUser(input).pipe(
    // Map only this boundary operation and retain the structured SchemaError.
    Effect.mapError((reason) => new InvalidUserPayload({ reason }))
  )
)
