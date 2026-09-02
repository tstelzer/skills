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
} from "effect/unstable/http"

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

export class JsonPlaceholderHttpError extends Schema.TaggedError<JsonPlaceholderHttpError>()(
  "JsonPlaceholderHttpError",
  {
    operation: Schema.String,
    reason: HttpClientError.HttpClientErrorSchema
  }
) {}

export class JsonPlaceholderBodyError extends Schema.TaggedError<JsonPlaceholderBodyError>()(
  "JsonPlaceholderBodyError",
  {
    reason: Schema.instanceOf(HttpBody.HttpBodyError)
  }
) {}

export class InvalidJsonPlaceholderResponse
  extends Schema.TaggedError<InvalidJsonPlaceholderResponse>()(
    "InvalidJsonPlaceholderResponse",
    {
      endpoint: Schema.String,
      reason: Schema.instanceOf(Schema.SchemaError)
    }
  ) {}

export class TodoNotFound extends Schema.TaggedError<TodoNotFound>()("TodoNotFound", {
  id: Schema.Int
}) {}

export type JsonPlaceholderError =
  | JsonPlaceholderHttpError
  | JsonPlaceholderBodyError
  | InvalidJsonPlaceholderResponse

const mapHttpError = (operation: string) =>
  Effect.mapError((reason: HttpClientError.HttpClientError) =>
    new JsonPlaceholderHttpError({
      operation,
      reason: HttpClientError.HttpClientErrorSchema.fromHttpClientError(reason)
    })
  )

const mapResponseError = (endpoint: string) =>
  Effect.mapError((reason: Schema.SchemaError) =>
    new InvalidJsonPlaceholderResponse({ endpoint, reason })
  )

const decodeTodo = Schema.decodeEffect(Schema.toCodecJson(Todo))
const decodeTodos = Schema.decodeEffect(Schema.toCodecJson(Schema.Array(Todo)))

export class JsonPlaceholder extends Context.Service<JsonPlaceholder, {
  readonly allTodos: Effect.Effect<ReadonlyArray<Todo>, JsonPlaceholderError>
  getTodo(id: number): Effect.Effect<Todo, JsonPlaceholderError | TodoNotFound>
  createTodo(todo: typeof NewTodo.Type): Effect.Effect<Todo, JsonPlaceholderError>
}>()("app/JsonPlaceholder") {
  static readonly layerNoDeps = Layer.effect(
    JsonPlaceholder,
    Effect.gen(function*() {
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
        const response = yield* client.get("/todos").pipe(
          mapHttpError("GET /todos")
        )
        const json = yield* response.json.pipe(
          mapHttpError("read GET /todos response")
        )
        return yield* decodeTodos(json).pipe(
          mapResponseError("GET /todos")
        )
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
        }).pipe(
          mapHttpError(`GET ${endpoint}`)
        )

        if (response.status === 404) {
          return yield* new TodoNotFound({ id })
        }

        const okResponse = yield* HttpClientResponse.filterStatusOk(response).pipe(
          mapHttpError(`GET ${endpoint}`)
        )

        const json = yield* okResponse.json.pipe(
          mapHttpError(`read GET ${endpoint} response`)
        )

        return yield* decodeTodo(json).pipe(
          mapResponseError(`GET ${endpoint}`)
        )
      })

      // You can use the HttpClientRequest module to build up more complex
      // requests:
      const createTodo = Effect.fn("JsonPlaceholder.createTodo")(function*(todo: typeof NewTodo.Type) {
        yield* Effect.annotateCurrentSpan({ title: todo.title })

        const request = yield* HttpClientRequest.post("/todos").pipe(
          HttpClientRequest.setUrlParams({ format: "json" }),
          HttpClientRequest.schemaBodyJson(NewTodo)(todo),
          Effect.mapError((reason) => new JsonPlaceholderBodyError({ reason }))
        )

        const response = yield* client.execute(request).pipe(
          mapHttpError("POST /todos")
        )
        const json = yield* response.json.pipe(
          mapHttpError("read POST /todos response")
        )

        return yield* decodeTodo(json).pipe(
          mapResponseError("POST /todos")
        )
      })

      return JsonPlaceholder.of({
        allTodos,
        getTodo,
        createTodo
      })
    })
  )
}

// Select the platform HttpClient at the runtime composition edge.
export const JsonPlaceholderLive = JsonPlaceholder.layerNoDeps.pipe(
  Layer.provide(FetchHttpClient.layer)
)
