# HttpClient

## What it is
`HttpClient`, `HttpClientRequest`, and `HttpClientResponse` are the outgoing HTTP client APIs in `@effect/platform`. They support request middleware, schema-backed request/response bodies, cookies, and pluggable client layers.

## When to use
- Calling external HTTP APIs from Effect programs
- Reusing request transforms (base URL, auth, retries, cookies)
- Decoding response bodies with `Schema`

## When not to use
- Shared server/client contracts where `HttpApi` can derive the client for you
- Route-first servers (`HttpRouter`) or server contracts (`HttpApi`)

## Minimal examples
```ts
import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { Effect, Schema } from "effect"

class Todo extends Schema.Class<Todo>("Todo")({
  userId: Schema.Number,
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Boolean
}) {
  static decodeResponse = HttpClientResponse.schemaBodyJson(Todo)
}

const TodoWithoutId = Schema.Struct(Todo.fields).pipe(Schema.omit("id"))

const program = Effect.gen(function* () {
  const client = (yield* HttpClient.HttpClient).pipe(
    HttpClient.filterStatusOk,
    HttpClient.mapRequest(HttpClientRequest.prependUrl("https://jsonplaceholder.typicode.com"))
  )

  const request = HttpClientRequest.schemaBodyJson(TodoWithoutId)(
    HttpClientRequest.post("/todos"),
    { userId: 1, title: "test", completed: false }
  )

  const response = yield* client.execute(request)
  return yield* Todo.decodeResponse(response)
}).pipe(
  Effect.provide(FetchHttpClient.layer),
  Effect.scoped
)
```

## Common patterns
- Provide `FetchHttpClient.layer` or `NodeHttpClient.layer`
- Use `HttpClient.filterStatusOk` if non-2xx should fail
- Apply cross-cutting transforms with `HttpClient.mapRequest(...)`
- Decode bodies with `HttpClientResponse.schemaBodyJson(...)`

## Common pitfalls
- Forgetting the client layer entirely
- Assuming non-2xx responses fail automatically
- Reading scoped response bodies without `Effect.scoped`

## See also
- `../sections/40-platform.md`
- `http-derive-client.md`
- `schema.md`
