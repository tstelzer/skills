/**
 * @title Optional fields and defaults
 *
 * Model missing keys, undefined, null, Option, decoding defaults, and
 * constructor defaults as distinct contracts.
 */
import { Clock, Effect, Option, Schema } from "effect"

export const Patch = Schema.Struct({
  // The key may be absent. If present, its value must be a string.
  displayName: Schema.optionalKey(Schema.NonEmptyString),

  // The key may be absent or explicitly undefined.
  biography: Schema.optional(Schema.String),

  // The key may be absent. If present, it may contain null.
  avatarUrl: Schema.optionalKey(Schema.NullOr(Schema.String)),

  // Decode absence, undefined, or null into Option.none().
  referralCode: Schema.OptionFromOptionalNullOr(Schema.String)
})

export type Patch = typeof Patch.Type
export type PatchEncoded = typeof Patch.Encoded

export const Settings = Schema.Struct({
  // The default is an Encoded value and is decoded from string to number.
  retries: Schema.FiniteFromString.pipe(
    Schema.withDecodingDefault(Effect.succeed("3"))
  ),

  // The default is already a decoded Type value.
  timeoutSeconds: Schema.FiniteFromString.pipe(
    Schema.withDecodingDefaultType(Effect.succeed(30))
  )
})

export const decodeSettings = Schema.decodeUnknownEffect(Settings)

export const Job = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.Date.pipe(
    Schema.withConstructorDefault(
      Clock.currentTimeMillis.pipe(
        Effect.map((millis) => new Date(millis))
      )
    )
  )
})

// Constructor defaults apply to make(), not to boundary decoding.
export const makeJob = (id: string) => Job.make({ id })

export const encodePatchWithoutReferral = Schema.encodeEffect(Patch)({
  displayName: "Ada",
  biography: undefined,
  avatarUrl: null,
  referralCode: Option.none()
})
