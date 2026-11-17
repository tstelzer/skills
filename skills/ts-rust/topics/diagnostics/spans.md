# Attach spans to async work, not to a suspended thread scope

A span groups events for an operation. A synchronous entered-span guard stays active while it exists,
which can attribute unrelated work incorrectly if held across `.await`.

## Bad

```rust
async fn pause_request(request_id: u64) {
    let span = tracing::info_span!("request", request_id);
    let _entered = span.enter();
    tokio::time::sleep(std::time::Duration::from_millis(10)).await;
}
```

## Good

This uses `tracing` instrumentation and Tokio's time support.

```rust
use tracing::Instrument;

async fn pause_request(request_id: u64) {
    async {
        tokio::time::sleep(std::time::Duration::from_millis(10)).await;
    }
    .instrument(tracing::info_span!("request", request_id))
    .await;
}
```

Use `#[tracing::instrument]` when function instrumentation is clearer.
Start with `skip_all` for functions whose arguments may be large or sensitive, then add safe fields explicitly.

```rust
#[tracing::instrument(skip_all, fields(request_id = request_id))]
async fn handle(request_id: u64, body: &[u8]) -> usize {
    body.len()
}
```

Instrument spawned futures explicitly when their events should carry the parent's context.
Use a synchronous entered guard for synchronous work that does not suspend.
Keep high-volume spans and formatting out of measured inner loops unless that visibility is worth the cost.
