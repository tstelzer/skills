# Assert the behavior that matters

Name the input or condition and the expected outcome. A successful call alone rarely proves the result is right.

## Bad

```rust
#[test]
fn test_parse() {
    let result = "42".parse::<u32>();
    assert!(result.is_ok());
}
```

## Good

```rust
#[test]
fn parses_decimal_count() {
    assert_eq!("42".parse::<u32>().unwrap(), 42);
}

#[test]
fn rejects_negative_count() {
    assert!("-1".parse::<u32>().is_err());
}
```

These examples show assertion shape. In project tests, call the project's parser rather than retesting `str::parse`.

- Put tests needing private items in a nearby `#[cfg(test)] mod tests` module. `use super::*` is useful there.
- Put public API tests in `tests/` when they should behave like external consumers.
- Keep setup, action, and assertion easy to distinguish without comments on every obvious line.
- Assert a specific error variant when it is part of the contract.
- Use `#[should_panic(expected = "...")]` for an intentional panic contract, not an expected input error.
- Prefer `unwrap` or `expect` in a test to silently ignoring a setup failure.

## Keep fixtures owned by the test

Use guards or temporary directories to release resources on ordinary scope exit.
Avoid shared filenames, global mutable state, and fixed ports that make parallel tests interfere.
Use unique resources and explicit completion checks.
Cleanup that can fail may need an explicit step before the guard's fallback cleanup.

Use a small fake when a test needs control over a dependency's behavior.
Use traits or a mocking crate such as `mockall` when a real dependency boundary needs that flexibility.
Do not introduce production abstraction layers only to count private method calls.
Keep integration evidence for behavior a fake cannot prove, such as actual protocol or storage semantics.
