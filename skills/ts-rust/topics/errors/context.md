# Keep recovery choices and the original cause

Use concrete errors when callers need to match outcomes. Use a report type when callers only need to report a failure.
This depends on the caller, not just whether the crate is a library or an application.

## Bad

```rust
fn load(path: &std::path::Path) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|error| error.to_string())
}
```

This drops the error type. Callers cannot reliably identify a missing file.

## Good

```rust
use std::{io, path::Path};

fn load(path: &Path) -> io::Result<String> {
    std::fs::read_to_string(path)
}
```

Pass known errors through unchanged when callers can already handle them.
Do not add a wrapper just to name the module or attach a path.

## Expose the error categories callers need

Use a public enum when callers need to match its cases.
A public `Error` struct can also represent several cases while keeping its fields private.
Expose a `kind()` method or specific checks such as `is_range()` for the choices callers need to make.
Use `#[non_exhaustive]` on a public kind enum when callers must allow future categories.
Do not require callers to inspect error messages to decide how to recover.

Use `thiserror` or a manual `std::error::Error` implementation for errors your API owns.
When a new error gives the caller a useful recovery choice, keep the original cause through `Error::source`.
With `thiserror`, use `#[source]` for that cause or `#[from]` when the conversion needs no other fields.

## Report context where the operation is handled

Record the original error and the operation details where code decides what to do about the failure.
Use logs or traces for details such as the path. This example uses `tracing`:

```rust
fn report_load_failure(path: &std::path::Path, error: &std::io::Error) {
    tracing::error!(path = %path.display(), error = %error, "could not read settings");
}
```

Do not log an error in each function that passes it back to its caller.
Map internal errors into public responses at the interface that serves the caller.
Keep secrets and private data out of messages. Even a file path can be sensitive.
