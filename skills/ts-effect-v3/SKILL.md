---
name: ts-effect-v3
description: >-
  Canonical handbook for Effect v3 in TypeScript. Use for effect@3 and
  @effect/platform@0.x packages. Use ts-effect-v4 for effect@4.
---

# Effect v3

## Purpose
Use this as the source of truth for Effect v3 guidance. The examples target
`effect@3.22.1`. Check the project's installed minor version before using an
API added late in v3.

## Routing Rules
- Do not read this handbook linearly.
- Pick one target file below.
- Follow `See also` only if that file is insufficient.
- For Schema work, read `topics/schema.md`, then the one specialized Schema
  file that matches the task.
- For implementation or review, finish with the
  [final consistency audit](#final-consistency-audit).

## Quick Picks (Task -> File)
- Work with Schema -> `topics/schema.md`, then its task-specific route
- Handle `Option` / `Either` control flow -> `topics/option-either.md`
- Batch or cache data fetches with requests -> `topics/request-resolver.md`
- Build a CLI command -> `sections/20-cli.md`
- Configure CLI options/flags -> `topics/cli-options.md`
- Configure CLI positional args -> `topics/cli-args.md`
- Build interactive CLI prompts -> `topics/cli-prompt.md`
- Define HTTP endpoint + handler -> `sections/30-http-server.md`
- Build route-first HTTP app -> `topics/http-router.md`
- Derive typed HTTP client -> `topics/http-derive-client.md`
- Call external HTTP APIs -> `topics/http-client.md`
- Add Swagger/OpenAPI docs -> `topics/http-swagger.md`
- Handle multipart upload -> `topics/http-multipart.md`
- Implement streaming HTTP endpoint -> `topics/http-streaming.md`
- Use FileSystem/Path/Url/Terminal/KeyValueStore/Ndjson/Worker -> `sections/40-platform.md`
- Configure a child process environment -> `sections/40-platform.md`
- NDJSON encode/decode streams -> `topics/platform-ndjson.md`
- Worker/WorkerRunner setup -> `topics/platform-worker.md`
- Run Stream into platform sink -> `topics/platform-stream-sink.md`
- Add typed RPC client/server -> `topics/rpc.md`
- Export telemetry with OpenTelemetry -> `topics/opentelemetry.md`
- Run SQL queries / transactions / streams -> `topics/sql-client.md`
- Configure SQL database drivers -> `topics/sql-drivers.md`
- Build schema-backed SQL resolvers -> `topics/sql-resolver-schema.md`
- Run SQL migrations -> `topics/sql-migrations.md`
- Write Effect tests -> `sections/50-testing.md`
- Use @effect/vitest modes -> `topics/testing-vitest.md`
- Retry/repeat policy -> `topics/schedule-retry.md`
- Stream processing -> `topics/stream.md`
- Context/Layer wiring -> `topics/layer-context.md`
- Queue producer-consumer -> `topics/queue.md`
- HTTP middleware/auth -> `topics/http-middleware.md`
- Config/env vars -> `topics/config.md`
- Build or traverse a graph -> `topics/graph.md`

## By Domain
- Core (Effect, Schema, Option/Either, requests) ->
  `sections/00-foundations.md`, `sections/10-core-patterns.md`,
  `topics/schema.md`, `topics/option-either.md`, `topics/request-resolver.md`
- CLI (Command, Options, Args, Prompt) -> `sections/20-cli.md`
- HTTP (HttpApi, HttpApiBuilder, HttpRouter, HttpClient) ->
  `sections/30-http-server.md`, `topics/http-router.md`,
  `topics/http-client.md`
- SQL (`@effect/sql`, drivers, resolvers, migrations) ->
  `topics/sql-client.md`, `topics/sql-drivers.md`,
  `topics/sql-resolver-schema.md`, `topics/sql-migrations.md`
- Platform (FileSystem, Path, Url, Terminal, KeyValueStore, Ndjson, workers) -> `sections/40-platform.md`
- Distributed / observability (`@effect/rpc`, OpenTelemetry exporters) -> `topics/rpc.md`, `topics/opentelemetry.md`
- Testing (it.effect, it.live, it.scoped, TestClock) -> `sections/50-testing.md`

## By Primitive
- `Schema` / `Schema.Class` / `Schema.TaggedError` -> `topics/schema.md`
- `Option` / `Either` -> `topics/option-either.md`
- `Ref`/`SynchronizedRef`/`FiberRef` -> `topics/refs.md`
- `Cause`/`Exit` -> `topics/cause-exit.md`
- `STM` -> `topics/stm.md`
- `Scope`/resource safety -> `topics/scope-resource.md`
- `Deferred` -> `topics/deferred.md`
- `Semaphore` -> `topics/semaphore.md`
- `Cache` -> `topics/cache.md`
- `Match` -> `topics/match.md`
- `Logger`/`Metric`/tracing -> `topics/observability.md`
- `Request` / `RequestResolver` -> `topics/request-resolver.md`
- Concurrency/fibers/racing -> `topics/concurrency.md`
- Latch -> `topics/latch.md`
- `Stream` (async iterables, pagination) -> `topics/stream.md`
- `Schedule` (retry, repeat, backoff) -> `topics/schedule-retry.md`
- `Layer`/`Context` (dependency injection) -> `topics/layer-context.md`
- `Queue` (producer-consumer, back-pressure) -> `topics/queue.md`
- `PubSub` (broadcast to subscribers) -> `topics/pubsub.md`
- `HttpApiMiddleware` (auth, logging) -> `topics/http-middleware.md`
- `HttpClient` / `HttpClientRequest` -> `topics/http-client.md`
- `HttpRouter` / `HttpServer` -> `topics/http-router.md`
- `HttpApiClient` derivation -> `topics/http-derive-client.md`
- OpenAPI/Swagger -> `topics/http-swagger.md`
- Multipart -> `topics/http-multipart.md`
- HTTP streaming -> `topics/http-streaming.md`
- NDJSON -> `topics/platform-ndjson.md`
- Worker/WorkerRunner -> `topics/platform-worker.md`
- Stream + Sink integration -> `topics/platform-stream-sink.md`
- `RpcGroup` / `RpcServer` / `RpcClient` -> `topics/rpc.md`
- `NodeSdk` / `Otlp` -> `topics/opentelemetry.md`
- `SqlClient` / SQL fragments / transactions / streams -> `topics/sql-client.md`
- SQL driver layers (`PgClient`, `MysqlClient`, `SqliteClient`, etc.) -> `topics/sql-drivers.md`
- `SqlResolver` / `SqlSchema` -> `topics/sql-resolver-schema.md`
- SQL migrators (`PgMigrator`, `SqliteMigrator`, etc.) -> `topics/sql-migrations.md`
- Vitest integration -> `topics/testing-vitest.md`
- `Config` (env, typed config) -> `topics/config.md`
- `Graph` -> `topics/graph.md`

## Section Index
- `sections/00-foundations.md`: Effect type, creation, composition, run boundaries
- `sections/10-core-patterns.md`: Layers, retries, refs, concurrency, streams
- `sections/20-cli.md`: Command, Options, Args, Prompt, subcommands
- `sections/30-http-server.md`: HttpApi, HttpApiEndpoint, HttpApiBuilder
- `sections/40-platform.md`: platform services, commands, clients, servers, workers
- `sections/50-testing.md`: it.effect, it.live, it.scoped, TestClock

## Topic Index
- `topics/schema.md`: Schema routing and boundary rules
- `topics/schema-basics.md`: decoded and encoded types, decoding, encoding
- `topics/schema-primitives.md`: primitives and composite schemas
- `topics/schema-deriving.md`: pick, omit, partial, extend, rename
- `topics/schema-optional-defaults.md`: optional fields, `Option`, defaults
- `topics/schema-unions-recursion.md`: unions, discriminators, recursion
- `topics/schema-validation.md`: filters, brands, effectful checks, constructors
- `topics/schema-transformations.md`: transformations and composition
- `topics/schema-context.md`: service-backed parsing and requirements
- `topics/schema-classes-errors.md`: classes, tagged models, errors
- `topics/schema-serialization.md`: JSON, bytes, and redacted values
- `topics/schema-tooling-errors.md`: errors, metadata, generated tooling
- `topics/option-either.md`: Option/Either control flow and pure errors
- `topics/refs.md`: Ref, SynchronizedRef, FiberRef
- `topics/cause-exit.md`: Cause, Exit, failure inspection
- `topics/stm.md`: STM transactions, TRef
- `topics/scope-resource.md`: Scope and resource safety
- `topics/deferred.md`: Deferred, one-shot signaling
- `topics/semaphore.md`: Semaphore and bounded concurrency
- `topics/cache.md`: Cache, TTL, lookup
- `topics/match.md`: exhaustive pattern matching
- `topics/graph.md`: graph construction and traversal
- `topics/observability.md`: Logger, Metric, tracing
- `topics/request-resolver.md`: request batching, dedupe, caching
- `topics/concurrency.md`: concurrency, fibers, racing, interruption
- `topics/latch.md`: latch gating and release
- `topics/stream.md`: stream creation, transformation, consumption
- `topics/schedule-retry.md`: retry and repeat schedules
- `topics/layer-context.md`: Context.Tag, Layer, dependency composition
- `topics/queue.md`: queues and back-pressure
- `topics/pubsub.md`: broadcast to subscribers
- `topics/http-middleware.md`: HttpApi middleware
- `topics/http-client.md`: outgoing HTTP
- `topics/http-router.md`: route-first HTTP servers
- `topics/http-derive-client.md`: typed clients from HttpApi
- `topics/http-swagger.md`: Swagger and OpenAPI
- `topics/http-multipart.md`: multipart payloads
- `topics/http-streaming.md`: streaming requests and responses
- `topics/platform-ndjson.md`: NDJSON channels
- `topics/platform-worker.md`: worker pools and WorkerRunner
- `topics/platform-stream-sink.md`: Stream to Sink integration
- `topics/rpc.md`: typed RPC clients and servers
- `topics/opentelemetry.md`: OpenTelemetry exporters
- `topics/sql-client.md`: SQL queries, fragments, transactions, streams
- `topics/sql-drivers.md`: SQL driver layers
- `topics/sql-resolver-schema.md`: SQL resolvers and schema queries
- `topics/sql-migrations.md`: SQL migrators
- `topics/cli-options.md`: option constructors and combinators
- `topics/cli-args.md`: argument constructors and combinators
- `topics/cli-prompt.md`: interactive prompts
- `topics/testing-vitest.md`: Effect-aware Vitest modes
- `topics/config.md`: typed configuration

## Conventions
- Section and topic paths are relative to this file.
- Follow `See also` only when the selected file does not answer the task.

## Final consistency audit

Before finishing an Effect implementation or review, inspect the complete
change for:

- Direct `node:*`, `process.*`, current time, randomness, or global environment
  access that should use an Effect service or explicit dependency.
- Native APIs used for required semantics that Effect does not expose. Keep
  them at the platform edge and state the reason.
- Hidden service inputs and platform layers provided inside implementations
  instead of at the runtime edge.
- Manual promise lifecycles, `try` / `finally`, or cleanup that should be scoped.
- `catch` handlers that only log, render, set metadata, or return `void`.
- Broad `mapError`, `unknown`, `instanceof`, `catchDefect`, or `orDie` usage
  that hides a narrower typed failure boundary.
- Cleanup that suppresses a required failure or replaces the original result.
- Missing, empty, malformed, partial, and complete outcomes that callers need
  to distinguish.
- Normalization or disclosure of opaque and redacted values.
- Pure transformations coupled to Effect or output.
- One-use Effect wrappers, copied result types, or tests of implementation
  shape instead of public behavior.
- Repeated tests that should use `it.effect.each`, and missing boundary,
  cleanup, or exact-value-preservation cases.

## When to Use This Handbook
- Implementing Effect-based services, CLIs, HTTP APIs, or tests
- Looking up primitives (Schema, Option, Either, Stream, Schedule, Queue, Layer, Config)
- Building outgoing HTTP clients or route-first HTTP apps
- Using request batching / caching or typed RPCs
- Running SQL queries, transactions, migrations, or database-backed resolvers
- Resolving common pitfalls (run boundaries, retry layers, auth middleware)
- Choosing between similar primitives (Queue vs PubSub, Ref vs STM)
- Debugging Effect execution (run boundaries, fiber interruption, scoped resources)

## Package References
- `effect`: core runtime
- `@effect/cli`: Command, Options, Args, Prompt
- `@effect/platform`: HttpApi, HttpClient, HttpRouter, platform services
- `@effect/platform-node`: NodeContext, NodeHttpServer, NodeRuntime
- `@effect/rpc`: typed RPC groups, protocols, middleware
- `@effect/opentelemetry`: OTEL SDK and OTLP exporters
- `@effect/vitest`: it.effect, it.live, it.scoped
- `@effect/sql`: shared client, statements, schemas, resolvers, migrations
- `@effect/sql-pg`: PostgreSQL driver
- `@effect/sql-mysql2`: MySQL driver
- `@effect/sql-mssql`: Microsoft SQL Server driver
- `@effect/sql-clickhouse`: ClickHouse driver
- `@effect/sql-libsql`: libSQL driver
- `@effect/sql-d1`: Cloudflare D1 driver
- SQLite drivers: `@effect/sql-sqlite-node`, `@effect/sql-sqlite-bun`,
  `@effect/sql-sqlite-wasm`, `@effect/sql-sqlite-react-native`,
  `@effect/sql-sqlite-do`
- SQL adapters: `@effect/sql-drizzle`, `@effect/sql-kysely`

## Specialized Packages Not Yet Routed In Detail
- `@effect/cluster`
- `@effect/workflow`
- `@effect/experimental`

If one of these appears in a task, consult the reference repository first.
This handbook does not have dedicated topic files for them.
