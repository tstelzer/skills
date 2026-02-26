# HTTP Server

## What it is
`HttpApi` + `HttpApiBuilder` for schema-first endpoint design, typed handlers, generated clients, and middleware composition.

## Structure

```text
HttpApi
├── HttpApiGroup
│   ├── HttpApiEndpoint
│   └── HttpApiEndpoint
```

## Defining endpoints

```ts
import { HttpApiEndpoint, HttpApiError, HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

const User = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  createdAt: Schema.DateTimeUtc
})

const idParam = HttpApiSchema.param("id", Schema.NumberFromString)

const getUser = HttpApiEndpoint.get("getUser")`/users/${idParam}`
  .addSuccess(User)
  .addError(HttpApiError.NotFound)

const createUser = HttpApiEndpoint.post("createUser", "/users")
  .setPayload(Schema.Struct({ name: Schema.String }))
  .addSuccess(User, { status: 201 })
```

## Grouping + implementation

```ts
import { HttpApi, HttpApiBuilder, HttpApiGroup } from "@effect/platform"
import { Effect, Layer } from "effect"

const usersGroup = HttpApiGroup.make("users").add(getUser).add(createUser)
const api = HttpApi.make("myApi").add(usersGroup).prefix("/api/v1")

const usersGroupLive = HttpApiBuilder.group(api, "users", (handlers) =>
  handlers.handle("getUser", ({ path: { id } }) => Effect.succeed({ id, name: "john", createdAt: new Date() }))
)

const MyApiLive = HttpApiBuilder.api(api).pipe(Layer.provide(usersGroupLive))
```

## Serving

```ts
import { HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { createServer } from "node:http"

const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(MyApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

Layer.launch(ServerLive).pipe(NodeRuntime.runMain)
```

## Predefined errors

| Error | Status |
|-------|--------|
| `HttpApiError.BadRequest` | 400 |
| `HttpApiError.Unauthorized` | 401 |
| `HttpApiError.Forbidden` | 403 |
| `HttpApiError.NotFound` | 404 |
| `HttpApiError.Conflict` | 409 |
| `HttpApiError.InternalServerError` | 500 |

## Common pitfalls
- Repeating auth checks in handlers instead of middleware tags
- Not defining payload/header/url-param schemas explicitly

## See also
- `40-platform.md`
- `../topics/http-middleware.md`
- `../topics/http-derive-client.md`
- `../topics/http-swagger.md`
- `../topics/http-multipart.md`
- `../topics/http-streaming.md`
