## Error handling

- Follow skill: ts-principles for error handling.
- Do not wrap errors just to rename them, mark a module boundary, or shorten an error union.
- Keeping `cause` or `reason` does not justify a needless wrapper.
- Preserve recognized technical errors as the original values and types.
- Create domain errors for business outcomes that callers need to handle.
- Put operation details in logs and traces instead of adding an error class.

### Adapt Promise and throwing APIs

- Use `Effect.promise` when no Promise rejection has a known recovery path.
- Use `Effect.sync` for synchronous calls under the same rule.
- A rejection or throw becomes a defect with its original value.
- Use `Effect.tryPromise` or `Effect.try` only for specific failures callers recognize and can handle.
- Return the original recognized error from the `catch` callback.
- Throw every other error from `catch` so it becomes a defect.
- Do not use the overloads without `catch`; they turn unknown errors into `UnknownError`.
- Use the library's error class or guard to recognize errors at this boundary.
- Do not cast an unknown error into the type you want.

### Handle failures where the caller knows what to do

- Keep an Effect dependency's typed errors intact until the caller chooses how to handle them.
- Read typed fields such as `PlatformError.reason` directly.
- Do not widen a typed error to `unknown` and check its shape again.
- Use `Effect.catch`, `Effect.catchTag`, or `Effect.catchTags` for recovery or a deliberate protocol response.
- Use `Effect.tapError` or `Effect.tapErrorTag` to observe a failure without handling it.
- Logging, rendering, and setting exit metadata do not make a failure recoverable.
- Let defects reach the application boundary.
- Report unhandled failures once at that boundary.
- Typed recovery skips causes that contain defects.
- Use `catchCause` when the boundary needs the full cause, including defects and interruption.
- `mapError` changes typed failures while preserving defects and interruption.
