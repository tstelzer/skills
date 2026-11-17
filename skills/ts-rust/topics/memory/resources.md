# Tie cleanup to ownership and report fallible completion

Use guards and `Drop` for cleanup when a value leaves scope. This pattern is often called RAII.
Use an explicit operation for work that can fail, such as flushing output or committing a transaction.

## Bad

```rust
use std::io::{self, BufWriter, Write};
use std::path::Path;

fn save(path: &Path, bytes: &[u8]) -> io::Result<()> {
    let mut writer = BufWriter::new(std::fs::File::create(path)?);
    writer.write_all(bytes)?;
    Ok(())
}
```

Buffered output may still fail when it is flushed during drop. That failure cannot be returned by this function.

## Good

```rust
use std::io::{self, BufWriter, Write};
use std::path::Path;

fn save(path: &Path, bytes: &[u8]) -> io::Result<()> {
    let mut writer = BufWriter::new(std::fs::File::create(path)?);
    writer.write_all(bytes)?;
    writer.flush()
}
```

Flush reports buffered write errors; it does not by itself promise durable storage after a crash.
Use the platform's durability operations when that is part of the contract.

## Make cleanup order clear

- Struct fields drop in declaration order. Locals normally drop in reverse declaration order within their scope.
- Put dependent fields in the order their cleanup needs, and explain a non-obvious dependency.
- Use a smaller scope or explicit `drop(guard)` when a lock or resource must be released before later work.
- Commit or finish explicitly before releasing a resource needed for that operation.
- Do not use a destructor to perform fallible work whose result the caller must know.
- Ordinary `Drop` cannot await. Give async cleanup an explicit completion path.

A deeply nested chain of owned nodes can recurse during destruction and exhaust the stack.
Prefer simpler storage, or use iterative destruction that detaches each link before dropping its node.

Do not depend on destructors always running. Values can be leaked, and process abort skips ordinary cleanup.
Avoid `ManuallyDrop` and `mem::forget` in routine code.
They transfer cleanup obligations to code the compiler cannot check.
Read [unsafe boundaries](../unsafe/boundaries.md) before using them in an abstraction.
