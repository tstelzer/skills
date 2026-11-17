# Panic for broken assumptions, return expected failures

Ask why failure is possible. Invalid user input, unavailable files, and network failures belong in `Result`.
A violated internal rule can justify a panic when continuing would be wrong.

## Bad

```rust
fn parse_count(text: &str) -> usize {
    text.parse().expect("could not parse count")
}
```

Changing `unwrap` to `expect` does not make expected failure safe to ignore.

## Good

```rust
fn parse_count(text: &str) -> Result<usize, std::num::ParseIntError> {
    text.parse()
}
```

## State the assumption behind an invariant panic

```rust
fn first_after_insert(values: &mut Vec<u32>, value: u32) -> u32 {
    values.push(value);
    *values.first().expect("values contains the item just inserted")
}
```

Prefer code that makes the assumption obvious or removes the need to check it.
An `expect` message should explain what should have been true, not merely say an operation failed.
Do not build a costly message with `format!` on every successful call.

- `unwrap` is reasonable in tests when a failure should fail the test. Add context when diagnosis needs it.
- Document public preconditions and panic cases.
- Do not turn a broken internal rule into a recoverable business outcome just to avoid a panic.
- A panic may unwind or abort, depending on the build and platform. Do not rely on catching it for normal control flow.
- Avoid panicking in `Drop`. A second panic during unwinding can abort the process.
- Catching a panic does not repair partially changed state. Design [panic-safe mutation](../unsafe/boundaries.md).

When reviewing `unwrap` or indexing, identify the assumption and the code that establishes it.
A blanket ban can hide the real contract behind more code without improving it.
