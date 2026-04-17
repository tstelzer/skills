# Docs Review

Use this for documentation quality. Treat inaccurate docs as a product bug, not
as polish work.

## Focus

- Missing documentation for user-visible behavior changes
- Stale or incorrect setup, usage, upgrade, or troubleshooting docs
- Examples that no longer match the implementation
- Missing migration notes for breaking or sharp-edge changes
- Incorrect commands, config snippets, or API descriptions
- Public surfaces that changed without corresponding docs updates

## Workflow

1. Identify what a user, operator, or future maintainer would need to know.
2. Compare documentation claims and examples against the actual implementation.
3. Look for missing upgrade notes when behavior, defaults, or contracts change.
4. Prefer findings where incorrect docs would cause a real user mistake.

## Category Hints

- `correctness`
- `coverage`
- `upgrade-guidance`
- `examples`
- `operations`
- `api-docs`

## Evidence Hints

- Mismatch between docs text and code
- Missing docs for changed flags, env vars, or APIs
- Broken or stale examples
