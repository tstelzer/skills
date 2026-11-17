# State future requirements in the API

Use native async methods for static dispatch when they meet the project's compiler and caller needs.
Decide separately whether callers need `Send` futures or dynamic dispatch.

## Bad

```rust
trait Loader: Send {
    async fn load(&self) -> String;
}
```

For callers that must spawn the returned future, `Loader: Send` alone does not promise that future is `Send`.

## Good

```rust
use std::future::Future;

trait Loader {
    fn load(&self) -> impl Future<Output = String> + Send;
}
```

An implementation that holds `&self` across suspension may need `Self: Sync` to meet the returned future's promise.
State only the bounds the implementation and callers need.
A `Send` future can still borrow data. Spawning also requires `'static`.
Move an owned loader into the spawned async block, then call and await its method inside that block.

## Return a pinned boxed future for dynamic calls

A method written as `async fn` is not dynamically callable.
For calls through `dyn Trait`, return a pinned boxed future or use a macro such as `async_trait`:

```rust
use std::future::Future;
use std::pin::Pin;

trait Loader {
    fn load(&self) -> Pin<Box<dyn Future<Output = String> + Send + '_>>;
}
```

The `'_` lets the future borrow from `self`. `Send` permits moving the future across threads.
This shape allocates for the boxed future. Read [pinning](./pinning.md) for the address guarantee it needs.
Generating a `Send` version of a native async trait does not by itself make the methods dynamically callable.

## Match callback bounds to captured borrows

On Rust 1.85 or newer, `AsyncFn`, `AsyncFnMut`, and `AsyncFnOnce` express async callbacks whose futures can borrow from
the callback or its arguments.

```rust
use std::ops::AsyncFnMut;

async fn visit_names<F>(names: &[String], mut visit: F)
where
    F: AsyncFnMut(&str),
{
    for name in names {
        visit(name).await;
    }
}
```

Use the least demanding calling bound: once, repeatedly with mutable access, or repeatedly with shared access.
Keep the explicit future form when it expresses a needed output bound clearly:

```rust
use std::future::Future;

async fn run<F, Fut>(callback: F)
where
    F: FnOnce() -> Fut,
    Fut: Future<Output = ()> + Send,
{
    callback().await;
}
```

`F: Send` and `Fut: Send` are different promises. Making the closure transferable does not prove its returned future
can cross threads. Check the project's compiler support before changing callback APIs.
