## Working with Streams

Effect Streams represent effectful, pull-based sequences of values over time.
They let you model finite or infinite data sources.

Use `effect/encoding` modules for streaming formats:

- `Csv`: rows, header records, and schema-backed cells through `Schema.toCodecStringTree`.
- `JsonArray`: elements from a root JSON array or one selected by JSON Pointer.
- `Xml`: XML events and selected element trees. Set `maxTokenSize`, `maxDepth`, and `maxElementSize` limits.
- `Tar` and `Zip`: archive entries and streamed bodies.

Keep archive bodies inside their stream and scope lifetimes. Inspect each
module's stability annotation before depending on its API.
