/**
 * @title Deriving structs, tuples, and unions
 *
 * Derive related schemas from a source schema. Do not copy field definitions
 * that should evolve together.
 */
import { Schema, Struct, Tuple } from "effect"

export const User = Schema.Struct({
  id: Schema.String,
  name: Schema.NonEmptyString,
  email: Schema.String,
  active: Schema.Boolean
})

export const PublicUser = User.mapFields(
  Struct.pick(["id", "name"])
)

export const UserWithoutEmail = User.mapFields(
  Struct.omit(["email"])
)

export const UserPatch = User.mapFields(
  Struct.map(Schema.optionalKey)
)

export const UserWithRevision = User.pipe(
  Schema.fieldsAssign({ revision: Schema.Int })
)

export const WireUser = User.mapFields(
  Struct.renameKeys({
    id: "user_id",
    name: "display_name"
  })
)

export const MutableCounter = Schema.Struct({
  count: Schema.mutableKey(Schema.Int)
})

export const Command = Schema.Tuple([
  Schema.String,
  Schema.Number,
  Schema.Boolean
])

export const CommandNameAndFlag = Command.mapElements(
  Tuple.pick([0, 2])
)

export const CommandWithRest = Schema.TupleWithRest(
  Schema.Tuple([Schema.String]),
  [Schema.String]
)

export const Value = Schema.Union([
  Schema.String,
  Schema.Number
])

// oneOf rejects a value when more than one member matches.
export const ExclusiveShape = Schema.Union([
  Schema.Struct({ id: Schema.String }),
  Schema.Struct({ name: Schema.String })
], { mode: "oneOf" })

export const ValueWithBoolean = Value.mapMembers(
  Tuple.appendElement(Schema.Boolean)
)

export const Started = Schema.TaggedStruct("Started", {
  at: Schema.DateValid
})
