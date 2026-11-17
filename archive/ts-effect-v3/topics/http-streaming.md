# HTTP Streaming

## What it is
Streaming request/response patterns for `HttpApi` endpoints.

## When to use
- Incremental responses (events/chunks)
- Binary stream uploads

## When not to use
- Small, bounded payloads better served as regular JSON

## Minimal examples
```ts
import { HttpApiBuilder, HttpApiEndpoint, HttpApiSchema, HttpServerResponse } from "@effect/platform"
import { Schema, Schedule, Stream } from "effect"

const streamEndpoint = HttpApiEndpoint.get("stream", "/stream")
  .addSuccess(Schema.String.pipe(
    HttpApiSchema.withEncoding({ kind: "Text", contentType: "application/octet-stream" })
  ))

const streamHandler = HttpApiBuilder.group(api, "group", (handlers) =>
  handlers.handle("stream", () =>
    HttpServerResponse.stream(
      Stream.make("a", "b", "c").pipe(
        Stream.schedule(Schedule.spaced("500 millis")),
        Stream.map((s) => new TextEncoder().encode(s))
      )
    )
  )
)

const acceptStream = HttpApiEndpoint.post("acceptStream", "/upload-stream")
  .setPayload(
    Schema.Uint8ArrayFromSelf.pipe(HttpApiSchema.withEncoding({
      kind: "Uint8Array",
      contentType: "application/octet-stream"
    }))
  )
```

## Common pitfalls
- Returning regular success payloads where `HttpServerResponse.stream` is required
- Forgetting payload encoding for binary streams

## See also
- `../sections/30-http-server.md`
- `http-multipart.md`
