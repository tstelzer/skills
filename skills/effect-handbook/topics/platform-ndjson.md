# Platform NDJSON

## What it is
`Ndjson` encodes/decodes newline-delimited JSON for channels and streams.

## When to use
- Streaming JSON records over sockets/files/process boundaries
- Incremental decode without loading full payload

## When not to use
- Single JSON payload request/response bodies

## Minimal examples
```ts
import { Ndjson } from "@effect/platform"
import { Stream } from "effect"

const encoder = new TextEncoder()

const parsed = Stream.succeed(
  encoder.encode("{\"id\":1}\n{\"id\":2}\n")
).pipe(
  Stream.pipeThroughChannel(Ndjson.unpack({ ignoreEmptyLines: true })),
  Stream.runCollect
)
```

## Common builders
- `Ndjson.pack()` / `packString()`
- `Ndjson.unpack()` / `unpackString()`
- `Ndjson.packSchema(schema)` / `unpackSchema(schema)`
- `Ndjson.duplex()` for NDJSON channel protocols

## Common pitfalls
- Forgetting newline delimiters when producing NDJSON
- Mixing typed schema variant and untyped variant inconsistently

## See also
- `../sections/40-platform.md`
- `platform-stream-sink.md`
