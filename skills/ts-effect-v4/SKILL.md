---
name: ts-effect-v4
description: Effect v4 handbook for effect@4.1 and platform, SQL, AI, and testing packages. Use ts-effect-v3 for v3.
---

# Effect v4

## Reference snapshot

- Repository: `Effect-TS/effect`
- Release: `effect@4.1.0`
- Commit: `9a91b1926a5fbfaffd302a7a41a94d4d53a1154e`
- Package: `effect@4.1.0`

Use this release tag as the source for this handbook version. A branch name can move to another commit.
Read reference files with `git show effect@4.1.0:<path>` when the checkout is ahead of the release.

## Where to start

- Do not read this file in order. Pick one topic.
- Match the task to a topic folder containing `.ts` examples below.
- For API lookup, open the file whose title fits.
- For implementation or review, read that topic folder's `index.md` and relevant examples.
  The index states rules the examples may not repeat.
- In each topic folder, the lowest-numbered file is the main example. Higher numbers show variations.
- `fixtures/` folders hold modules used by examples. They are not separate topics.
- Migrating existing v3 code? Go to [Migration](#migration) first.

## Identify the version

Use this handbook for Effect 4.1:

- `effect@4.1` in `package.json`, with `@effect/*` packages on the same version.
- Imports from `effect/http`, `effect/http-api`, `effect/cli`, `effect/sql`, `effect/rpc`, or other grouped modules.
- `Context.Service` for services, `Effect.fn(...)` or `Effect.fnUntraced(...)` for effectful functions, and
  `Schema.TaggedError` for errors.

For `effect@3` / `@effect/platform@0.x`, use skill: ts-effect-v3.

## Release requirements

- Use TypeScript 5.9 or newer with `strict` enabled. TypeScript 7 is recommended.
- Use Node 22.19 or newer for Node applications.
- Use Vitest 5 with `@effect/vitest` and `@effect/doctest`. Doctest also requires Vite `>=8.1.5 <9`.
- `@effect/sql-sqlite-node` uses `node:sqlite`.
- `@effect/platform-deno` requires Deno 2.9.3 or newer. `@effect/atom-react` requires React 19.

## Imports and stability

- Import grouped modules from `effect/<area>` and individual modules from `effect/<area>/<Module>`.
- Use the published paths below. There are no `effect/unstable/*` compatibility exports.
- Use `effect/http-api` for HTTP API modules, `effect/Arbitrary` for native property testing, and
  `effect/encoding` for encoding formats. Primitive helpers live at `effect/encoding/Base64`,
  `effect/encoding/Base64Url`, `effect/encoding/Hex`, and `effect/encoding/EncodingError`.
- Read each module's and export's explicit stability annotation. `@stability stable` follows semver;
  `@stability unstable` allows breaking changes in minor releases and `@stability experimental` in patch releases.
- Treat packages outside `effect`, including platform, SQL drivers, AI providers, and Vitest, as unstable.

## Examples

Paths are relative to this file.

- **`examples/01_effect/`**: core Effect topics. Choose a subfolder:
  - [01_basics/](./examples/01_effect/01_basics/index.md): writing Effect code.
    - `01_effect-gen.ts`: using `Effect.gen`.
    - `02_effect-fn.ts`: using `Effect.fn` and `Effect.fnUntraced`.
    - `10_creating-effects.ts`: creating effects from values, sync, Promises, nullables, callbacks.
  - [02_schema/](./examples/01_effect/02_schema/index.md): runtime schemas and domain models.
    - `10_schema-basics.ts`: decoded and encoded types, decoding, encoding, and boundary errors.
    - `20_primitives-composition.ts`: primitives, structs, collections, records, and template literals.
    - `25_deriving-schemas.ts`: deriving structs, tuples, and unions without copying definitions.
    - `30_optional-defaults.ts`: optional fields, `Option`, decoding defaults, and constructor defaults.
    - `40_unions-recursion.ts`: tagged unions, matching, and recursive schemas.
    - `50_validation-constructors.ts`: filters, refinements, brands, effectful validation, and constructors.
    - `60_transformations-codecs.ts`: transformations, codecs, key remapping, and flipping.
    - `65_context-middleware.ts`: decode and encode requirements, middleware, and deliberate fallbacks.
    - `70_classes-errors.ts`: opaque types, classes, tagged models, and schema-backed errors.
    - `80_serialization-sensitive.ts`: serialization, external formats, and redacted values.
    - `90_tooling-errors.ts`: error formatting, JSON Schema, native arbitrary generation, equivalence, optics, and
      patches.
  - [03_services/](./examples/01_effect/03_services/index.md): services, config, platform, and crypto dependencies.
    - `01_service.ts`: `Context.Service`.
    - `10_reference.ts`: `Context.Reference` for config / defaults.
    - `20_layer-composition.ts`: composing services with the `Layer` module.
    - `20_layer-unwrap.ts`: building layers from config / effects with `Layer.unwrap`.
  - [04_errors/](./examples/01_effect/04_errors/index.md): error handling.
    - `01_error-handling.ts`: custom errors, `Effect.catch` / `Effect.catchTag`.
    - `10_catch-tags.ts`: handle several tagged errors with `Effect.catchTags`.
    - `20_reason-errors.ts`: tagged `reason` fields, `catchReason` / `unwrapReason`.
  - [05_resources/](./examples/01_effect/05_resources/index.md): resources and `Scope`s.
    - `10_acquire-release.ts`: `Effect.acquireRelease` lifecycles.
    - `20_layer-side-effects.ts`: background tasks via `Layer.effectDiscard`.
    - `30_layer-map.ts`: keyed dynamic resources with `LayerMap.Service`.
  - [06_running/](./examples/01_effect/06_running/index.md): running programs.
    - `10_run-main.ts`: `NodeRuntime` / `BunRuntime` entrypoints.
    - `20_layer-launch.ts`: long-running apps with `Layer.launch`.
  - [07_pubsub/](./examples/01_effect/07_pubsub/index.md): broadcasting.
    - `10_pubsub.ts`: in-process event bus with `PubSub`.
- **`examples/03_stream/`**: Streams: effectful, pull-based sequences.
  - `10_creating-streams.ts`: streams from iterables, effects, pagination, async iterables, events, callbacks,
    Node readables.
  - `20_consuming-streams.ts`: transform and run streams (`map`, `flatMap`, `mapEffect`, `run*`).
  - `30_encoding.ts`: decode / encode with `Ndjson` and `SchemaBinary` channels.
    See [stream guidance](./examples/03_stream/index.md) for CSV, JSON arrays, XML, and archives.
- **`examples/04_integration/`**: bridging Effect into non-Effect code.
  - `10_managed-runtime.ts`: `ManagedRuntime` with Hono.
- **`examples/05_batching/`**: batching external requests.
  - `10_request-resolver.ts`: `Request.Class` + `RequestResolver`.
- **`examples/06_schedule/`**: retries, repeats, polling.
  - `10_schedules.ts`: build and compose `Schedule`s for `retry` / `repeat`.
    See [schedule guidance](./examples/06_schedule/index.md) for cron overlap policies.
- **`examples/07_datetime/`**: `DateTime` parsing, formatting, calendar math, and time zones.
  - `10_creating-and-formatting.ts`: parse inputs, use Clock-backed current time, format ISO values.
  - `20_time-zones.ts`: attach IANA zones, use `CurrentTimeZone`, and build zoned date values.
- **`examples/08_observability/`**: logging, tracing, metrics.
  - `10_logging.ts`: configure loggers and log-level filtering.
  - `20_otlp-tracing.ts`: Otlp tracing + log export layer.
- **`examples/09_testing/`**: testing with `@effect/vitest`.
  - `10_effect-tests.ts`: `it.effect` tests.
  - `20_layer-tests.ts`: testing services with shared layers.
- **`examples/10_predicate/`**: runtime type guards.
  - `01_basics.ts`: use and compose built-in `Predicate` guards.
- **`examples/40_sql/`**: SQL models, repositories, migrations, and driver layers.
  - `10_basics.ts`: build a schema-backed SQLite repository with `Model`, `SqlModel`, and `SqlSchema`.
- **`examples/50_http-client/`**: outgoing HTTP.
  - `10_basics.ts`: fetch external APIs with `HttpClient` and preserve HTTP, missing, body, and schema failures.
- **`examples/51_http-server/`**: schema-first HTTP APIs.
  - `10_basics.ts`: define `HttpApi`, implement handlers, secure with middleware, serve, derive a typed client.
  - `20_testing.ts`: test handlers through an in-memory typed client with `HttpApiTest`.
  - `fixtures/`: api / domain / server modules backing the example.
- **`examples/52_graphql/`**: experimental GraphQL clients.
  Start with the [topic index](./examples/52_graphql/index.md).
  - `10_basics.ts`: generated operations, HTTP transport, and cursor pagination.
  - `20_testing.ts`: replace client operations with typed test handlers.
  - `30_batching.ts`: batch entity lookups with `GraphQLResolver`.
  - `40_aliased-batching.ts`: batch lookups through aliased fields.
  - `50_errors-and-retries.ts`: errors, rate limits, and retry policies.
- **`examples/60_child-process/`**: child processes.
  - `10_working-with-child-processes.ts`: collect output, compose pipelines, stream long-running commands.
- **`examples/70_cli/`**: CLI applications.
  - `10_basics.ts`: typed args / flags and subcommand handlers.
- **`examples/71_ai/`**: provider-agnostic AI modules.
  - `10_language-model.ts`: `LanguageModel` for text, schema objects, and streaming.
  - `20_tools.ts`: define tools and toolkits, implement handlers.
  - `30_chat.ts`: stateful chat sessions with history.
  - `fixtures/`: supporting domain module.
- **`examples/80_cluster/`**: distributed applications.
  - `10_entities.ts`: define entity RPCs and run them in a cluster.

## Final consistency audit

Before finishing an Effect implementation or review, check the whole change for:

- Direct `node:*`, `process.*`, `Date.now()`, randomness, or global environment
  access that should use an Effect capability or explicit dependency.
- Hidden service inputs or platform layers supplied inside implementations instead of where the program starts.
- Promises managed by hand, `try` / `finally`, or cleanup that should use a scope.
- `catch` handlers that only log, render, set metadata, or return `void`.
- Broad `mapError`, `unknown`, `instanceof`, `catchDefect`, or `orDie` usage
  that hides a more specific error type at the boundary.
- Cleanup that hides a failure that must be reported or replaces the original result.
- Missing, empty, malformed, partial, and complete outcomes that callers need
  to distinguish.
- Normalizing or exposing opaque or redacted values.
- Pure transformations that depend on Effect or output.
- One-use Effect wrappers, copied result types, or tests that check code structure instead of public behavior.
- Repeated tests that should use tables, and missing tests for boundaries, cleanup,
  or keeping values exactly as received.

## Migration

Migrating v3 → v4. Start at **`migration/MIGRATION.md`**.
It explains versions, merged packages, release import paths, and API stability. It links to:

- `migration/v3-to-v4.md`: import and API rename maps.
- `migration/services.md`: `Context.Tag` → `Context.Service`.
- `migration/cause.md`: flattened `Cause` structure.
- `migration/error-handling.md`: `catch*` renamings.
- `migration/forking.md`: renamed fork combinators and new options.
- `migration/yieldable.md`: explicit conversions for values that no longer implement Effect.
- `migration/generators.md`: `Effect.gen` passing `this`.
- `migration/fiber-keep-alive.md`: automatic process lifetime management.
- `migration/layer-memoization.md`: layer memoization across `Effect.provide`.
- `migration/fiberref.md`: `FiberRef` → `Context.Reference`.
- `migration/runtime.md`: `Runtime<R>` removed.
- `migration/scope.md`: `Scope` changes.
- `migration/equality.md`: equality changes.
- `migration/schema.md`: Schema v4 migration, including `Redacted`, template literal, and record behavior notes.
