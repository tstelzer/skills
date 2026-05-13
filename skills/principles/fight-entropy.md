# fight entropy

## reasoning

Code tends toward chaos. Every unchallenged shortcut becomes the next reader's
template. Order is active work.

Most chaos in a codebase was written for reasons that no longer exist, like a
constraint that has since been removed. Assume good intent. The people before
you had context you do not. Treat their code as a draft.

That said, do not perpetuate it. New code in old areas signals what the
codebase tolerates. Add another `try`/`catch` that swallows errors and the
next reader assumes that is the local style, even if you did not mean it
that way.

The cheapest moment to push back is when you are already in the file. If you
are renaming a function, rename the nearby stale thing too. If you are
adding a field, tighten the next type. A small cleanup as part of an existing
change costs little. The same cleanup as a separate PR rarely happens.

Keep the cleanup scoped. The point is to leave the area slightly more
ordered. Bug fixes that touch forty files are hard to review and easy to
abandon. If the cleanup needs its own decision, give it its own PR.

One caveat: before removing a strange thing, find out why it is there. Some
weird code is a fence around a real problem. Check the blame and the tests
it goes with before deleting. Clean up the chaos, but understand the fences
first.

## examples

### do not copy what you do not endorse

Weak:

```ts
// activity.service.ts (existing, swallows errors)
async function loadActivities(): Promise<Activity[]> {
  try {
    return await db.activity.findMany()
  } catch {
    return []
  }
}

// adding a new function in the same file
async function loadEvents(): Promise<Event[]> {
  try {
    return await db.event.findMany()
  } catch {
    return []
  }
}
```

The original swallow may have been defensive code from a time when the DB
client crashed on connect. The new function inherits the pattern by accident.

Stronger:

```ts
async function loadEvents(): Promise<Event[]> {
  return db.event.findMany()
}
```

Use the right pattern locally. If the existing function is wrong, leave a
note in the PR or open a follow-up; do not let the new code reinforce the bad
one.

### opportunistic cleanup

When the diff already touches a function, neighboring fixes are cheap:

```ts
// before
function activate(u: any) {
  if (!u) return
  u.status = "active"
}

// while changing this for an unrelated reason
function activate(user: User): User {
  return { ...user, status: "active" }
}
```

The `any` is replaced and the name is full. The branch was already open.

### keep cleanup scoped

Suspicious:

```text
PR: fix: handle missing email on registration

Files changed: 47
+ rename across users/ module
+ migrate 6 services to Effect
+ delete legacy mailer
- fixes the email bug somewhere in there
```

A reviewer cannot say yes to this in one read. The bug fix and the cleanup
cannot be evaluated independently.

Stronger:

```text
PR #1: fix: handle missing email on registration   (3 files)
PR #2: refactor: rename user.email -> user.contactEmail   (12 files)
PR #3: migrate users/ services to Effect   (separate, larger review)
```

Each PR has one decision. Each can be reviewed and reverted on its own
merits.

### assume good intent

Suspicious:

```ts
// orders/checkout.ts
// odd retry: 3 attempts, 50ms apart
await retry(submit, { attempts: 3, delayMs: 50 })
```

It looks arbitrary. Before deleting, check `git blame`. The commit might say:
"workaround for payment gateway 502s during the deploy window". The retry is
a fence around a real, possibly still-active problem.

Read first, change second. A weird thing with no test and no comment is a
candidate for a question.

### do not let `// TODO` rot in silence

Weak:

```ts
// TODO: handle the case where the user has no active subscription
return billing.charge(user.id, amount)
```

A `TODO` with no owner and no date fades into the background. Two years from
now, nobody knows whether the case is still relevant or who was going to fix
it.

Stronger: fix it now, or file a ticket and link it from the `TODO`. If the
case is no longer real, remove the line. A comment without an owner and an
action is noise.
