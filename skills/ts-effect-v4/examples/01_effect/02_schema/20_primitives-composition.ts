/**
 * @title Primitives and composite schemas
 *
 * Build boundary shapes from primitives, literals, structs, tuples, arrays,
 * records, and template literals. Choose excess-key behavior at the parser.
 */
import { Schema } from "effect"

// Elementary schemas include String, Number, BigInt, Boolean, Symbol,
// Undefined, Null, and Void. Prefer narrower built-ins when the domain has a
// stronger contract.
export const PrimitiveRecord = Schema.Struct({
  text: Schema.String,
  count: Schema.Finite,
  sequence: Schema.BigInt,
  enabled: Schema.Boolean,
  deletedAt: Schema.NullOr(Schema.Date)
})

export const RequestId = Schema.String.check(Schema.isUUID())
export const SortOrder = Schema.Literal("ascending")

const localSymbol = Symbol("local")
export const LocalSymbol = Schema.UniqueSymbol(localSymbol)

// Use a transformation schema when the encoded primitive differs from the
// domain primitive.
export const CountFromString = Schema.FiniteFromString
export const SequenceFromString = Schema.BigIntFromString

export const UserId = Schema.TemplateLiteral([
  "user_",
  Schema.String.check(Schema.isMinLength(1))
])

export const Role = Schema.Literals(["admin", "member"])

export const Coordinates = Schema.Tuple([
  Schema.Finite,
  Schema.Finite
])

export const Metadata = Schema.Record(
  Schema.String,
  Schema.Union([Schema.String, Schema.Number, Schema.Boolean])
)

export const UniqueLabels = Schema.ReadonlySet(Schema.String)
export const ScoresByUser = Schema.ReadonlyMap(UserId, Schema.Finite)
export const UniqueAliases = Schema.UniqueArray(Schema.NonEmptyString)
export const MaybeAlias = Schema.Option(Schema.String)
export const LoadResult = Schema.Result(Schema.String, Schema.NonEmptyString)
export const CacheDuration = Schema.DurationFromString

export const User = Schema.Struct({
  id: UserId,
  name: Schema.NonEmptyString,
  role: Role,
  location: Schema.optionalKey(Coordinates),
  aliases: Schema.Array(Schema.String),
  metadata: Metadata
})

export type User = typeof User.Type
export type UserEncoded = typeof User.Encoded

// Structs discard unexpected keys by default. Select another policy when the
// wire contract requires rejection or preservation.
export const decodeUserStrict = (input: unknown) =>
  Schema.decodeUnknownEffect(User)(input, {
    onExcessProperty: "error"
  })

export const decodeUserPreservingExtras = (input: unknown) =>
  Schema.decodeUnknownEffect(User)(input, {
    onExcessProperty: "preserve"
  })

// Reuse fields instead of copying shapes by hand.
export const UserSummary = Schema.Struct({
  id: User.fields.id,
  name: User.fields.name
})

// StructWithRest combines fixed fields with an index signature.
export const Counters = Schema.StructWithRest(
  Schema.Struct({ total: Schema.Finite }),
  [Schema.Record(Schema.String, Schema.Finite)]
)
