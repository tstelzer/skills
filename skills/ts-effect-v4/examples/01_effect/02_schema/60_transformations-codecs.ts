/**
 * @title Transformations and codecs
 *
 * A codec describes a decoded Type, an Encoded representation, and the
 * services required in each direction.
 */
import { Schema, SchemaTransformation } from "effect"

export const NormalizedName = Schema.String.pipe(
  Schema.decode(
    SchemaTransformation.trim().compose(
      SchemaTransformation.toLowerCase()
    )
  )
)

export const Port = Schema.String.pipe(
  Schema.decodeTo(
    Schema.Int.check(
      Schema.isBetween({ minimum: 1, maximum: 65_535 })
    ),
    SchemaTransformation.numberFromString
  )
)

export type Port = typeof Port.Type
export type PortEncoded = typeof Port.Encoded

export const KilometersFromMeters = Schema.Finite.pipe(
  Schema.decode(
    SchemaTransformation.transform({
      decode: (meters) => meters / 1_000,
      encode: (kilometers) => kilometers * 1_000
    })
  )
)

export const User = Schema.Struct({
  userId: Schema.FiniteFromString,
  displayName: NormalizedName
}).pipe(
  // The decoded field names stay camelCase. Only the external keys change.
  Schema.encodeKeys({
    userId: "user_id",
    displayName: "display_name"
  })
)

export const Event = Schema.Struct({
  // Add the discriminator while decoding and omit it while encoding.
  _tag: Schema.tagDefaultOmit("Event"),
  sequence: Schema.FiniteFromString
})

// Flip when an existing codec already describes the inverse direction.
export const StringFromFinite = Schema.flip(Schema.FiniteFromString)

export const decodePort = Schema.decodeUnknownEffect(Port)
export const encodePort = Schema.encodeEffect(Port)
