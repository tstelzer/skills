## Serving Swagger UI

```ts
import { HttpApiSwagger } from "@effect/platform"

const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })), // default path is "/docs"
  Layer.provide(MyApiLive),
  // ...
)
```

## OpenAPI Annotations

### HttpApi

| Annotation                  | Description                                    |
|-----------------------------|------------------------------------------------|
| `HttpApi.AdditionalSchemas` | Add schemas to spec (needs `identifier`)       |
| `OpenApi.Description`       | API description                                |
| `OpenApi.License`           | `{ name, url }`                                |
| `OpenApi.Summary`           | Brief summary                                  |
| `OpenApi.Servers`           | Server URLs with optional variables            |
| `OpenApi.Override`          | Merge fields into spec                         |
| `OpenApi.Transform`         | `(spec) => spec` modifier                      |

### HttpApiGroup

| Annotation             | Description                          |
|------------------------|--------------------------------------|
| `OpenApi.Description`  | Group description                    |
| `OpenApi.ExternalDocs` | `{ url, description }`               |
| `OpenApi.Override`     | Merge fields into group spec         |
| `OpenApi.Transform`    | `(spec) => spec` modifier            |
| `OpenApi.Exclude`      | Exclude from spec if `true`          |

### HttpApiEndpoint

| Annotation             | Description                          |
|------------------------|--------------------------------------|
| `OpenApi.Description`  | Endpoint description                 |
| `OpenApi.Summary`      | Brief summary                        |
| `OpenApi.Deprecated`   | Mark deprecated if `true`            |
| `OpenApi.ExternalDocs` | `{ url, description }`               |
| `OpenApi.Override`     | Merge fields into endpoint spec      |
| `OpenApi.Transform`    | `(spec) => spec` modifier            |
| `OpenApi.Exclude`      | Exclude from spec if `true`          |

## Usage

```ts
import { HttpApi, HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"

const api = HttpApi.make("api")
  .annotate(OpenApi.Description, "My API")
  .annotate(OpenApi.License, { name: "MIT", url: "https://example.com" })
  .annotate(OpenApi.Servers, [{ url: "https://api.example.com" }])
  .annotate(HttpApi.AdditionalSchemas, [
    Schema.String.annotations({ identifier: "MyString" })
  ])
  .add(
    HttpApiGroup.make("users")
      .annotate(OpenApi.Description, "User operations")
      .add(
        HttpApiEndpoint.get("getUser", "/user")
          .addSuccess(Schema.String)
          .annotate(OpenApi.Summary, "Get a user")
          .annotate(OpenApi.Deprecated, true)
      )
  )

// Generate spec programmatically
const spec = OpenApi.fromApi(api)
```

## Response Description

```ts
// Override default "Success" description via schema annotation
HttpApiEndpoint.get("list", "/users")
  .addSuccess(Schema.Array(User).annotations({ description: "Array of users" }))
```

## Top-Level Groups

```ts
// Operation IDs won't have group prefix (e.g., "get" instead of "group.get")
HttpApiGroup.make("group", { topLevel: true })
```
