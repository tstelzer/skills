/**
 * @title Getting started with HttpClient
 *
 * Define a service that uses the HttpClient module to fetch data from an external API
 */
import { Context, Effect, flow, Layer, Schedule, Schema } from "effect"
import {
  FetchHttpClient,
  HttpBody,
  HttpClient,
  HttpClientError,
  HttpClientRequest,
  HttpClientResponse
} from "effect/http"

class Todo extends Schema.Class<Todo>("Todo")({
  userId: Schema.Int,
  id: Schema.Int,
  title: Schema.String,
  completed: Schema.Boolean
}) {}

const NewTodo = Schema.Struct({
  userId: Schema.Int,
  title: Schema.String,
  completed: Schema.Boolean
})

export class TodoNotFound extends Schema.TaggedError<TodoNotFound>()("TodoNotFound", {
  id: Schema.Int
}) {}

const decodeTodo = Schema.decodeEffect(Schema.toCodecJson(Todo))
const decodeTodos = Schema.decodeEffect(Schema.toCodecJson(Schema.Array(Todo)))

export class JsonPlaceholder extends Context.Service<JsonPlaceholder, {
  readonly allTodos: Effect.Effect<
    ReadonlyArray<Todo>,
    HttpClientError.HttpClientError | Schema.SchemaError
  >
  getTodo(id: number): Effect.Effect<
    Todo,
    HttpClientError.HttpClientError | Schema.SchemaError | TodoNotFound
  >
  createTodo(todo: typeof NewTodo.Type): Effect.Effect<
    Todo,
    | HttpClientError.HttpClientError
    | HttpBody.HttpBodyError
    | Schema.SchemaError
  >
}>()("app/JsonPlaceholder") {
  static readonly make = Effect.gen(function*() {
    // Access the HttpClient service, and apply some common middleware to all
    // requests:
    const baseClient = (yield* HttpClient.HttpClient).pipe(
      // Add a base URL to all requests made with this client, and set the
      // Accept header to expect JSON responses
      HttpClient.mapRequest(flow(
        HttpClientRequest.prependUrl("https://jsonplaceholder.typicode.com"),
        HttpClientRequest.acceptJson
      )),
      // Retry transient errors (network issues, 5xx responses) with an
      // exponential backoff.
      //
      // See the schedule documentation for more complex retry strategies.
      HttpClient.retryTransient({
        schedule: Schedule.exponential(100),
        times: 3
      })
    )
    // Most operations accept only 2xx responses.
    const client = baseClient.pipe(HttpClient.filterStatusOk)

    const allTodos = Effect.gen(function*() {
      const response = yield* client.get("/todos")
      const json = yield* response.json
      return yield* decodeTodos(json)
    }).pipe(Effect.withSpan("JsonPlaceholder.allTodos"))

    // Use the HttpClient to fetch a todo item by id, and decode the response
    // using the Todo schema.
    const getTodo = Effect.fn("JsonPlaceholder.getTodo")(function*(id: number) {
      // Annotate the current span with the id of the todo being fetched, so
      // that it shows up in telemetry for this request.
      yield* Effect.annotateCurrentSpan({ id })

      const endpoint = `/todos/${id}`
      const response = yield* baseClient.get(endpoint, {
        // You can pass additional options to individual requests.
        // There are options for query parameters, request body, headers, and
        // more.
        urlParams: { format: "json" }
      })

      if (response.status === 404) {
        return yield* new TodoNotFound({ id })
      }

      const okResponse = yield* HttpClientResponse.filterStatusOk(response)
      const json = yield* okResponse.json
      return yield* decodeTodo(json)
    })

    // You can use the HttpClientRequest module to build up more complex
    // requests:
    const createTodo = Effect.fn("JsonPlaceholder.createTodo")(function*(todo: typeof NewTodo.Type) {
      yield* Effect.annotateCurrentSpan({ title: todo.title })

      const request = yield* HttpClientRequest.post("/todos").pipe(
        HttpClientRequest.setUrlParams({ format: "json" }),
        HttpClientRequest.schemaBodyJson(NewTodo)(todo)
      )

      const response = yield* client.execute(request)
      const json = yield* response.json
      return yield* decodeTodo(json)
    })

    return JsonPlaceholder.of({
      allTodos,
      getTodo,
      createTodo
    })
  })

  static readonly layerNoDeps = Layer.effect(this, this.make)
}

// Select the platform HttpClient at the runtime composition edge.
export const JsonPlaceholderLive = JsonPlaceholder.layerNoDeps.pipe(
  Layer.provide(FetchHttpClient.layer)
)
