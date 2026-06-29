# HttpApiMiddleware

## What it is
`HttpApiMiddleware.Tag` defines reusable middleware for auth/logging/rate-limiting and optional context provisioning to handlers.

## When to use
- Cross-cutting concerns across endpoint groups
- Security/auth schemes that should be centrally modeled

## When not to use
- Handler-specific logic that is not reusable

## Minimal examples
```ts
import { HttpApiMiddleware, HttpApiSchema, HttpApiSecurity } from "@effect/platform"
import { Context, Schema } from "effect"

class LoggerError extends Schema.TaggedError<LoggerError>()("LoggerError", {}) {}
class Logger extends HttpApiMiddleware.Tag<Logger>()("Logger", {
  failure: LoggerError
}) {}

class CurrentUser extends Context.Tag("CurrentUser")<CurrentUser, { id: number }>() {}
class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  "Unauthorized", {},
  HttpApiSchema.annotations({ status: 401 })
) {}

class Authorization extends HttpApiMiddleware.Tag<Authorization>()("Authorization", {
  failure: Unauthorized,
  provides: CurrentUser,
  security: { bearer: HttpApiSecurity.bearer },
  optional: false
}) {}
```

## Implementation patterns

```ts
import { HttpApiBuilder, HttpServerRequest } from "@effect/platform"
import { Effect, Layer } from "effect"

const LoggerLive = Layer.effect(
  Logger,
  Effect.gen(function* () {
    return Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      yield* Effect.log(`${request.method} ${request.url}`)
    })
  })
)
```

## Applying middleware

```ts
HttpApiEndpoint.get("get", "/").middleware(Authorization)
HttpApiGroup.make("users").middleware(Authorization)
HttpApi.make("api").middleware(Authorization)
```

## Common pitfalls
- Repeating auth checks in handlers instead of middleware tags
- Not providing middleware layer where handlers are built

## See also
- `../sections/30-http-server.md`
- `http-swagger.md`
