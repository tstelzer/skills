# integrated documentation

## reasoning

Documentation is part of the system. It shapes how people use, operate, debug,
extend, and migrate the code. Wrong docs create wrong actions.

Write docs for a reader doing a job. A user wants to finish a task. An operator
wants to restore service. An API consumer wants to know the contract. A
maintainer wants to understand a decision before changing it. Name the reader,
then write only what that reader needs.

Different docs have different jobs:

- Tutorial: teach by doing.
- How-to: complete a task.
- Reference: describe facts, contracts, parameters, commands, and errors.
- Explanation: explain context, tradeoffs, and why the system is shaped this
  way.

Do not mix those jobs by accident. A procedure overloaded with background
buries the next step. A reference page with a tutorial voice hides the facts. A
design note that tries to be current user docs will drift.

Put docs where readers look. Exported functions, modules, schemas, public API
types, commands, config files, and generated artifacts are high-leverage
surfaces. `/** ... */` on an exported contract reaches the caller at the point
of use. A README should orient a directory and point to the deeper material.

Document what code cannot carry: why, constraints, contracts, invariants,
failure modes, migration paths, operational steps, and sharp edges. Names,
types, schemas, and tests should carry the rest. A comment that repeats a type
adds maintenance cost without adding knowledge.

Public docs are contracts. A command, code sample, config snippet, status code,
error tag, default, or migration step is a claim a reader may act on. If the
claim is wrong, the doc is a bug. If the example is meant to be copied, it
should compile, run, or be easy to verify.

Prefer one source of truth. Duplicate tables, copied config schemas, copied API
fields, and hand-written generated output drift. Link to the owner, generate
the derived doc, or move the prose next to the source.

Keep docs alive or delete them. Stale docs are worse than missing docs because
they create false confidence. Change docs in the same diff as behavior. If a
doc no longer has an owner or a reader, remove it or mark it as historical.

## examples

### document the why

Weak:

```ts
// retry 3 times with 50ms delay
await retry(submit, { attempts: 3, delayMs: 50 })
```

The code already says that.

Stronger:

```ts
// Payment gateway returns 502 during its 03:00-04:00 UTC deploy window.
// Three quick retries usually ride through. Longer backoff hits the
// gateway's idle-connection timeout.
await retry(submit, { attempts: 3, delayMs: 50 })
```

The retry shape is in code. The reason for the shape lives in the comment.

### document interface contracts

Weak:

```ts
export function activateUser(id: UserId): Promise<User> {
  // ...
}
```

Callers cannot tell whether activating an already-active user is an error,
whether subscription state is checked, or what failure cases can come back.

Stronger:

```ts
/**
 * Activates a user account.
 *
 * Idempotent: an already-active user is returned unchanged.
 * The caller must check subscription state before calling this function.
 *
 * Fails with `UserNotFound` when no user with `id` exists.
 */
export function activateUser(id: UserId): Effect.Effect<User, UserNotFound> {
  // ...
}
```

Idempotence, caller responsibility, and failure shape belong to the contract.
They sit next to the signature where callers look.

### match the doc to the reader task

Weak:

```md
## Restore a failed import

The importer uses a bounded queue so workers can apply backpressure. The queue
is drained by `ImportWorker`, which uses checkpointed offsets and writes
`ImportBatchSettled` events after each batch. This design was chosen because
older versions used one job per row and overloaded Redis.

Run `pnpm import:resume --import-id <id>`.
```

The operator needs the command. The explanation hides it.

Stronger:

````md
## Restore a failed import

Run:

```sh
pnpm import:resume --import-id <id>
```

The command resumes from the last committed checkpoint.

For design context, see [Importer backpressure](./importer-backpressure.md).
````

The how-to gives action first. The explanation moves behind a link.

### keep examples executable

Weak:

````md
```ts
const client = createClient({ token: "TOKEN" })
await client.users.disable("user_123")
```
````

The API now requires an object argument. The example teaches the old call
shape.

Stronger:

````md
```ts
const client = createClient({ token: process.env.API_TOKEN })

await client.users.disable({
  userId: "user_123",
  reason: "requested-by-admin",
})
```
````

The sample matches the current API and avoids embedding a fake secret-shaped
literal.

### keep setup docs current

Weak:

````md
## Run locally

```sh
npm install
npm run dev
```
````

The repo uses `pnpm`, and `npm install` writes the wrong lockfile.

Stronger:

````md
## Run locally

```sh
corepack enable
pnpm install
pnpm dev
```
````

The commands match the repo.

### avoid duplicated config docs

Weak:

```md
| Variable | Required | Default |
| --- | --- | --- |
| RETRY_ATTEMPTS | yes | 3 |
| LOG_LEVEL | no | info |
```

```ts
const Config = Schema.Struct({
  retryAttempts: Schema.NumberFromString.pipe(Schema.withDefault(() => 2)),
  logLevel: Schema.Literal("debug", "info", "warn", "error"),
})
```

The table and schema now disagree.

Stronger:

```ts
const Config = Schema.Struct({
  retryAttempts: Schema.NumberFromString.pipe(
    Schema.annotations({
      description: "Maximum retry attempts for transient upstream failures.",
    }),
    Schema.withDefault(() => 2),
  ),
  logLevel: Schema.Literal("debug", "info", "warn", "error").pipe(
    Schema.annotations({ description: "Minimum log level." }),
  ),
})
```

Generate the config reference from the schema, or keep the prose next to the
schema that owns the contract.

### update docs with behavior

Weak:

```ts
/**
 * Sends a welcome email and adds the user to the `welcome` mailing list.
 */
async function onUserRegistered(user: User): Promise<void> {
  await sendWelcomeEmail(user)
  await trackAnalytics("user.registered", { userId: user.id })
}
```

The mailing-list call was removed. The doc still says it runs.

Stronger:

```ts
/**
 * Sends a welcome email and records the registration in analytics.
 */
async function onUserRegistered(user: User): Promise<void> {
  await sendWelcomeEmail(user)
  await trackAnalytics("user.registered", { userId: user.id })
}
```

Update the doc in the diff that changes the behavior.

### separate history from current docs

Weak:

```md
# Billing migration design

The system writes both `total` and `totalCents`.
```

The migration ended months ago. Current code writes only `totalCents`, but the
old design doc is still linked from the billing README as current behavior.

Stronger:

```md
# Billing

Current storage field: `totalCents`.

For the completed migration from `total`, see
`docs/archive/2025-03-billing-total-migration.md`.
```

Current docs state the current contract. History stays available as history.

### annotate schemas for generated docs

Schema annotations live with the schema and travel into generated artifacts.

```ts
const Money = Schema.Number.pipe(
  Schema.int(),
  Schema.nonNegative(),
  Schema.annotations({
    identifier: "Money",
    description:
      "Integer cents. Decimal conversion happens at HTTP and DB boundaries.",
  }),
)
```

The identifier names the generated schema. The description gives API readers
and operators the reason for rejecting decimal values.
