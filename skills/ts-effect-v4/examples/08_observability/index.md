## Observability

Effect has built-in support for structured logging, distributed tracing, and
metrics. For exporting telemetry, use the lightweight Otlp modules from
`effect/observability` in new projects, or use
`@effect/opentelemetry` NodeSdk when integrating with an existing OpenTelemetry
setup.

Use `OtlpProxy` to forward browser telemetry through the server while keeping
collector credentials there. Enable OTLP gzip with the `compression` option
or `OTEL_EXPORTER_OTLP_COMPRESSION` when the collector supports it.
