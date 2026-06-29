# HTTP Swagger / OpenAPI

## What it is
`HttpApiSwagger.layer` serves Swagger UI from your `HttpApi`; `OpenApi` annotations enrich generated spec metadata.

## When to use
- Publish OpenAPI docs for client integration
- Add summaries, descriptions, deprecation and external docs

## When not to use
- Internal-only APIs where spec generation is not needed

## Minimal examples
```ts
import { HttpApiSwagger } from "@effect/platform"

const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })), // default "/docs"
  Layer.provide(MyApiLive)
)
```

## Useful annotations

| Target | Annotation | Purpose |
|---|---|---|
| `HttpApi` | `OpenApi.Description`, `OpenApi.Summary` | API metadata |
| `HttpApi` | `OpenApi.Servers`, `OpenApi.License` | server/license metadata |
| `HttpApi` | `HttpApi.AdditionalSchemas` | include extra schemas |
| Group/Endpoint | `OpenApi.Description`, `OpenApi.ExternalDocs` | docs |
| Endpoint | `OpenApi.Deprecated` | deprecation flag |
| Group/Endpoint | `OpenApi.Override`, `OpenApi.Transform`, `OpenApi.Exclude` | patch/transform/exclude |

## Example usage

```ts
import { HttpApi, HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"

const api = HttpApi.make("api")
  .annotate(OpenApi.Description, "My API")
  .annotate(OpenApi.License, { name: "MIT", url: "https://example.com" })
  .annotate(OpenApi.Servers, [{ url: "https://api.example.com" }])
  .add(
    HttpApiGroup.make("users")
      .annotate(OpenApi.Description, "User operations")
      .add(
        HttpApiEndpoint.get("getUser", "/user")
          .addSuccess(Schema.String)
          .annotate(OpenApi.Summary, "Get a user")
      )
  )

const spec = OpenApi.fromApi(api)
```

## Common pitfalls
- Forgetting endpoint/group annotations for generated docs quality
- Not adding identifiers for additional schemas

## See also
- `../sections/30-http-server.md`
- `http-derive-client.md`
