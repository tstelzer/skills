# maintenance

## rules

- Treat docs as contracts.
- Put docs where readers look.
- Document what the code cannot carry.
- Keep one source of truth.
- Update docs with behavior.
- Delete or archive stale docs.

## examples

### document the contract next to the interface

Weak:

```ts
export function activateUser(id: UserId): Promise<User> {
  // ...
}
```

Stronger:

```ts
/**
 * Activates a user account.
 *
 * Idempotent: returns an already-active user unchanged.
 * Fails with `UserNotFound` when no user exists for `id`.
 */
export function activateUser(id: UserId): Promise<User> {
  // ...
}
```

Idempotence and failure shape belong where callers look.

### document why, not what

Weak:

```ts
// Retry three times with a 50 ms delay.
await retry(submit, { attempts: 3, delayMs: 50 })
```

Stronger:

```ts
// The payment gateway returns brief 502 bursts during its daily deploy window.
// Three quick retries usually finish before the gateway closes idle connections.
await retry(submit, { attempts: 3, delayMs: 50 })
```

The code says what. The comment says why.

### keep one source of truth

Weak:

```md
| Variable | Default |
| --- | --- |
| `RETRY_ATTEMPTS` | `3` |
```

```ts
const Config = Schema.Struct({
  retryAttempts: Schema.NumberFromString.pipe(Schema.withDefault(() => 2)),
})
```

Stronger:

```ts
const Config = Schema.Struct({
  retryAttempts: Schema.NumberFromString.pipe(
    Schema.annotations({
      description: "Maximum retry attempts for transient upstream failures.",
    }),
    Schema.withDefault(() => 2),
  ),
})
```

Generate the reference from the schema, or keep the prose next to the schema.

### keep commands current

Weak:

````md
```sh
npm install
npm run dev
```
````

Stronger:

````md
```sh
pnpm install
pnpm dev
```
````

A setup command that writes the wrong lockfile is a documentation bug.

### separate history from current docs

Weak:

```md
# Billing storage

The system writes both `total` and `totalCents`.
```

Stronger:

```md
# Billing storage

Current field: `totalCents`.

For the completed migration from `total`, see
`docs/archive/2025-03-billing-total-migration.md`.
```

Current docs should describe current behavior. History should be marked as history.

### delete docs without a reader

Weak:

```md
# Legacy import V1

This importer was replaced by Import V2.
```

Stronger:

```md
# Importer

Current importer: Import V2.
```

Delete the V1 page when no supported system or reader uses it.

### update docs in the behavior diff

Weak:

```text
PR #1: change token expiry from 24 hours to 1 hour
PR #2: update docs later
```

Stronger:

```text
PR #1: change token expiry from 24 hours to 1 hour and update:
- API reference
- Admin UI help text
- Token rotation runbook
```

Docs that describe public behavior change with that behavior.
