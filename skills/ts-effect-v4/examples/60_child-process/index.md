## Working with child processes

Use the `effect/unstable/process` modules to define child processes and run
them with `ChildProcessSpawner`.

Map each spawn, stream, and exit-code failure at that operation. Keep
`PlatformError` typed until the mapping and inspect `reason` when behavior
depends on `NotFound`, permissions, or another platform condition.

Model command failure separately from a command that succeeds but returns
invalid output. Preserve missing, empty, malformed, and partial output when
callers treat them differently. Do not call `trim()` on secrets, tokens,
signatures, or other opaque output unless the command contract defines
whitespace as insignificant.
