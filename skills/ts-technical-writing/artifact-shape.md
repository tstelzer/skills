# artifact shape

## rule

Choose one primary job for the artifact before writing.

## quick map

| Shape | Reader job | Use this shape for |
| --- | --- | --- |
| Tutorial | Learn by doing | First successful run, onboarding, guided practice |
| How-to | Finish a task | Recipes, runbooks, one-off operations |
| Reference | Look up facts | APIs, commands, config, schemas, errors |
| Explanation | Understand why | Architecture, decisions, tradeoffs, history |

## examples

### tutorial

Weak:

```md
# Authentication

OAuth 2.0 is an authorization framework. The token endpoint accepts form-encoded
requests. To create a token, run `curl ...`.
```

Stronger:

````md
# Create your first access token

In this tutorial, you create a local client and call the `/me` endpoint.

1. Create a client:

```sh
pnpm auth client:create --name local-test
```

2. Request a token:

```sh
pnpm auth token:create --client local-test
```

3. Call the API:

```sh
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/me
```
````

A tutorial teaches by doing. It can hide branches until later.

### how-to

Weak:

```md
# Importer design

The importer uses checkpoints because imports can take hours. The checkpoint
table stores the last committed row. You can resume an import with the CLI.
```

Stronger:

````md
# Resume an import

Run:

```sh
pnpm import resume --import-id <import-id>
```

The command resumes from the last committed checkpoint.
````

A how-to starts with the action. Link design context instead of burying the step.

### reference

Weak:

```md
# Retries

Retries help the system recover from temporary errors. You can configure several
retry options depending on how reliable the upstream is.
```

Stronger:

```md
# Retry options

| Option | Type | Default | Meaning |
| --- | --- | --- | --- |
| `attempts` | integer | `3` | Maximum attempts, including the first call. |
| `initialDelayMs` | integer | `100` | Delay before the first retry. |
| `maxDelayMs` | integer | `5000` | Upper bound for exponential backoff. |
```

Reference is for lookup. Keep it factual and regular.

### explanation

Weak:

```md
# Use the importer

The importer uses a bounded queue because the old one-job-per-row design
overloaded Redis during large imports.

Run `pnpm import start`.
```

Stronger:

```md
# Why imports use a bounded queue

Large customer imports can contain more than 500,000 rows. The old design created
one Redis job per row, so Redis became the bottleneck before workers did useful
work.

The current design keeps one job per file and uses a bounded in-process queue for
row work. Backpressure now reaches the file reader before memory grows.
```

Explanation answers why. It does not pretend to be a task guide.

### split mixed content

Weak:

```md
# Webhooks

Webhooks send events to partner systems. To add one, open Settings. We chose
HMAC signatures because partners already use shared secrets. The `secret` field
is required. The retry schedule is 1 minute, 5 minutes, then 30 minutes.
```

Stronger:

```md
# Webhooks

- [Add a webhook](./add-webhook.md)
- [Webhook API reference](./webhook-reference.md)
- [Why webhooks use HMAC signatures](./webhook-signatures.md)
```

When one page has three jobs, make the split visible.
