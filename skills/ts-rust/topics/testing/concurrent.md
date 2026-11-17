# Wait for observable completion instead of guessing time

Use task handles, channels, or explicit state changes to coordinate a concurrent test.
A short sleep does not prove another task has run.

## Bad

```rust
#[tokio::test]
async fn receives_result() {
    let (sender, mut receiver) = tokio::sync::mpsc::channel(1);
    tokio::spawn(async move { sender.send(42).await.unwrap() });
    tokio::time::sleep(std::time::Duration::from_millis(10)).await;
    assert_eq!(receiver.try_recv().unwrap(), 42);
}
```

## Good

This uses Tokio's `macros`, runtime, `sync`, and `time` support.

```rust
#[tokio::test]
async fn receives_result() {
    use std::time::Duration;
    let (sender, mut receiver) = tokio::sync::mpsc::channel(1);
    let worker = tokio::spawn(async move { sender.send(42).await.unwrap() });

    let value = tokio::time::timeout(Duration::from_secs(1), receiver.recv())
        .await
        .expect("worker should reply before the test deadline");
    assert_eq!(value, Some(42));
    worker.await.expect("worker should finish without panicking");
}
```

The timeout bounds a hang; the receive is what proves progress.
Use Tokio's controlled-time test support for timer behavior when the project's features provide it.
Do not mix virtual-time assumptions with blocking sleeps.

Test the lifecycle cases your code owns: full queues, closed senders, cancellation, task panic, and shutdown.
Check partial progress and resources after cancellation, not just the returned error.

## Use specialized checks for the implementation risk

- Use Loom for small synchronization algorithms expressed with its model types.
  It explores modeled schedules under its configured bounds, not every possible execution of the whole application.
- Use Miri for supported tests of unsafe code to detect classes of invalid memory access and other undefined behavior.
  Check target and foreign-code limits. Passing a run is not a proof of soundness.
- Test unsafe abstractions when a supplied callback panics or a value's destructor runs during unwinding.
- Add compile-fail cases for contracts that should reject invalid programs, including macro input and typestate misuse.

Use tools already available to the project. Keep unsupported paths and untested assumptions explicit in the result.
Stress tests can expose races but do not replace a correct ownership or memory-ordering argument.
