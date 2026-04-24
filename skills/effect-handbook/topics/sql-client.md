# SQL Client

## What it is
`@effect/sql` provides the shared `SqlClient.SqlClient` service, SQL statement model, safe tagged-template interpolation, transactions, streams, and query helpers. Driver packages such as `@effect/sql-pg` and `@effect/sql-sqlite-node` provide layers for the concrete database.

## When to use
- Running SQL from Effect programs
- Building safe parameterized statements with dynamic identifiers or clauses
- Using transactions, query streams, or dialect-specific branches
- Sharing database code across pg/mysql/sqlite/mssql/clickhouse drivers

## When not to use
- Route or API contracts; use `HttpApi` or `@effect/rpc`
- Non-SQL persistence APIs
- Driver-specific setup details; see `sql-drivers.md`

## Minimal examples
```ts
import { SqlClient } from "@effect/sql"
import { PgClient } from "@effect/sql-pg"
import { Effect } from "effect"

const SqlLive = PgClient.layer({
  database: "app"
})

const program = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient

  const rows = yield* sql<{
    readonly id: number
    readonly name: string
  }>`SELECT id, name FROM users WHERE active = ${true}`

  yield* sql.withTransaction(
    sql`UPDATE users SET last_seen_at = NOW() WHERE id = ${rows[0]?.id}`
  )

  return rows
}).pipe(Effect.provide(SqlLive))
```

## Query fragments
```ts
import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

const search = (ids: ReadonlyArray<number>, order: "ASC" | "DESC") =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient

    return yield* sql<{ readonly id: number }>`
      SELECT id
      FROM ${sql("users")}
      WHERE ${sql.and([
        sql.in("id", ids),
        sql`deleted_at IS NULL`
      ])}
      ORDER BY ${sql("id")} ${sql.unsafe(order)}
    `
  })
```

## Common patterns
- Provide a driver layer; it usually installs both the driver tag and `SqlClient.SqlClient`.
- Interpolate values directly: `` sql`id = ${id}` `` becomes a bound parameter.
- Use `sql("table_or_column")` for identifiers.
- Use `sql.in("column", values)`, `sql.insert(rows)`, `sql.update(row)`, `sql.updateValues(rows, alias)`, `sql.and(...)`, `sql.or(...)`, `sql.csv(...)`, and `sql.join(...)` for fragments.
- Use `.stream` for row streams, `.raw` for driver raw results, `.values` for array rows, `.withoutTransform` to skip configured name transforms, and `.compile()` for inspection.
- Wrap transactional effects with `sql.withTransaction(effect)`.
- Use `sql.onDialect(...)` or `sql.onDialectOrElse(...)` when a query must branch by database dialect.

## Common pitfalls
- Using `sql.unsafe` for user input. Only use it for trusted, already-whitelisted SQL fragments.
- Passing table or column names as normal interpolated values instead of identifiers.
- Expecting `sql.updateValues` to work on SQLite; it is not supported there.
- Forgetting that row-name transforms depend on the driver layer configuration.

## See also
- `sql-drivers.md`
- `sql-resolver-schema.md`
- `sql-migrations.md`
- `stream.md`
