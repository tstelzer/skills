import { Effect, Layer } from "effect"
import { HttpApiBuilder, HttpApiError } from "effect/http-api"
import { Api } from "../../api/Api.ts"
import { CurrentUser } from "../../api/Authorization.ts"
import { AuthorizationLayer } from "../Authorization.ts"
import { Users } from "../Users.ts"

// Keep dependencies open so tests can provide an in-memory Users layer.
export const UsersApiHandlersNoDeps = HttpApiBuilder.group(
  Api,
  "users",
  Effect.fn(function*(handlers) {
    const users = yield* Users

    return handlers.handleAll({
      list: ({ query }) => users.list(query.search),
      search: Effect.fn(function*({ payload }) {
        if (payload.search === "bad-request") {
          return yield* new HttpApiError.RequestTimeout()
        }
        return yield* users.list(payload.search)
      }),
      getById: ({ params }) => users.getById(params.id),
      create: ({ payload }) => users.create(payload),
      update: ({ params, payload }) => users.update(params.id, payload),
      me: () =>
        // The Authorization middleware provides the CurrentUser service, so we
        // can access it here.
        CurrentUser
    })
  })
)

// Provide live dependencies only at the server composition edge.
export const UsersApiHandlers = UsersApiHandlersNoDeps.pipe(
  Layer.provide([Users.layer, AuthorizationLayer])
)
