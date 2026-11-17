# Own spawned work until it finishes

Use direct awaits for dependent operations. Use concurrent futures for independent work.
Spawn only when the work needs its own task lifetime or scheduling.

## Bad

```rust
async fn save(path: std::path::PathBuf, bytes: Vec<u8>) {
    tokio::spawn(async move {
        tokio::fs::write(path, bytes).await
    });
}
```

Returning from `save` means only that work was spawned. The caller cannot see a write failure or wait for completion.

## Good

```rust
async fn save(path: std::path::PathBuf, bytes: Vec<u8>) -> std::io::Result<()> {
    tokio::fs::write(path, bytes).await
}
```

When spawning is required, retain the handle and observe both failures:

```rust
async fn save_in_task(path: std::path::PathBuf, bytes: Vec<u8>) -> anyhow::Result<()> {
    let task = tokio::spawn(async move {
        tokio::fs::write(path, bytes).await
    });
    task.await??;
    Ok(())
}
```

This uses Tokio's `rt` and `fs` features, plus `anyhow`.
A cancelled caller can drop the local handle and detach its child.
Use a task owner that outlives the caller when shutdown must still join that child.

## Choose the completion rule

| Tool | Behavior |
| --- | --- |
| Sequential `.await` | The next operation starts after the prior one finishes |
| `join!` | Poll all branches in one task and wait for all results |
| `try_join!` | Stop on the first error; cancel unfinished directly owned branch futures |
| `select!` | Complete one matching branch; stop polling the others in that invocation |
| `JoinHandle` | Observe one independently spawned task |
| `JoinSet` | Own a changing set of tasks and receive completions as they arrive |

`join!` and `select!` provide concurrency within one task, not separate worker threads.
Blocking one branch blocks polling the others. Enable Tokio's `macros` feature for these macros.

With spawned tasks, `try_join!` sees the handles' outer `Result`, which reports task failure.
An inner application error still needs handling.
Dropping an unfinished handle detaches its task instead of stopping it.
Do not use `try_join!` over handles as a substitute for owning and shutting down those tasks.

`tokio::spawn` requires owned data or suitable `'static` references, and a `Send` future.
Its output must also be `Send + 'static`.
The values stored in the future, including those kept across suspension points, determine whether it is `Send`.
Use local task support only when the runtime arrangement supports it.

## Bound concurrent work without spawning

Poll a limited number of child futures inside the caller when they do not need separate tasks.
This uses `futures-util` and Tokio's `fs` feature:

```rust
use futures_util::{stream, StreamExt, TryStreamExt};
use std::num::NonZeroUsize;
use std::path::PathBuf;

async fn load_unordered(paths: &[PathBuf], limit: NonZeroUsize) -> std::io::Result<Vec<String>> {
    stream::iter(paths)
        .map(|path| tokio::fs::read_to_string(path))
        .buffer_unordered(limit.get())
        .try_collect()
        .await
}
```

Results arrive in completion order. Use `buffered` when results must keep input order.
The positive limit bounds active read futures. It does not bound file sizes or the final result vector.
On the first error, `try_collect` drops the other futures. Already-started blocking file work may still finish.

## Bound and drain dynamic work

For a `JoinSet`, limit admission as well as tracking results:

1. Pick a positive maximum number of active tasks.
2. Spawn up to that limit.
3. Await `join_next`, handle its task result, then admit another job.
4. Stop accepting new jobs on shutdown or when the chosen failure requires it.
5. Request cancellation or abort remaining tasks, then join them when completion must be confirmed.

`JoinSet` does not impose a concurrency limit by itself.
Do not spawn one task per input merely to have each task wait on a semaphore. The waiting tasks also use memory.
Dropping a `JoinHandle` detaches its task. Dropping a `JoinSet` aborts its contained async tasks;
explicitly waiting is still how an owner observes completion and cleanup.

Preserve indexes or keys when callers require input order; completion order can differ.
Read [cancellation](./cancellation.md) before choosing early return as the failure policy.
