## Error handling

Use `Effect.tapError` or `Effect.tapErrorTag` to report a failure without
handling it. Use `Effect.catch`, `Effect.catchTag`, or `Effect.catchTags` only
when the handler returns a valid recovery value or a deliberate replacement
failure. Logging, rendering, and setting exit metadata are observations.

Map errors where each failing operation crosses into the domain. Keep the
source error typed and use fields such as `PlatformError.reason`; do not widen
it to `unknown` and recover its shape with `instanceof` or defensive property
checks. Do not wrap an entire workflow when each operation has a narrower error
boundary. Do not convert defects into expected failures to make an error union
uniform.

Keep the error channel intact until the application boundary chooses the
process or protocol outcome.
