## Working with SQL databases

Use the `effect/sql` modules together with a driver package such as
`@effect/sql-sqlite-node` to access SQL databases. Define domain models with
`Model.Class` to derive schemas for the database and JSON boundaries, run
migrations, and write type-safe queries.

`@effect/sql-sqlite-node` uses `node:sqlite` and requires Node 22.16 or newer.
`@effect/sql-pg` uses Effect's PostgreSQL client; it no longer exposes a `pg` client or accepts `pg` pool options.
Inspect `SqlError.reason` for structured failures such as `UniqueViolation`.
