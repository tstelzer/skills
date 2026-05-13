# integrated documentation

## reasoning

Code shows what something does. Documentation should cover what the code
cannot: the reasons behind a decision and the constraints that shaped it.
Neither can be recovered from the code alone.

Interfaces are the highest-leverage place to document. Callers can read a
signature, but they cannot tell which arguments are validated, what the
errors mean, or what invariants the type assumes. `/** ... */` on exported
functions, types, and modules puts that information where the caller looks.

Redundant docs are noise. A comment that restates `getUserEmail(): string`
adds nothing and rots first. Trust the type
system to carry names, shapes, and trivial mechanics. Spend the words on
what types cannot express.

Stale docs are worse than no docs. A comment that contradicts the code
makes the reader doubt both, and the doubt spreads to every other comment
in the file. Keep docs in sync with the same diff that changes behavior, or
delete them.

## examples

### document the why, not the what

Weak:

```ts
// retry 3 times with 50ms delay
await retry(submit, { attempts: 3, delayMs: 50 })
```

The code already says all of that.

Stronger:

```ts
// Payment gateway returns 502 during their deploy window (roughly
// 03:00-04:00 UTC). Three quick retries usually ride through; longer
// backoff hits the gateway's idle-connection timeout.
await retry(submit, { attempts: 3, delayMs: 50 })
```

The retry shape is in the code. The reason for the exact shape lives only
in the comment.

### prioritize interface docs

Weak:

```ts
export function activateUser(id: UserId): Promise<User> {
  // ...
}
```

Callers cannot tell whether activating an already-active user is an error,
whether subscription state is checked, or what failure cases can come back.
The signature shows none of it.

Stronger:

```ts
/**
 * Activates a user account.
 *
 * Idempotent: calling this on an already-active user returns the user
 * unchanged. The function does not check subscription state, because
 * activation runs before billing is wired up in the registration flow;
 * the caller is responsible for that check.
 *
 * Throws `UserNotFound` when no user with `id` exists.
 */
export function activateUser(id: UserId): Promise<User> {
  // ...
}
```

Idempotence, what is not checked, and the failure shape all belong to the
contract. They sit next to the signature where callers actually look.

### keep docs in sync

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

The mailing-list call was removed months ago. The doc still describes it.
A reader cannot trust the comment, and the doubt spreads to every other
comment in the module.

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

Update the doc in the diff that changes the behavior. When a function does
too much to summarize cleanly, that is a signal to split it before the doc
gets worse.

### Effect: annotate schemas for context

Schema annotations live with the schema and travel into the artifacts the
schema produces.

```ts
const Money = Schema.Number.pipe(
  Schema.int(),
  Schema.nonNegative(),
  Schema.annotations({
    identifier: "Money",
    description:
      "Integer cents. Decimal conversion happens at HTTP and DB boundaries; internal code always works in cents.",
  }),
)
```

The `identifier` becomes the name in generated OpenAPI / JSON Schema. The
`description` shows up in decode error messages, where it gives the reader
the context for why a value was rejected. Documenting the schema once
covers human readers, API consumers, and operators reading parse errors.
