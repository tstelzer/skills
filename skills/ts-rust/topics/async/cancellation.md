# Keep progress where cancellation cannot silently lose it

A future may stop being polled when a race is lost, a timeout expires, or its owner is dropped.
Work already performed outside the future is not rolled back.

## Bad

This Tokio sketch restarts a read after every notification:

```rust
async fn read_pair<R: tokio::io::AsyncRead + Unpin>(
    reader: &mut R,
    notices: &mut tokio::sync::mpsc::Receiver<()>,
) -> std::io::Result<[u8; 2]> {
    use tokio::io::AsyncReadExt;
    loop {
        let mut bytes = [0; 2];
        tokio::select! {
            result = reader.read_exact(&mut bytes) => {
                result?;
                return Ok(bytes);
            }
            _ = notices.recv() => {}
        }
    }
}
```

The read may have consumed bytes before losing the race. Restarting discards its progress.
A closed notice channel also stays ready and can make the loop spin.

## Good

Keep the same future until it finishes. Disable the notice branch when the channel closes.
This uses Tokio's `io-util`, `sync`, and `macros` features.

```rust
async fn read_pair<R: tokio::io::AsyncRead + Unpin>(
    reader: &mut R,
    notices: &mut tokio::sync::mpsc::Receiver<()>,
) -> std::io::Result<[u8; 2]> {
    use tokio::io::AsyncReadExt;
    let mut bytes = [0; 2];
    {
        let read = reader.read_exact(&mut bytes);
        tokio::pin!(read);
        let mut notices_open = true;

        loop {
            tokio::select! {
                result = &mut read => {
                    result?;
                    break;
                }
                notice = notices.recv(), if notices_open => {
                    notices_open = notice.is_some();
                }
            }
        }
    }
    Ok(bytes)
}
```

The outer block releases the future's mutable borrow before returning `bytes`.
Cancelling the whole function can still abandon the read. This example preserves progress across notice races only.

## Check the operation, not just the syntax

- Consult the operation's cancellation contract. `read_exact` and `read_to_end` need different treatment from `read`.
- A buffer outside the future is not enough when the number of consumed bytes is lost.
- Keep a timer outside a loop when the deadline should not restart on every iteration.
- With `select! { biased; ... }`, put shutdown ahead of branches that can stay ready so it gets polled.
- Await `&mut JoinHandle` in a race when the owner must keep the handle after another branch wins.
- Cancelling a `send` can drop the unsent value. Reserve capacity first when ownership must survive that wait.
- Cancelling a lock wait may lose the waiter's place in the queue, even when it loses no application data.
- Review remote writes, payments, and commits separately: timing out the local wait does not prove they did not happen.

## Shut down in a known order

Stop accepting work, notify workers, and wait for them to finish the chosen cleanup.
A `tokio_util::sync::CancellationToken` asks workers to stop; it does not join or forcibly stop them.
Call `cancel()` explicitly. Dropping an ordinary token is not the same as cancellation.

Use child tokens when a parent's cancellation should reach child work.
Choose a deadline for graceful completion.
If dropping the work is safe, abort remaining async tasks after the deadline, then drain their handles.
Aborting asks the runtime to drop a task at a cancellation point; it does not wait for that drop to finish.
Preserve unexpected task errors while distinguishing the cancellation you requested.
A `TaskTracker` wait completes only after the tracker is closed and all tracked tasks finish.
Closing the tracker does not prevent more tasks from being added. Stop the code that creates them too.
Started blocking jobs need their own cooperative stop or completion plan.
