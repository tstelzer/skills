# SQL Resolver And Schema

## What it is
`SqlResolver` builds request resolvers backed by SQL queries. `SqlSchema` builds schema-validated query functions without request batching. Both encode request schemas, decode result schemas, and keep SQL boundaries typed with `Schema`.

## When to use
- Batching repeated SQL lookups through Effect requests
- Validating database rows with `Schema`
- Building insert/update/select helpers around request and result models
- Returning `Option` for possibly missing rows

## When not to use
- One-off queries where plain `SqlClient` is clearer
- Complex domain repositories that already use `Model` helpers
- ORM query-builder code; see `sql-drivers.md` for Drizzle/Kysely adapters

## Minimal resolver
```ts
import { SqlClient, SqlResolver } from "@effect/sql"
import { Effect, Schema, Struct } from "effect"

class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  name: Schema.String,
  createdAt: Schema.DateFromSelf
}) {}

const InsertUser = Schema.Struct(Struct.omit(User.fields, "id", "createdAt"))

export const makeUsers = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient

  const insert = yield* SqlResolver.ordered("InsertUser", {
    Request: InsertUser,
    Result: User,
    execute: (requests) =>
      sql`INSERT INTO users ${sql.insert(requests)} RETURNING users.*`
  })

  const byId = yield* SqlResolver.findById("UserById", {
    Id: Schema.Number,
    Result: User,
    ResultId: (user) => user.id,
    execute: (ids) => sql`SELECT * FROM users WHERE ${sql.in("id", ids)}`
  })

  return {
    insert: insert.execute,
    byId: (id: number) => Effect.withRequestCaching("on")(byId.execute(id))
  }
})
```

## Minimal schema query
```ts
import { SqlClient, SqlSchema } from "@effect/sql"
import { Effect, Schema } from "effect"

class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  name: Schema.String
}) {}

const UserId = Schema.Struct({ id: Schema.Number })

export const makeGetUser = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient

  return SqlSchema.findOne({
    Request: UserId,
    Result: User,
    execute: ({ id }) => sql`SELECT id, name FROM users WHERE id = ${id}`
  })
})
```

## Common patterns
- Use `SqlResolver.ordered` when returned rows match requests by array position.
- Use `SqlResolver.findById` when the query returns rows keyed by id and missing rows should be `Option.none()`.
- Use `SqlResolver.grouped` when each request can return many rows grouped by a key.
- Use `SqlResolver.void` for batched write effects that discard rows.
- Use `SqlSchema.findAll`, `findOne`, `single`, or `void` for non-batched schema-backed queries.
- Enable batching at the call site with `Effect.all(..., { batching: true })` or related batching-aware combinators.

## Common pitfalls
- Returning fewer rows from `ordered`; it fails when result length does not match request count.
- Forgetting request encoding happens before `execute`, so `execute` receives encoded request values.
- Skipping `Effect.withRequestCaching("on")` when repeated resolver lookups should share request-cache results.
- Using `single` for optional rows; use `findOne` if no row is a valid result.

## See also
- `sql-client.md`
- `schema.md`
- `request-resolver.md`
- `option-either.md`
