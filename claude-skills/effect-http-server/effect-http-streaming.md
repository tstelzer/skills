---
name: effect-http-streaming
description: Streaming requests and responses with effect http server
---

## Streaming

```ts
import { HttpApiEndpoint, HttpApiSchema, HttpServerResponse } from "@effect/platform"
import { Schema, Stream, Schedule } from "effect"

// Stream response
const streamEndpoint = HttpApiEndpoint.get("stream", "/stream")
  .addSuccess(Schema.String.pipe(
    HttpApiSchema.withEncoding({ kind: "Text", contentType: "application/octet-stream" })
  ))

// In handler: return HttpServerResponse.stream(...)
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

// Stream request (binary)
const acceptStream = HttpApiEndpoint.post("acceptStream", "/upload-stream")
  .setPayload(
    Schema.Uint8ArrayFromSelf.pipe(HttpApiSchema.withEncoding({
      kind: "Uint8Array",
      contentType: "application/octet-stream"
    }))
  )
```
