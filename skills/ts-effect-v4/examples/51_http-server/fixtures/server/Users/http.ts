import { Effect, Layer } from "effect"
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi"
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
      list: ({ query }) =>
        users.list(query.search).pipe(
          Effect.catchReason(
            "UsersError",
            "SearchQueryTooShort",
            Effect.fail,
            // No other UsersError reason belongs to the list contract.
            Effect.die
          )
        ),
      search: Effect.fn(function*({ payload }) {
        if (payload.search === "bad-request") {
          return yield* new HttpApiError.RequestTimeout()
        }
        return yield* users.list(payload.search).pipe(
          Effect.catchReason(
            "UsersError",
            "SearchQueryTooShort",
            // Re-fail the reason declared by the protocol.
            Effect.fail,
            // Undeclared reasons violate the protocol contract.
            Effect.die
          )
        )
      }),
      getById: ({ params }) =>
        users.getById(params.id).pipe(
          Effect.catchReasons("UsersError", {
            UserNotFound: (e) => Effect.fail(e)
          }, Effect.die)
        ),
      create: ({ payload }) =>
        users.create(payload).pipe(
          // The API contract declares UsersError impossible for this endpoint.
          // Do not use orDie when the protocol should expose the failure.
          Effect.orDie
        ),
      update: ({ params, payload }) =>
        users.update(params.id, payload).pipe(
          Effect.catchReasons("UsersError", {
            UserNotFound: (e) => Effect.fail(e)
          }, Effect.die)
        ),
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
