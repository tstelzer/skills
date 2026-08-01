/**
 * @title Schema requirements and middleware
 *
 * Decoding and encoding may require different services. Keep those
 * requirements visible. Use fallbacks only when the boundary contract names a
 * valid fallback value.
 */
import { Context, Effect, Option, Schema } from "effect"

export interface UserRecord {
  readonly id: string
  readonly name: string
}

export class UserDirectory extends Context.Service<UserDirectory, {
  getById(id: string): Effect.Effect<UserRecord>
}>()("app/UserDirectory") {}

// This type documents a codec whose decode direction needs a service while
// its encode direction does not. Accept the codec as a dependency instead of
// hiding the required service in a module-level value.
export type UserById = Schema.Codec<
  UserRecord,
  string,
  UserDirectory,
  never
>

export const userByIdOperations = (schema: UserById) => ({
  decode: Schema.decodeEffect(schema),
  encode: Schema.encodeEffect(schema)
})

export class DefaultLocale extends Context.Service<DefaultLocale, {
  readonly locale: "en" | "de"
}>()("app/DefaultLocale") {}

export const Locale = Schema.Literals(["en", "de"]).pipe(
  Schema.catchDecodingWithContext(() =>
    Effect.gen(function*() {
      const defaults = yield* DefaultLocale
      return Option.some(defaults.locale)
    })
  )
)

// The fallback is appropriate only because this adapter's contract says that
// an unsupported locale means "use the configured default". Do not use a
// fallback to erase malformed input when callers need to reject it.
export const decodeLocale = Schema.decodeUnknownEffect(Locale)
