## Building HttpApi servers

`HttpApi` gives you schema-first, type-safe HTTP APIs with runtime validation,
typed clients, and OpenAPI docs from one definition.

Keep absent, empty, malformed, partial, and complete request states distinct
when they produce different domain or protocol outcomes. Parse once at the
boundary and pass decoded domain values inward.

Use `Effect.die` or `Effect.orDie` only when the protocol contract declares a
failure impossible. Do not use either operator to avoid modeling an expected
HTTP error.

Each `HttpRouter.serve`, `toWebHandler`, or `toHttpEffect` entrypoint owns a fresh
router and a forked layer memo map. Pass route and protocol layers into the
entrypoint. Routes registered on a separately provided `HttpRouter.layer` are
not served.

Provide stateful services outside the entrypoint when they must be shared with
sibling layers. Layers first built inside an entrypoint are private to it.

Use `HttpApi` annotations to set parse options per slot: `ParamsParseOptions`,
`QueryParseOptions`, `HeadersParseOptions`, `PayloadParseOptions`,
`SuccessParseOptions`, and `ErrorParseOptions`. Each falls back to `ParseOptions`.
Set `HeadersParseOptions` to `{}` when strict body parsing must still accept
transport headers.
