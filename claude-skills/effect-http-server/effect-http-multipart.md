---
name: effect-http-multipart
description: Multipart file uploads with effect http server
---

## Multipart Upload

```ts
import { HttpApiEndpoint, HttpApiSchema, Multipart } from "@effect/platform"
import { Schema } from "effect"

const upload = HttpApiEndpoint.post("upload", "/upload")
  .setPayload(HttpApiSchema.Multipart(
    Schema.Struct({ files: Multipart.FilesSchema })
  ))
  .addSuccess(Schema.String)
```
