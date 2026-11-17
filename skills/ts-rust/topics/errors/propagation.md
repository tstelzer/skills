# Return expected failures and let callers decide

Use `?` when the caller should receive the failure. Handle it locally when this code owns a useful recovery action.
Do not turn failures into success-shaped defaults.

## Bad

```rust
fn read_settings(path: &std::path::Path) -> String {
    std::fs::read_to_string(path).unwrap_or_default()
}
```

A missing file, a permission error, and an empty file now look the same.

## Good

```rust
fn read_settings(path: &std::path::Path) -> std::io::Result<String> {
    std::fs::read_to_string(path)
}
```

Return the result directly when there is no more work. Use `?` when later work depends on success.

```rust
fn first_number(text: &str) -> Result<Option<u32>, std::num::ParseIntError> {
    text.lines().next().map(str::parse).transpose()
}
```

Here empty input means no number, while a malformed first line is an error.

## Handle the exact failure that permits a fallback

### Bad

```rust
fn load_or_default(path: &std::path::Path) -> String {
    std::fs::read_to_string(path).unwrap_or_else(|_| "mode=local".into())
}
```

### Good

```rust
use std::io;
use std::path::Path;

fn load_or_default(path: &Path) -> io::Result<String> {
    match std::fs::read_to_string(path) {
        Ok(text) => Ok(text),
        Err(error) if error.kind() == io::ErrorKind::NotFound => {
            Ok("mode=local".into())
        }
        Err(error) => Err(error),
    }
}
```

Use `.ok()` only when discarding the reason is part of the contract.
Use `let _ = ...` only for an intentional best-effort operation, and state why failure can be ignored.
Use `ok_or_else` and `unwrap_or_else` when a fallback is expensive and should run only when needed.
Do not add a conversion or error enum solely because a value crosses a function or module boundary.

## Define the state after failure

Returning an error with `?` does not undo earlier mutations.
Define which operations remain valid after failure.
When a failed operation must leave state unchanged, compute all fallible results before assigning the new state.

### Bad

```rust
#[derive(Debug)]
enum TransferError { InsufficientItems, DestinationFull }

fn transfer(source: &mut u32, destination: &mut u32, count: u32) -> Result<(), TransferError> {
    *source = source.checked_sub(count).ok_or(TransferError::InsufficientItems)?;
    *destination = destination.checked_add(count).ok_or(TransferError::DestinationFull)?;
    Ok(())
}
```

If the destination count would overflow, the function returns an error after removing items from the source.

### Good

```rust
#[derive(Debug)]
enum TransferError { InsufficientItems, DestinationFull }

fn transfer(source: &mut u32, destination: &mut u32, count: u32) -> Result<(), TransferError> {
    let remaining = source.checked_sub(count).ok_or(TransferError::InsufficientItems)?;
    let received = destination.checked_add(count).ok_or(TransferError::DestinationFull)?;
    *source = remaining;
    *destination = received;
    Ok(())
}
```

For resumable operations, return or store partial progress so retries do not repeat completed work.
When further processing would violate the protocol, store a terminal failure before returning the error.
Make later processing calls reject work before mutation or output.
Keep documented cleanup operations available and preserve the original error for later reporting.
Test the next call after failure, including its state and output.

In unsafe code, cleanup must also remain memory-safe if a callback panics.
See [unsafe boundaries](../unsafe/boundaries.md).
