## Middleware Definition

```ts
import { HttpApiMiddleware, HttpApiSchema, HttpApiSecurity } from "@effect/platform"
import { Context, Schema } from "effect"

// Optional: error schema for middleware failures
class LoggerError extends Schema.TaggedError<LoggerError>()("LoggerError", {}) {}

// Basic middleware (no provides/security)
class Logger extends HttpApiMiddleware.Tag<Logger>()("Logger", {
  failure: LoggerError // optional
}) {}

// Middleware that provides context
class CurrentUser extends Context.Tag("CurrentUser")<CurrentUser, { id: number }>() {}

class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  "Unauthorized", {},
  HttpApiSchema.annotations({ status: 401 })
) {}

class Authorization extends HttpApiMiddleware.Tag<Authorization>()("Authorization", {
  failure: Unauthorized,
  provides: CurrentUser,
  security: {
    bearer: HttpApiSecurity.bearer,
    // or: apiKey: HttpApiSecurity.apiKey({ in: "header", key: "x-api-key" })
    // or: basic: HttpApiSecurity.basic
    // or: cookie: HttpApiSecurity.apiKey({ in: "cookie", key: "token" })
  },
  optional: false // if true, continues on auth failure without providing context
}) {}
```

| Option     | Description                                              |
|------------|----------------------------------------------------------|
| `failure`  | Error schema the middleware may return                   |
| `provides` | Context.Tag the middleware provides to handlers          |
| `security` | HttpApiSecurity definitions (resolved in order)          |
| `optional` | If true, request continues even if middleware fails      |

## Middleware Implementation

```ts
import { HttpApiBuilder, HttpServerRequest } from "@effect/platform"
import { Effect, Layer, Redacted } from "effect"

// Simple middleware (no security)
const LoggerLive = Layer.effect(
  Logger,
  Effect.gen(function* () {
    return Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      yield* Effect.log(`${request.method} ${request.url}`)
    })
  })
)

// Security middleware - return handlers for each security definition
const AuthorizationLive = Layer.effect(
  Authorization,
  Effect.gen(function* () {
    return {
      bearer: (token) => Effect.gen(function* () {
        // token is Redacted<string>, use Redacted.value(token) to read
        return { id: 1 } // must match CurrentUser type
      })
    }
  })
)
```

## Applying Middleware

```ts
// To endpoint
HttpApiEndpoint.get("get", "/").middleware(Authorization)

// To group
HttpApiGroup.make("users").middleware(Authorization)

// To entire API
HttpApi.make("api").middleware(Authorization)

// Provide implementation when building group
const groupLive = HttpApiBuilder.group(api, "users", (handlers) =>
  handlers.handle("get", () => Effect.succeed("ok"))
).pipe(Layer.provide(AuthorizationLive))
```

## Security Cookies

```ts
import { HttpApiBuilder, HttpApiSecurity } from "@effect/platform"
import { Redacted } from "effect"

const cookieSecurity = HttpApiSecurity.apiKey({ in: "cookie", key: "token" })

// In handler: set cookie (HttpOnly + Secure by default)
HttpApiBuilder.securitySetCookie(cookieSecurity, Redacted.make("secret-token"))
```
