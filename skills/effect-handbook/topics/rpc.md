# RPC

## What it is
`@effect/rpc` provides typed RPC groups, client/server layers, protocol adapters, serialization, and middleware. It is the right tool when you want end-to-end typed request/response APIs that look more like procedure calls than REST resources.

## When to use
- Internal service-to-service APIs
- Typed clients where RPC semantics are a better fit than `HttpApi`
- Streaming procedure calls with shared request models

## When not to use
- Resource-oriented HTTP APIs that benefit from `HttpApi`, OpenAPI, and generated REST clients
- Simple one-off HTTP requests (`HttpClient`)

## Minimal examples
```ts
import { FetchHttpClient } from "@effect/platform"
import { Rpc, RpcClient, RpcGroup, RpcSerialization, RpcServer } from "@effect/rpc"
import { Effect, Layer, Schema } from "effect"

class User extends Schema.Class<User>("User")({
  id: Schema.String,
  name: Schema.String
}) {}

class UserRpcs extends RpcGroup.make(
  Rpc.make("UserById", {
    success: User,
    error: Schema.String,
    payload: { id: Schema.String }
  })
) {}

const ServerProtocol = RpcServer.layerProtocolHttp({ path: "/rpc" }).pipe(
  Layer.provide(RpcSerialization.layerNdjson)
)

const ClientProtocol = RpcClient.layerProtocolHttp({ url: "http://localhost:3000/rpc" }).pipe(
  Layer.provide([FetchHttpClient.layer, RpcSerialization.layerNdjson])
)

const program = Effect.gen(function* () {
  const client = yield* RpcClient.make(UserRpcs)
  return yield* client.UserById({ id: "1" })
}).pipe(Effect.provide(ClientProtocol), Effect.scoped)
```

## Common pitfalls
- Forgetting to provide the same serialization layer on client and server
- Forcing RPC into REST-shaped problems where `HttpApi` is clearer
- Skipping middleware layers when auth or context propagation is required on both sides

## See also
- `schema.md`
- `http-router.md`
- `platform-ndjson.md`
