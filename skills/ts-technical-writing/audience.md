# audience

## rules

- Write for a named reader doing a named job.
- Choose detail by the reader's task, not their job title. A maintainer learning the design needs different detail
  from a maintainer debugging a function.
- Include facts that help answer the reader's question. Technical accuracy alone does not make a fact relevant.
- For architecture, explain the main parts, how they work together, and why the design was chosen. Include
  implementation details only when they explain a design constraint. Keep field definitions and exact limits
  in reference docs.

## examples

### name the reader

Weak:

```md
# Import service

This document describes the import service.
```

Stronger:

```md
# Resume a failed import

Audience: on-call engineers.

Use this page when an import job stops after creating a checkpoint.
```

The stronger version tells the reader whether the page is for them.

### separate readers with different jobs

Weak:

```md
# Billing events

Billing events use Kafka. Product managers should review the event list. Engineers
can publish events with `billing.publish`. Finance uses the export on Fridays.
```

Stronger:

```md
# Billing events

For engineers: see [Billing event reference](./billing-events.md).
For finance: see [Export weekly billing data](./billing-export.md).
For product context: see [Billing event lifecycle](./billing-event-lifecycle.md).
```

Three readers have three jobs. One page should not make each reader skip two-thirds of it.

### state prerequisites

Weak:

```md
Run the replay command with the event offset.
```

Stronger:

````md
Before replaying events, get:

- The tenant ID.
- The topic name.
- The first failed offset from the incident log.

Then run:

```sh
pnpm events replay --tenant <tenant-id> --topic <topic> --from-offset <offset>
```
````

The stronger version names what the reader needs before the command can work.

### state useful non-scope

Weak:

```md
# Create an API token
```

Stronger:

```md
# Create an API token

This page covers token creation for service accounts.

It does not cover user session tokens. For those, see [Session tokens](./sessions.md).
```

Non-scope is useful when a reasonable reader might expect the topic here.

### write to the reader's knowledge

Weak:

```md
The reconciliation worker consumes settlement events and materializes the balance projection.
```

Stronger for understanding when balances change:

```md
The reconciliation worker updates the account balance after each settlement event.
```

Stronger for finding the code that updates balances:

```md
`ReconciliationWorker` consumes `PaymentSettled` events and writes the current
balance to `account_balances`.
```

Use the reader's vocabulary. Include exact names when they help the reader complete the task.

### answer the reader's first question

Weak:

```md
The deployment pipeline uses three stages. The first stage builds the artifact.
The second stage runs migrations. The third stage updates the service.
```

Stronger:

```md
Deploys are safe to retry after the build stage.

The migration stage is idempotent. The service update stage rolls back on health
check failure.
```

The operator's first question is "Can I retry this?", not "How many stages exist?"
