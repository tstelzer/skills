/**
 * @title Error handling basics
 *
 * Defining custom errors and handling them with Effect.catch and Effect.catchTag.
 */
import { Effect, Schema } from "effect"

// Define custom errors using Schema.TaggedErrorClass
export class ParseError extends Schema.TaggedErrorClass<ParseError>()("ParseError", {
  input: Schema.String,
  message: Schema.String
}) {}

export class ReservedPortError extends Schema.TaggedErrorClass<ReservedPortError>()("ReservedPortError", {
  port: Schema.Number
}) {}

declare const loadPort: (input: string) => Effect.Effect<number, ParseError | ReservedPortError>

export const observed = loadPort("80").pipe(
  // Reporting is not recovery. The original error remains in the channel.
  Effect.tapError((error) => Effect.logError("Could not load port", error))
)

export const recovered = loadPort("80").pipe(
  // This is recovery because every caught error becomes a valid port.
  Effect.catchTag(["ParseError", "ReservedPortError"], (_) => Effect.succeed(3000))
)

export const withFinalFallback = loadPort("invalid").pipe(
  // Catch a specific error with Effect.catchTag
  Effect.catchTag("ReservedPortError", (_) => Effect.succeed(3000)),
  // Catch all errors with Effect.catch
  Effect.catch((_) => Effect.succeed(3000))
)
