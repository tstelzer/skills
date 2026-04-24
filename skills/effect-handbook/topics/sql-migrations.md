# SQL Migrations

## What it is
Effect SQL migrators run forward-only TypeScript migrations whose default export is an `Effect` requiring `SqlClient.SqlClient`. Driver packages expose migrator modules such as `PgMigrator`, `MysqlMigrator`, `MssqlMigrator`, `SqliteMigrator`, and related target-specific variants.

## When to use
- Applying database schema changes at application startup or from a CLI
- Keeping migrations in TypeScript beside the app
- Running migration effects with the same driver layer used by application queries

## When not to use
- Reversible migration workflows that require down migrations
- Teams already standardized on an external migration tool
- Runtime schema changes inside request handlers

## Migration file
```ts
// src/migrations/0001_add_users.ts
import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient

  yield* sql`
    CREATE TABLE users (
      id serial PRIMARY KEY,
      name text NOT NULL,
      created_at timestamp with time zone NOT NULL DEFAULT now()
    )
  `
})
```

## Migrator layer
```ts
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { PgClient, PgMigrator } from "@effect/sql-pg"
import { Effect, Layer } from "effect"
import { fileURLToPath } from "node:url"

const SqlLive = PgClient.layer({
  database: "app"
})

const MigratorLive = PgMigrator.layer({
  loader: PgMigrator.fromFileSystem(
    fileURLToPath(new URL("migrations", import.meta.url))
  ),
  schemaDirectory: "src/migrations"
}).pipe(Layer.provide(SqlLive))

const MainLive = Layer.mergeAll(SqlLive, MigratorLive).pipe(
  Layer.provide(NodeContext.layer)
)

Effect.void.pipe(
  Effect.provide(MainLive),
  NodeRuntime.runMain
)
```

## Common patterns
- Migration filenames use an id and name, for example `0001_add_users.ts`.
- The default migrations table is `effect_sql_migrations`; pass `table` to override it.
- Use `schemaDirectory` when the driver migrator can dump a `_schema.sql` snapshot.
- Provide the SQL driver layer to the migrator layer.
- Provide `NodeContext.layer` when loading migrations from the filesystem.

## Common pitfalls
- Exporting a function or promise instead of an Effect as the migration default.
- Forgetting migrations are forward-only.
- Starting application code before the migrator layer has been provided.
- Running concurrent migration processes without relying on the migrator lock behavior.

## See also
- `sql-client.md`
- `sql-drivers.md`
- `config.md`
