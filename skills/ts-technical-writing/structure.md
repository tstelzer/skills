# structure

## rules

- Put the useful answer first.
- Use headings that tell the reader what they get.
- Use bullets for peer items.
- Use numbered lists for ordered steps.
- Use tables for repeated fields or comparisons.
- Keep list items parallel.

## examples

### lead with the action

Weak:

```md
# Rotate a webhook secret

Webhook secrets secure requests sent to partners. Rotation may be needed when a
secret leaks or when a partner requests a scheduled credential change.

Open Settings and click Rotate.
```

Stronger:

```md
# Rotate a webhook secret

Open Settings, select the webhook, and click Rotate.

Use this when a secret leaks or when a partner requests a scheduled credential
change.
```

Put context after the step unless the context changes the step.

### use headings for scanning

Weak:

```md
## Details

The command fails if the import is already running.

## More details

The command exits with code 2 when no checkpoint exists.
```

Stronger:

```md
## Running imports cannot resume

The command fails if the import is already running.

## Missing checkpoints return exit code 2

The command exits with code 2 when no checkpoint exists.
```

The stronger headings carry information.

### convert dense prose to bullets

Weak:

```md
Before deleting a tenant, confirm that the tenant has no active subscriptions,
no pending invoices, no open support tickets, and no unexported audit records.
```

Stronger:

```md
Before deleting a tenant, confirm that it has no:

- Active subscriptions.
- Pending invoices.
- Open support tickets.
- Unexported audit records.
```

Bullets make each condition visible.

### use numbered lists for order

Weak:

```md
- Stop the worker.
- Save the checkpoint.
- Restart the worker.
```

Stronger:

```md
1. Stop the worker.
2. Save the checkpoint.
3. Restart the worker.
```

Use numbers when changing the order changes the result.

### start steps with verbs

Weak:

```md
1. The failed import should be selected.
2. The checkpoint should be opened.
3. The import can be resumed.
```

Stronger:

```md
1. Select the failed import.
2. Open the checkpoint.
3. Resume the import.
```

Commands should read like commands.

### keep list items parallel

Weak:

```md
The endpoint returns:

- `200` when the token is valid.
- Expired tokens return `401`.
- If the token scope is wrong, `403`.
```

Stronger:

```md
The endpoint returns:

- `200` when the token is valid.
- `401` when the token is expired.
- `403` when the token has the wrong scope.
```

Parallel structure lets the reader compare items.

### use a table for repeated fields

Weak:

```md
The event has an `id`, which is a string. It has `type`, which is one of
`created` or `deleted`. It has `createdAt`, which is an ISO timestamp.
```

Stronger:

```md
| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable event ID. |
| `type` | `created` or `deleted` | Event kind. |
| `createdAt` | ISO timestamp | Time the event was created. |
```

Tables work when each item has the same properties.

### keep one idea per paragraph

Weak:

```md
The worker retries failed jobs and writes failures to the dead-letter queue, and
the queue is drained by the repair job, which runs every hour and skips jobs for
deleted tenants.
```

Stronger:

```md
The worker retries failed jobs.

After the retry limit, the worker writes the job to the dead-letter queue.

The repair job drains that queue every hour. It skips jobs for deleted tenants.
```

Short paragraphs make the state changes visible.
