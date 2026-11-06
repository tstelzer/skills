/**
 * @title Composing services with the Layer module
 *
 * Build focused service layers, then compose them with `Layer.provide` and
 * `Layer.provideMerge` based on what services you want to expose.
 */

import { PgClient } from "@effect/sql-pg"
import { Array, Config, Context, Effect, Layer, type Option, Schema } from "effect"
import { SqlClient, SqlError } from "effect/sql"

// Define a layer for the SqlClient service
export const SqlClientLayer: Layer.Layer<
  PgClient.PgClient | SqlClient.SqlClient,
  Config.ConfigError | SqlError.SqlError
> = PgClient.layerConfig({
  url: Config.Redacted("DATABASE_URL")
})

export class UserRespositoryError extends Schema.TaggedError<UserRespositoryError>()("UserRespositoryError", {
  reason: SqlError.SqlError
}) {}

export class UserRepository extends Context.Service<UserRepository, {
  findById(id: string): Effect.Effect<
    Option.Option<{ readonly id: string; readonly name: string }>,
    UserRespositoryError
  >
}>()("myapp/UserRepository", {
  make: Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const findById = Effect.fn("UserRepository.findById")(function*(id: string) {
      const results = yield* sql<{
        readonly id: string
        readonly name: string
      }>`SELECT * FROM users WHERE id = ${id}`
      return Array.head(results)
    }, Effect.mapError((reason) => new UserRespositoryError({ reason })))

    return { findById }
  })
}) {
  // Keep the SqlClient requirement visible until dependencies are provided.
  static readonly layerNoDeps = Layer.effect(this, this.make)

  // Expose only UserRepository after providing its database dependency.
  static readonly layer = this.layerNoDeps.pipe(
    Layer.provide(SqlClientLayer)
  )

  // Expose both UserRepository and SqlClient.
  static readonly layerWithSqlClient = this.layerNoDeps.pipe(
    Layer.provideMerge(SqlClientLayer)
  )
}
