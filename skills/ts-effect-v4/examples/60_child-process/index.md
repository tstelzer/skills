## Working with child processes

Use the `effect/process` modules to define child processes and run
them with `ChildProcessSpawner`.

Pass an argument array for ordinary commands. Templates keep quoted words
together but reject unquoted shell operators, expansions, and globs.
For a shell command, pass the whole script as the command with no extra arguments;
quote inserted values with `CommandLine.quote` or `CommandLine.join` from
`effect/process`. Shell templates do not accept interpolated values.

Keep secret arguments and environment values as `Redacted` strings. Use
`CommandLine.display` for logs. Consume both output streams when using a raw
process handle; output sinks run only while their handle stream is consumed.

Keep `PlatformError` unchanged across spawn, stream, and exit-code operations.
Inspect `reason` when a caller handles `NotFound`, permissions, or another
platform condition. Do not add a wrapper just to name the command or operation.

Model command failure separately from a command that succeeds but returns
invalid output. Preserve missing, empty, malformed, and partial output when
callers treat them differently. Do not call `trim()` on secrets, tokens,
signatures, or other opaque output unless the command contract defines
whitespace as insignificant.
