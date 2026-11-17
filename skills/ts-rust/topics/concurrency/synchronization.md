# Protect the whole rule with one synchronization contract

Use a mutex for several values that must change together.
An atomic operation protects one operation on one value; it does not automatically make a multi-step decision atomic.

## Bad

```rust
use std::sync::atomic::{AtomicUsize, Ordering};

fn take_one(stock: &AtomicUsize) -> bool {
    if stock.load(Ordering::SeqCst) > 0 {
        stock.fetch_sub(1, Ordering::SeqCst);
        true
    } else {
        false
    }
}
```

Two threads can both see one remaining item before either subtracts. Stronger ordering does not combine the steps.

## Good

```rust
use std::sync::Mutex;

fn take_one(stock: &Mutex<usize>) -> bool {
    let mut stock = stock.lock().expect("stock lock is not poisoned");
    if *stock == 0 {
        return false;
    }
    *stock -= 1;
    true
}
```

The example treats a poisoned lock as a broken internal assumption.
Choose a deliberate recovery policy; do not blindly take poisoned state whose rules may have been broken.
Poisoning does not record every panic. Unsafe code must stay sound even when a failed update leaves the lock unpoisoned.

Keep critical sections short. Establish a lock order when code may hold several locks.
Do not assume `RwLock` wins because reads are common. Measure read overlap, contention, and writer delays.
Reduce shared writes before adding a more complex lock.

## Use atomics only with a stated ordering reason

For an independent statistic that publishes no other data:

```rust
use std::sync::atomic::{AtomicUsize, Ordering};

fn record(counter: &AtomicUsize) {
    counter.fetch_add(1, Ordering::Relaxed);
}
```

This counter can wrap. Use a different policy when its exact lifetime total matters.

| Ordering | What it contributes |
| --- | --- |
| `Relaxed` | Atomic access, without ordering unrelated memory |
| `Release` / `Acquire` | Publish and observe surrounding work through a matching handoff |
| `AcqRel` | Acquire and release behavior in a read-modify-write operation |
| `SeqCst` | Additional ordering across sequentially consistent operations |

An acquire must observe the relevant release or its release sequence for that handoff to apply.
Explain both success and failure orderings for compare-and-exchange.
Do not weaken ordering based on one processor test or add `SeqCst` as a substitute for a correct protocol.

Threads writing separate fields on one cache line can still interfere. Partition work or use per-thread accumulation
before adding padding. Measure on the deployment hardware.
Read [concurrency testing](../testing/concurrent.md) when maintaining a custom synchronization primitive.
