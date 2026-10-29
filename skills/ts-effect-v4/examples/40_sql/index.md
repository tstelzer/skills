## Working with SQL databases

Use the `effect/sql` modules together with a driver package such as
`@effect/sql-sqlite-node` to access SQL databases. Define domain models with
`Model.Class` to derive schemas for the database and JSON boundaries, run
migrations, and write type-safe queries.

`@effect/sql-sqlite-node` uses `node:sqlite`. Use Node 22.19 or newer.
`@effect/sql-pg` uses Effect's PostgreSQL client; it no longer exposes a `pg` client or accepts `pg` pool options.
Inspect `SqlError.reason` for structured failures such as `UniqueViolation`.

Import the generic filesystem migration loader from `effect/sql/MigratorFileSystem`.
Driver migrators also export `fromFileSystem`, except the React Native adapter.

Narrow row arrays with `Array.isReadonlyArrayNonEmpty` before `sql.insert` or
`sql.updateValues`. Both require at least one row.

Get `sql` with `yield* SqlClient.SqlClient`. Use `sql.afterCommit(...)` for work
that must wait for the outermost transaction to commit. Outside a transaction
it runs immediately. Use
`SqlClient.BeginTransaction` to set a top-level transaction's opening statement;
nested transactions still use savepoints.

Get `pg` with `yield* PgClient.PgClient`, then `yield* pg.poolStats` for
PostgreSQL connection counts and waiting borrowers.
