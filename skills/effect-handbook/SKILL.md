---
name: effect-handbook
description: Canonical handbook for Effect ecosystem usage in TypeScript. Always use when interacting with Effect code.
---

# Effect Handbook

## Purpose
Use this as the single source of truth for Effect-related guidance in this repository. Sections are index buckets, not a reading order.

## Routing Rules
- Do not read this handbook linearly.
- Pick one target file below.
- Follow `See also` only if that file is insufficient.
- Read exactly one: pick one target file first; only follow `See also` if needed.
- Top-level routing: intent → exact file path; sections are index buckets, not reading order.

## Quick Picks (Task -> File)
- Work with `Schema.Class` / `TaggedError` / decode / encode -> `topics/schema.md`
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
- NDJSON encode/decode streams -> `topics/platform-ndjson.md`
- Worker/WorkerRunner setup -> `topics/platform-worker.md`
- Run Stream into platform sink -> `topics/platform-stream-sink.md`
- Add typed RPC client/server -> `topics/rpc.md`
- Export telemetry with OpenTelemetry -> `topics/opentelemetry.md`
- Write Effect tests -> `sections/50-testing.md`
- Use @effect/vitest modes -> `topics/testing-vitest.md`
- Retry/repeat policy -> `topics/schedule-retry.md`
- Stream processing -> `topics/stream.md`
- Context/Layer wiring -> `topics/layer-context.md`
- Queue producer-consumer -> `topics/queue.md`
- HTTP middleware/auth -> `topics/http-middleware.md`
- Config/env vars -> `topics/config.md`

## By Domain
- Core (Effect type, composition, execution, Schema, Option/Either, requests) -> `sections/00-foundations.md`, `sections/10-core-patterns.md`, `topics/schema.md`, `topics/option-either.md`, `topics/request-resolver.md`
- CLI (Command, Options, Args, Prompt) -> `sections/20-cli.md`
- HTTP (HttpApi, HttpApiBuilder, HttpRouter, HttpClient) -> `sections/30-http-server.md`, `topics/http-router.md`, `topics/http-client.md`
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
- Vitest integration -> `topics/testing-vitest.md`
- `Config` (env, typed config) -> `topics/config.md`

## Section Index
- `sections/00-foundations.md` — Effect type, creation, composition, run boundaries
- `sections/10-core-patterns.md` — Layers, retries, refs, schema-adjacent patterns, concurrency, streams
- `sections/20-cli.md` — Command, Options, Args, Prompt, subcommands
- `sections/30-http-server.md` — HttpApi, HttpApiEndpoint, HttpApiBuilder
- `sections/40-platform.md` — HttpClient, HttpRouter, FileSystem, Path, Url, Terminal, KeyValueStore, Ndjson, workers
- `sections/50-testing.md` — it.effect, it.live, it.scoped, TestClock

## Topic Index
- `topics/schema.md` — Schema models, classes, tagged errors, decode/encode
- `topics/option-either.md` — Option/Either control flow and pure error channels
- `topics/refs.md` — Ref, SynchronizedRef, FiberRef
- `topics/cause-exit.md` — Cause, Exit, failure inspection
- `topics/stm.md` — STM transactions, TRef
- `topics/scope-resource.md` — Scope, acquireUseRelease, resource safety
- `topics/deferred.md` — Deferred, one-shot signaling
- `topics/semaphore.md` — Semaphore, bounded concurrency
- `topics/cache.md` — Cache, TTL, lookup
- `topics/match.md` — Match, exhaustive pattern matching
- `topics/observability.md` — Logger, Metric, tracing
- `topics/request-resolver.md` — Request batching, dedupe, caching, `Effect.request`
- `topics/concurrency.md` — Concurrency settings, fibers, racing, interruption
- `topics/latch.md` — Latch gating and one-way release patterns
- `topics/stream.md` — Stream creation, consumption, transformations, combining
- `topics/schedule-retry.md` — Retry/repeat with exponential, jittered, custom schedules
- `topics/layer-context.md` — Context.Tag, Layer, dependency composition
- `topics/queue.md` — Bounded/unbounded queues, offer/take, back-pressure
- `topics/pubsub.md` — Broadcast to multiple subscribers, subscribe/publish
- `topics/http-middleware.md` — HttpApiMiddleware.Tag, security, provides
- `topics/http-client.md` — Outgoing HTTP clients, request/response helpers
- `topics/http-router.md` — Route-first apps with HttpRouter/HttpServer
- `topics/http-derive-client.md` — Typed client derivation from HttpApi
- `topics/http-swagger.md` — Swagger/OpenAPI docs and annotations
- `topics/http-multipart.md` — Multipart upload schemas
- `topics/http-streaming.md` — Streaming requests and responses
- `topics/platform-ndjson.md` — NDJSON pack/unpack and schema channels
- `topics/platform-worker.md` — Worker pools and WorkerRunner
- `topics/platform-stream-sink.md` — Stream to sink/file integration
- `topics/rpc.md` — Typed RPC groups, protocols, client/server layers
- `topics/opentelemetry.md` — OpenTelemetry exporters and SDK layers
- `topics/cli-options.md` — Full options constructors and combinators
- `topics/cli-args.md` — Full args constructors and combinators
- `topics/cli-prompt.md` — Interactive prompts and composition
- `topics/testing-vitest.md` — `it.effect`, `it.live`, `it.scoped`, `TestClock`
- `topics/config.md` — Config.string/integer, env fallback, nested config

## Conventions
- Section files: What it is | When to use | When not to use | Minimal examples | Common pitfalls | See also
- Topic files: same structure, compact (~60–120 lines)
- Paths are relative to this SKILL.md; sections and topics use relative `../` for cross-links

## When to Use This Handbook
- Implementing Effect-based services, CLIs, HTTP APIs, or tests
- Looking up primitives (Schema, Option, Either, Stream, Schedule, Queue, Layer, Config)
- Building outgoing HTTP clients or route-first HTTP apps
- Using request batching / caching or typed RPCs
- Resolving common pitfalls (run boundaries, retry layers, auth middleware)
- Choosing between similar primitives (Queue vs PubSub, Ref vs STM)
- Debugging Effect execution (run boundaries, fiber interruption, scoped resources)

## Package References
- `effect` — core runtime
- `@effect/cli` — Command, Options, Args, Prompt
- `@effect/platform` — HttpApi, HttpClient, HttpRouter, FileSystem, Path, Url
- `@effect/platform-node` — NodeContext, NodeHttpServer, NodeRuntime
- `@effect/rpc` — typed RPC groups, protocols, middleware
- `@effect/opentelemetry` — OTEL SDK and OTLP exporters
- `@effect/vitest` — it.effect, it.live, it.scoped

## Specialized Packages Not Yet Routed In Detail
- `@effect/cluster`
- `@effect/workflow`
- `@effect/sql` and driver packages
- `@effect/experimental`

If one of these appears in a task, consult the reference repo README/examples first; this handbook does not yet have dedicated topic files for them.
