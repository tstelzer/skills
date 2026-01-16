## Client Derivation

```ts
import { HttpApiClient, FetchHttpClient } from "@effect/platform"
import { Effect } from "effect"

const program = Effect.gen(function* () {
  const client = yield* HttpApiClient.make(api, { baseUrl: "http://localhost:3000" })

  // Call endpoints: client.{groupName}.{endpointName}({ path, urlParams, payload, headers })
  const user = yield* client.users.getUser({ path: { id: 1 } })
  const users = yield* client.users.listUsers({ urlParams: { page: 1, sort: "name" } })
  const created = yield* client.users.createUser({ payload: { name: "Jane" } })
})

program.pipe(Effect.provide(FetchHttpClient.layer), Effect.runPromise)
```

## Top-Level Groups

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
