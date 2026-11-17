/**
 * @title Creating effects from common sources
 *
 * Learn how to create effects from various sources, including plain values,
 * synchronous code, Promise APIs, optional values, and callback-based APIs.
 */
import { Effect } from "effect"

// This is the error the Promise client throws, not a wrapper added by Effect.
class UserNotFound extends Error {
  readonly _tag = "UserNotFound"

  constructor(readonly userId: number) {
    super(`Missing user ${userId}`)
  }
}

// Some request fields are optional and may be absent.
const requestHeaders = new Map<string, string>([
  ["x-request-id", "req_1"]
])

// `Effect.succeed` wraps values you already have in memory.
export const fromValue = Effect.succeed({ env: "prod", retries: 3 })

// `Effect.sync` leaves thrown errors as defects. Use it when the application
// has no recovery for them. Use Effect capabilities for time or platform state.
export const fromSyncComputation = Effect.sync(
  () => new Map<string, string>()
)

// The caller can ask for corrected JSON on SyntaxError. Keep that original
// error in the channel; every other exception is a defect.
export const parsePayload = Effect.fn("parsePayload")((input: string) =>
  Effect.try({
    try: (): unknown => JSON.parse(input),
    catch: (error) => {
      if (error instanceof SyntaxError) return error
      throw error
    }
  })
)

const users = new Map<number, { readonly id: number; readonly name: string }>([
  [1, { id: 1, name: "Ada" }],
  [2, { id: 2, name: "Lin" }]
])

// A small Promise client for this example.
const lookupUser = async (userId: number) => {
  const user = users.get(userId)
  if (!user) throw new UserNotFound(userId)
  return user
}

// This caller has no recovery for lookup failures, so they stay defects.
export const fetchRequiredUser = Effect.fn("fetchRequiredUser")(
  (userId: number) => Effect.promise(() => lookupUser(userId))
)

// This caller can handle a missing user. Expose the client's original error.
export const fetchUser = Effect.fn("fetchUser")((userId: number) =>
  Effect.tryPromise({
    try: () => lookupUser(userId),
    catch: (error) => {
      if (error instanceof UserNotFound) return error
      throw error
    }
  })
)

// `Effect.fromNullishOr` turns nullable values into a typed effect.
export const fromNullishHeader = Effect.fromNullishOr(
  requestHeaders.get("x-workspace-id")
)

// `Effect.callback` wraps callback-style asynchronous APIs.
export const fromCallback = Effect.callback<number>((resume) => {
  const timeoutId = setTimeout(() => {
    resume(Effect.succeed(200))
  }, 10)

  // Return a finalizer so interruption can cancel the callback source.
  return Effect.sync(() => {
    clearTimeout(timeoutId)
  })
})
