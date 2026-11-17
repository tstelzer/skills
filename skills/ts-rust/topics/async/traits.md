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

Ordinary native async methods do not directly provide a `dyn Trait` interface in the supplied reference baseline.
For dynamic dispatch, a method can return a boxed future, or the project can use a suitable macro such as `async_trait`.
Account for the allocation and lifetime requirements.
Do not assume generating a `Send` variant also generates a dynamically callable boxed-future interface.

## Match callback bounds to captured borrows

For supported compilers, the `AsyncFn`, `AsyncFnMut`, and `AsyncFnOnce` family can express async callbacks whose futures
borrow from the callback or its arguments.

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
