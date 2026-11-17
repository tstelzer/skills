/**
 * @title Handling reasons from a dependency
 *
 * Handle the reason already supplied by an AI provider. Do not add an
 * application wrapper just to use these operators.
 */
import { Effect } from "effect"
import type { AiError } from "effect/ai"

// The fallback calls another model and must answer the same request.
export const handleOneReason = (
  callModel: Effect.Effect<string, AiError.AiError>,
  fallback: Effect.Effect<string, AiError.AiError>
) => callModel.pipe(
  Effect.catchReason("AiError", "RateLimitError", () => fallback)
)

export const handleMultipleReasons = (
  callModel: Effect.Effect<string, AiError.AiError>,
  fallback: Effect.Effect<string, AiError.AiError>
) => callModel.pipe(
  Effect.catchReasons("AiError", {
    RateLimitError: () => fallback,
    QuotaExceededError: () => fallback
  })
)

export const unwrapAndHandle = (
  callModel: Effect.Effect<string, AiError.AiError>,
  fallback: Effect.Effect<string, AiError.AiError>
) => callModel.pipe(
  // Unwrap the dependency's existing reason instead of creating another error.
  Effect.unwrapReason("AiError"),
  Effect.catchTags({
    RateLimitError: () => fallback,
    QuotaExceededError: () => fallback
  })
)
