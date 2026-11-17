# Separate a constant value from shared storage

Use `const` for a named value.
Use `static` when one shared storage location is the requirement.
Do not assume either form wins a performance comparison without measuring it.

## Bad

This shared counter has no synchronization contract.

```rust,ignore
static mut REQUESTS: usize = 0;

fn record_request() {
    unsafe { REQUESTS += 1; }
}
```

## Good

```rust
use std::sync::atomic::{AtomicUsize, Ordering};

const MAX_BATCH: usize = 64;
static REQUESTS: AtomicUsize = AtomicUsize::new(0);

fn record_request() {
    REQUESTS.fetch_add(1, Ordering::Relaxed);
}
```

This is an independent statistic, with wrapping behavior if it reaches the integer limit.
It publishes no other state. Read [atomic ordering](../concurrency/synchronization.md) for other contracts.

| Need | Tool |
| --- | --- |
| Named compile-time value | `const` |
| One shared storage location | `static` |
| Value initialized once when first used | `LazyLock<T>` |
| Value supplied once later | `OnceLock<T>` |
| State owned by each thread | `thread_local!` |

A `const` does not promise one stable address. A `const` containing a string literal can still hold a `&'static str`.
For mutable shared state, put synchronization inside the static rather than using `static mut`.
Keep explicit dependencies instead of adding a global merely to shorten argument lists.

## Allow compile-time evaluation where callers need it

```rust
const fn header_size(fields: usize) -> Option<usize> {
    fields.checked_mul(4)
}

const HEADER_BYTES: Option<usize> = header_size(3);
```

`const fn` permits compile-time calls; it does not force all calls to run at compile time or make runtime calls faster.
Use inline `const { ... }` for local compile-time values or checks when supported by the project's compiler.

Use const generics when a value is part of a type's shape, such as `Buffer<const N: usize>` containing `[u8; N]`.
Use an ordinary field when the value changes at runtime. Many const-generic instantiations can increase generated code.
Check which expressions the compiler permits in const contexts before building an API around them.
