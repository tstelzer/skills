# SQL Drivers

## What it is
Effect SQL driver packages adapt concrete databases to the shared `@effect/sql` client. Driver layers usually provide both the driver-specific tag and `SqlClient.SqlClient`, so most application code can depend on `SqlClient.SqlClient`.

## When to use
- Choosing or configuring an Effect SQL database driver
- Wiring database layers into an app
- Using driver-specific services such as Postgres listen/notify or JSON helpers
- Integrating Drizzle or Kysely with Effect SQL transactions

## Driver packages
- `@effect/sql-pg` — PostgreSQL using `pg`; exposes `PgClient`, `PgMigrator`, `layer`, `layerConfig`, `layerFromPool`, `listen`, `notify`, and `json`.
- `@effect/sql-mysql2` — MySQL using `mysql2`; exposes `MysqlClient` and `MysqlMigrator`.
- `@effect/sql-mssql` — Microsoft SQL Server; exposes `MssqlClient`, `MssqlMigrator`, procedure, and parameter helpers.
- `@effect/sql-clickhouse` — ClickHouse client and migrator.
- `@effect/sql-libsql` — libSQL/Turso-style SQLite driver and migrator.
- `@effect/sql-d1` — Cloudflare D1 driver.
- `@effect/sql-sqlite-node` — Node SQLite using `better-sqlite3`.
- `@effect/sql-sqlite-bun` — Bun SQLite.
- `@effect/sql-sqlite-wasm` — SQLite WASM.
- `@effect/sql-sqlite-react-native` — React Native SQLite.
- `@effect/sql-sqlite-do` — SQLite for Durable Objects.
- `@effect/sql-drizzle` — Drizzle integration.
- `@effect/sql-kysely` — Kysely integration; check the adapter compatibility notes and pin Kysely when needed.

## Minimal layer config
```ts
import { SqlClient } from "@effect/sql"
import { PgClient } from "@effect/sql-pg"
import { Config, Effect, Redacted, String } from "effect"

const SqlLive = PgClient.layer({
  database: "app",
  username: "app",
  password: Redacted.make("secret"),
  transformQueryNames: String.camelToSnake,
  transformResultNames: String.snakeToCamel
})

const SqlFromConfig = PgClient.layerConfig({
  database: Config.string("DATABASE"),
  username: Config.string("DATABASE_USER")
})

const program = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  return yield* sql`SELECT 1 AS ok`
}).pipe(Effect.provide(SqlLive))
```

## Common patterns
- Prefer `layerConfig` when values come from `Config`; prefer `layer` for already-built values.
- Configure `transformQueryNames` and `transformResultNames` at the driver layer when code uses camelCase but the database uses snake_case.
- Depend on `SqlClient.SqlClient` in shared repositories; depend on the driver tag only for driver-specific features.
- Use `PgClient.PgClient` when calling Postgres-only `listen`, `notify`, or `json`.
- Use `layerFromPool` when an existing pool lifecycle is owned elsewhere and the driver supports it.

## Common pitfalls
- Mixing transformed and untransformed column names without using `.withoutTransform` where needed.
- Assuming all helpers compile identically across dialects.
- Using `@effect/sql-kysely` without checking the supported Kysely version range in the reference package.
- Requiring a driver-specific tag in business logic when `SqlClient.SqlClient` is sufficient.

## See also
- `sql-client.md`
- `sql-migrations.md`
- `config.md`
- `layer-context.md`
