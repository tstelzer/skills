# Keep recovery choices and the original cause

Use concrete errors when callers need to match outcomes. Use a report type when callers only need to report a failure.
This depends on the caller, not just whether the crate is a library or an application.

## Bad

```rust
fn load(path: &std::path::Path) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|error| error.to_string())
}
```

This drops the error type and the path. Callers cannot reliably identify a missing file.

## Good

This example uses `thiserror` to keep a typed cause and operation context.

```rust
use std::path::{Path, PathBuf};

#[derive(Debug, thiserror::Error)]
#[error("could not read settings from {path}", path = .path.display())]
struct LoadError {
    path: PathBuf,
    #[source]
    source: std::io::Error,
}

fn load(path: &Path) -> Result<String, LoadError> {
    std::fs::read_to_string(path).map_err(|source| LoadError {
        path: path.to_owned(),
        source,
    })
}
```

Use an enum when distinct variants change recovery. Keep a single error struct when callers only need one failure kind.
Implement `std::error::Error` manually when a derive dependency is not justified.

## Add context at the point that knows it

For a reporting path, `anyhow` can preserve the cause while adding context.

```rust
use anyhow::Context;
use std::path::Path;

fn load(path: &Path) -> anyhow::Result<String> {
    std::fs::read_to_string(path)
        .with_context(|| format!("could not read settings from {}", path.display()))
}
```

- Use `#[from]` or a `From` implementation for a natural conversion that needs no extra context.
- Use `#[source]` and `map_err` when the error also needs a path, key, or operation name.
- Add context that answers what was being attempted. Do not repeat the same message at every layer.
- Keep chain fragments readable, usually lowercase without a final period. Preserve proper names.
- Map internal errors into public responses at the interface that serves the caller.
- Keep secrets and private data out of messages. Even a file path can be sensitive.

Propagating code should not log and then return the same failure for every caller to log again.
Report it where recovery stops or where the application decides the outcome.
