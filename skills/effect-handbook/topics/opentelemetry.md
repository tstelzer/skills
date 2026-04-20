# OpenTelemetry

## What it is
`@effect/opentelemetry` bridges Effect logging, metrics, and tracing into OpenTelemetry SDKs and OTLP exporters. Use `NodeSdk.layer(...)` for custom SDK wiring or `Otlp.layerJson(...)` for a quick OTLP setup.

## When to use
- Export spans, metrics, and logs to OTEL collectors
- Standardize production observability across Effect services
- Keep tracing/logging integrated with Effect runtime context

## When not to use
- Local-only debugging where plain `Effect.log` is enough
- Projects with no telemetry backend or no cross-service observability needs

## Minimal examples
```ts
import * as Otlp from "@effect/opentelemetry/Otlp"
import * as FetchHttpClient from "@effect/platform/FetchHttpClient"
import { Effect, Layer, Schedule } from "effect"
import * as Logger from "effect/Logger"
import * as LogLevel from "effect/LogLevel"

const Observability = Otlp.layerJson({
  baseUrl: "http://localhost:4318",
  resource: {
    serviceName: "my-service"
  }
}).pipe(Layer.provide(FetchHttpClient.layer))

const program = Effect.log("Hello").pipe(
  Effect.withSpan("a"),
  Effect.schedule(Schedule.spaced(1000)),
  Effect.annotateSpans("working", true)
)

program.pipe(
  Effect.provide(Observability),
  Logger.withMinimumLogLevel(LogLevel.All),
  Effect.runFork
)
```

## Common pitfalls
- Adding spans and metrics without providing an exporter / SDK layer
- Logging outside Effect and losing runtime trace context
- Treating `@effect/opentelemetry` as a replacement for `Logger` / `Metric`; it is the export bridge

## See also
- `observability.md`
- `../sections/00-foundations.md`
