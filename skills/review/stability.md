# Stability Review

Use this for backwards compatibility and change safety. Treat every interface,
default, and migration path as a potential breaking change.

## Focus

- Public API and contract compatibility
- Request/response shape changes
- Schema, storage, and migration safety
- Config, environment variable, and CLI flag compatibility
- Behavior changes hidden behind the same interface
- Upgrade and rollout safety for mixed-version or partially migrated systems

## Workflow

1. Identify every externally consumed surface affected by the change.
2. Compare old and new behavior, not just old and new types.
3. Look for silent contract drift: renamed fields, changed defaults, stricter
   validation, reordered side effects, or removed fallbacks.
4. Check whether a safe migration path exists when compatibility is not
   preserved.

## Category Hints

- `api-compatibility`
- `schema-compatibility`
- `config-compatibility`
- `behavior-change`
- `migration-safety`
- `rollout-safety`

## Evidence Hints

- Old vs new code paths
- Removed exports or changed signatures
- Changed defaults or parsing rules
- Missing migration or upgrade notes
