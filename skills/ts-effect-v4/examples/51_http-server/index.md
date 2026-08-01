## Building HttpApi servers

`HttpApi` gives you schema-first, type-safe HTTP APIs with runtime validation,
typed clients, and OpenAPI docs from one definition.

Keep absent, empty, malformed, partial, and complete request states distinct
when they produce different domain or protocol outcomes. Parse once at the
boundary and pass decoded domain values inward.

Use `Effect.die` or `Effect.orDie` only when the protocol contract declares a
failure impossible. Do not use either operator to avoid modeling an expected
HTTP error.
