# Review Stability

Check whether existing users and code still work after the change or an upgrade.

## Review target

Look for the smallest change that keeps the promises made to existing callers and users.

## Required skills

Read these detail pages from skill: ts-principles:

- `evolve contracts deliberately`
- `keep boundaries sharp`
- `parse, don't validate`
- `handle it, or die`
- `design for operation`

## What to check

- Public APIs, SDKs, command-line flags, environment variables, and rules for settings.
- HTTP request and response fields, status and error codes, and headers.
- Saved data, database migrations, work that fills in old records, indexes, database rules, and initial data.
- Queue messages, events, jobs, subscriptions, webhooks, and data sent again later.
- Generated API descriptions and types: OpenAPI, JSON Schema, GraphQL, protobuf, client code, and exported schemas.
- Defaults, fallback behavior, feature flags, input parsing, event order, and effects of existing calls.
- Old and new versions running together, returning to a previous version, unfinished migrations, and older clients
  or code that reads and writes data.

## Outside this review

- New behavior that no existing caller uses.
- General code quality.
- Test quality alone.
- Speed or resource cost alone.
- Attacks and security checks.
- General docs quality. Include missing upgrade or migration instructions when their absence could break usage.

## Steps

1. List the promises that the change affects, such as accepted inputs, saved formats, and returned values.
2. List what sends, receives, and stores the data. Include generated files and older code that reads or writes it.
3. Compare what the old and new code do, as well as their types.
4. Check old senders with new receivers and new senders with old receivers. Check returning to the old version,
   sending old messages again, and stopping a migration partway through.
5. Look for changes that callers may not notice until something breaks: renamed or removed fields, new defaults,
   changed event order, removed fallbacks, and removed or reused error and status codes.
6. Check whether changes that break old behavior have a planned way to move existing users and data across.
7. Keep only problems that could break a specific existing caller or one that could reasonably exist.
8. Return findings using [review-template.md](../review-template.md).

## Severity examples

Use these examples to help judge how serious the actual problem is.

- `critical`: an existing caller stops working, or saved data, a gradual rollout, or an interface promise breaks.
- `high`: a change silently allows a request it should block, converts data differently, or misses a migration step.
- `low`: the interface becomes harder to use, but its behavior still works.

## Category examples

- `api-contract`
- `request-contract`
- `response-contract`
- `event-contract`
- `storage-contract`
- `migration-safety`
- `rolling-deploy`
- `rollback-safety`
- `config-contract`
- `default-change`
- `error-contract`
- `generated-artifact`
- `consumer-compatibility`
- `upgrade-path`
- `behavior-change`
