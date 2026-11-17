# Keep runtime workers free to poll other tasks

Use async I/O in async work. Put blocking APIs on a blocking pool or a dedicated thread.
An `.await` only yields when the awaited operation needs to suspend; a ready future can continue immediately.
Calling an `async fn` creates a future. Its body runs only when that future is polled.
Awaiting or spawning the future lets it make progress.

## Bad

```rust
async fn load(path: &std::path::Path) -> std::io::Result<String> {
    std::fs::read_to_string(path)
}
```

The function is async in name, but the read blocks the thread that polls it.

## Good

This uses Tokio's `fs` feature.

```rust
async fn load(path: &std::path::Path) -> std::io::Result<String> {
    tokio::fs::read_to_string(path).await
}
```

Tokio file APIs may use blocking work internally. They keep that wait off the async worker; they do not promise a
particular operating system I/O mechanism.
Synchronous setup before the runtime starts can use ordinary file APIs.

## Isolate a blocking library call

This uses Tokio's runtime support and `anyhow` for reporting either the task failure or the I/O error.

```rust
use std::path::PathBuf;

async fn blocking_load(path: PathBuf) -> anyhow::Result<String> {
    let text = tokio::task::spawn_blocking(move || std::fs::read_to_string(path)).await??;
    Ok(text)
}
```

The outer result reports task failure. The inner result reports the read failure.

- Bound the number of blocking jobs. A large queue or many CPU-heavy blocking jobs can exhaust resources.
- Use a compute pool such as Rayon for sustained CPU parallelism. Await a result without blocking the runtime worker.
- A long-running blocking loop may need a dedicated thread.
- A started `spawn_blocking` job does not become cancellable just because its handle is aborted or timed out.
- Break cooperative CPU work into useful chunks only when doing so meets the latency requirement.

Timeouts and task abort requests cannot interrupt code that keeps running without giving control back to the runtime.
Moving work to `spawn_blocking` frees the async worker but does not give that work a forced stop mechanism.

Create and configure the runtime at the application boundary.
Do not start a runtime inside reusable library functions or call a blocking runtime entrypoint from an async worker.
Choose a current-thread or multi-thread runtime from the work and platform, not from a universal template.
