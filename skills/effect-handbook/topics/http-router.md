# HttpRouter / HttpServer

## What it is
`HttpRouter`, `HttpServer`, `HttpServerRequest`, and `HttpServerResponse` are the route-first HTTP server APIs in `@effect/platform`. Use them when you want direct control over routes, upgrades, middleware, and raw request/response handling without a shared `HttpApi` contract.

## When to use
- Route-first servers, webhooks, internal tools, and lower-level HTTP apps
- WebSocket / upgrade flows or request parsing that does not fit `HttpApi`
- Middleware-heavy apps where explicit routing is clearer than schema-first contracts

## When not to use
- Shared server/client contracts with generated clients (`HttpApi`)
- Pure outgoing HTTP use cases (`HttpClient`)

## Minimal examples
```ts
import {
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerRequest,
  HttpServerResponse,
  Multipart
} from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import * as Schema from "effect/Schema"
import { createServer } from "node:http"

const HttpLive = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/",
    Effect.map(HttpServerRequest.HttpServerRequest, (request) =>
      HttpServerResponse.text(request.url)
    )
  ),
  HttpRouter.post(
    "/upload",
    Effect.gen(function* () {
      const data = yield* HttpServerRequest.schemaBodyForm(Schema.Struct({
        files: Multipart.FilesSchema
      }))
      return HttpServerResponse.text(String(data.files.length))
    })
  ),
  HttpServer.serve(HttpMiddleware.logger),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

NodeRuntime.runMain(Layer.launch(HttpLive))
```

## Common pitfalls
- Choosing `HttpRouter` when you actually need `HttpApi` client derivation and OpenAPI
- Forgetting to provide the server layer
- Reimplementing request decoding instead of using `HttpServerRequest` helpers

## See also
- `../sections/30-http-server.md`
- `../sections/40-platform.md`
- `http-streaming.md`
- `http-client.md`
