# Keep blocking lock guards out of suspension points

Finish short protected operations before `.await`. Move or clone the specific value needed for the later work.
Do not clone all state merely because a function is async.

## Bad

This uses Tokio's `time` feature.

```rust
use std::sync::Mutex;
use std::time::Duration;

async fn read_later(state: &Mutex<String>) -> String {
    let guard = state.lock().expect("state lock is not poisoned");
    tokio::time::sleep(Duration::from_millis(10)).await;
    guard.clone()
}
```

The task keeps a blocking mutex guard while suspended. Other tasks may block a runtime worker waiting for it.

## Good

This version needs a snapshot from before the wait.

```rust
use std::sync::Mutex;
use std::time::Duration;

async fn read_later(state: &Mutex<String>) -> String {
    let snapshot = {
        let guard = state.lock().expect("state lock is not poisoned");
        guard.clone()
    };
    tokio::time::sleep(Duration::from_millis(10)).await;
    snapshot
}
```

If the caller needs current data after the wait, acquire the lock after awaiting instead.
Moving a lock changes what can happen between operations; preserve the required consistency.

- A synchronous mutex suits short operations with low contention when no guard crosses `.await`.
- A Tokio mutex is designed to allow its guard across `.await`. Use that when a resource needs exclusive async access.
- An async mutex avoids blocking while waiting for the lock. It does not make long critical sections cheap.
- Consider one task owning an async resource and accepting [messages](./channels.md) when that clarifies access.
- Avoid calling user callbacks or acquiring another lock while holding a guard without an ordering rule.
- Release `RefCell`, `RwLock`, and `watch` borrow guards before unrelated async work too.

Cloning `Arc` creates another owner of the same state; it does not create a snapshot or remove the need for locking.
Borrowing across `.await` is valid when the borrow and future lifetimes allow it. There is no rule to clone before every
suspension point.
