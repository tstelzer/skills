# HTTP Derive Client

## What it is
`HttpApiClient.make` derives a typed client from an `HttpApi` definition.

## When to use
- Share schema contracts between server and client
- Avoid handwritten request/response plumbing

## When not to use
- Calling APIs without a shared `HttpApi` contract

## Minimal examples
```ts
import { HttpApiClient, FetchHttpClient } from "@effect/platform"
import { Effect } from "effect"

const program = Effect.gen(function* () {
  const client = yield* HttpApiClient.make(api, { baseUrl: "http://localhost:3000" })
  const user = yield* client.users.getUser({ path: { id: 1 } })
  const users = yield* client.users.listUsers({ urlParams: { page: 1, sort: "name" } })
  const created = yield* client.users.createUser({ payload: { name: "Jane" } })
})

program.pipe(Effect.provide(FetchHttpClient.layer), Effect.runPromise)
```

## Top-level groups

```ts
// If group is defined with { topLevel: true }
const api = HttpApi.make("api").add(
  HttpApiGroup.make("group", { topLevel: true }).add(
    HttpApiEndpoint.get("get", "/")
  )
)

// Methods are not nested under group name
const result = yield* client.get() // not client.group.get()
```

## Common pitfalls
- Mismatch between client baseUrl and server prefix
- Forgetting to provide an HTTP client layer

## See also
- `../sections/30-http-server.md`
- `http-swagger.md`
