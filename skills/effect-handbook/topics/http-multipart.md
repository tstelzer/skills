# HTTP Multipart

## What it is
`HttpApiSchema.Multipart(...)` defines multipart/form-data payload schemas for uploads.

## When to use
- File upload endpoints
- Mixed form fields + file payloads

## When not to use
- JSON-only payload endpoints

## Minimal examples
```ts
import { HttpApiEndpoint, HttpApiSchema, Multipart } from "@effect/platform"
import { Schema } from "effect"

const upload = HttpApiEndpoint.post("upload", "/upload")
  .setPayload(HttpApiSchema.Multipart(
    Schema.Struct({ files: Multipart.FilesSchema })
  ))
  .addSuccess(Schema.String)
```

## Common pitfalls
- Modeling file upload as plain JSON payload
- Missing payload schema validation for multipart fields

## See also
- `../sections/30-http-server.md`
- `http-streaming.md`
