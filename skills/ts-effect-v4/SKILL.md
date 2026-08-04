---
name: ts-effect-v4
description: Effect v4 handbook for effect@4 and effect/unstable/*. Use ts-effect-v3 for v3.
---

# Effect v4

## Routing

- Do not read this file linearly. Pick one target.
- Match the task to a folder below.
- For API lookup, open the file whose title fits.
- For implementation or review, read that folder's `index.md` and the relevant
  examples. The index contains behavioral rules that examples may not repeat.
- Within a folder, the lowest-numbered file is the lead example for that topic; higher numbers add variations.
- `fixtures/` folders hold supporting modules for an example, not standalone topics.
- Migrating existing v3 code? Go to [Migration](#migration) first.

## Identify the version

Use this skill when the code targets Effect v4:
- `effect@4` (or `4.0.0-beta.*`) in `package.json`, with `@effect/*` packages on the same version.
- Imports from `effect/unstable/*`
  (`http`, `httpapi`, `cli`, `sql`, `rpc`, `cluster`, `ai`, `observability`, `process`, ...).
- `Context.Service` for services, `Effect.fn(...)` for effectful functions, `Schema.TaggedErrorClass` for errors.

If it's `effect@3` / `@effect/platform@0.x` style, use `ts-effect-v3`.

## Examples

Paths are relative to this file.

- **`examples/01_effect/`**: core Effect: writing effects, Schema, services,
  errors, resources, running, and pubsub.
  - `01_basics/`: writing Effect code.
    - `01_effect-gen.ts`: using `Effect.gen`.
    - `02_effect-fn.ts`: using `Effect.fn`.
    - `10_creating-effects.ts`: creating effects from values, sync, Promises, nullables, callbacks.
  - `02_schema/`: runtime schemas and domain models.
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
    - `90_tooling-errors.ts`: error formatting, JSON Schema, generators, equivalence, optics, and patches.
  - `03_services/`: writing Effect services.
    - `01_service.ts`: `Context.Service`.
    - `10_reference.ts`: `Context.Reference` for config / defaults.
    - `20_layer-composition.ts`: composing services with the `Layer` module.
    - `20_layer-unwrap.ts`: building layers from config / effects with `Layer.unwrap`.
  - `04_errors/`: error handling.
    - `01_error-handling.ts`: custom errors, `Effect.catch` / `Effect.catchTag`.
    - `10_catch-tags.ts`: handle several tagged errors with `Effect.catchTags`.
    - `20_reason-errors.ts`: tagged `reason` fields, `catchReason` / `unwrapReason`.
  - `05_resources/`: resources and `Scope`s.
    - `10_acquire-release.ts`: `Effect.acquireRelease` lifecycles.
    - `20_layer-side-effects.ts`: background tasks via `Layer.effectDiscard`.
    - `30_layer-map.ts`: keyed dynamic resources with `LayerMap.Service`.
  - `06_running/`: running programs.
    - `10_run-main.ts`: `NodeRuntime` / `BunRuntime` entrypoints.
    - `20_layer-launch.ts`: long-running apps with `Layer.launch`.
  - `07_pubsub/`: broadcasting.
    - `10_pubsub.ts`: in-process event bus with `PubSub`.
- **`examples/03_stream/`**: Streams: effectful, pull-based sequences.
  - `10_creating-streams.ts`: streams from iterables, effects, pagination, async iterables, events, callbacks,
    Node readables.
  - `20_consuming-streams.ts`: transform and run streams (`map`, `flatMap`, `mapEffect`, `run*`).
  - `30_encoding.ts`: decode / encode with `Ndjson` & `Msgpack` channels.
- **`examples/04_integration/`**: bridging Effect into non-Effect code.
  - `10_managed-runtime.ts`: `ManagedRuntime` with Hono.
- **`examples/05_batching/`**: batching external requests.
  - `10_request-resolver.ts`: `Request.Class` + `RequestResolver`.
- **`examples/06_schedule/`**: retries, repeats, polling.
  - `10_schedules.ts`: build and compose `Schedule`s for `retry` / `repeat`.
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
- **`examples/50_http-client/`**: outgoing HTTP.
  - `10_basics.ts`: fetch external APIs with `HttpClient`.
- **`examples/51_http-server/`**: schema-first HTTP APIs.
  - `10_basics.ts`: define `HttpApi`, implement handlers, secure with middleware, serve, derive a typed client.
  - `fixtures/`: api / domain / server modules backing the example.
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

Each folder also has an `index.md` with the section intro.

## Final consistency audit

Before finishing an Effect implementation or review, inspect the complete
change for:

- Direct `node:*`, `process.*`, `Date.now()`, randomness, or global environment
  access that should use an Effect capability or explicit dependency.
- Hidden service inputs and platform layers provided inside implementations
  instead of at the runtime edge.
- Manual promise lifecycles, `try` / `finally`, or cleanup that should be
  scoped.
- `catch` handlers that only log, render, set metadata, or return `void`.
- Broad `mapError`, `unknown`, `instanceof`, `catchDefect`, or `orDie` usage
  that hides a narrower typed failure boundary.
- Cleanup behavior that accidentally suppresses a required failure or replaces
  the original result.
- Missing, empty, malformed, partial, and complete outcomes that callers need
  to distinguish.
- Normalization or disclosure of opaque or redacted values.
- Pure transformations coupled to Effect or output.
- One-use Effect wrappers, copied result types, or tests that protect
  implementation shape instead of public behavior.
- Repeated tests that should be table-driven and missing boundary, cleanup, or
  exact-value-preservation cases.

## Migration

Migrating v3 → v4. Start at **`migration/MIGRATION.md`**.
It covers versioning, package consolidation, and the `effect/unstable/*` system. It indexes:

- `migration/v3-to-v4.md`: import and API rename maps.
- `migration/services.md`: `Context.Tag` → `Context.Service`.
- `migration/cause.md`: flattened `Cause` structure.
- `migration/error-handling.md`: `catch*` renamings.
- `migration/forking.md`: renamed fork combinators and new options.
- `migration/yieldable.md`: Effect subtyping → Yieldable.
- `migration/generators.md`: `Effect.gen` passing `this`.
- `migration/fiber-keep-alive.md`: automatic process lifetime management.
- `migration/layer-memoization.md`: layer memoization across `Effect.provide`.
- `migration/fiberref.md`: `FiberRef` → `Context.Reference`.
- `migration/runtime.md`: `Runtime<R>` removed.
- `migration/scope.md`: `Scope` changes.
- `migration/equality.md`: equality changes.
- `migration/schema.md`: Schema v4 migration, including `Redacted`, template literal, and record behavior notes.
