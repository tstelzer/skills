# Pin futures when the API needs a stable address

Some futures keep references into their own stored state after polling starts.
`Pin` lets code rely on those values staying at the same address until they are dropped.
`Unpin` means a type does not need that restriction. It does not mean the type cannot be pinned.

Ordinary `.await` handles pinning for you. Pin explicitly when storing a future behind `dyn Future` or passing a
borrowed future to an API that needs it.

## Bad

This API needs an owned trait object, but an ordinary box does not provide the required pinning.

```rust,compile_fail
use std::future::Future;

fn answer(value: u32) -> Box<dyn Future<Output = u32>> {
    Box::new(async move { value })
}

async fn read_answer() -> u32 {
    answer(42).await
}
```

`Box<F>` implements `Future` only when `F` is also `Unpin`.
A `dyn Future` does not promise that bound.

## Good

```rust
use std::future::Future;
use std::pin::Pin;

fn answer(value: u32) -> Pin<Box<dyn Future<Output = u32>>> {
    Box::pin(async move { value })
}

async fn read_answer() -> u32 {
    answer(42).await
}
```

Use `async fn` or `impl Future` when the caller does not need a trait object.
Add `Send` only when the caller needs to move the future between threads.
Give the trait object a lifetime such as `+ '_` when it borrows from an input.

## Keep pinning separate from ownership

- Use `std::pin::pin!` or `tokio::pin!` to pin a local future without allocating a box.
- Use `Box::pin` when the pinned value needs owned heap storage.
- Moving a `Pin<Box<T>>` handle does not move its heap value.
- Pinning does not extend borrowed data's lifetime or make a future `Send`.
- Do not add `Unpin` bounds just to silence an error. They can reject ordinary async blocks.
- Do not use unchecked pinning or hand-written field projection in routine code.
  Code that exposes pinned fields must preserve their address and drop rules.

See [cancellation](./cancellation.md) for keeping one pinned read across several `select!` calls.
Pinning does not prevent cancellation or roll back work.

Use async blocks and existing adapters before implementing `Future` yourself.
A custom `poll` method must return promptly. Before returning `Pending`, arrange for the current task's waker to be
notified when progress becomes possible. Do not poll a completed future again unless its API permits it.
