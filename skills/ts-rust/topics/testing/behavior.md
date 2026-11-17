# Assert the behavior that matters

Name the input or condition and the expected outcome. A successful call alone rarely proves the result is right.
This parser accepts a count with surrounding whitespace.

## Bad

```rust
fn parse_count(text: &str) -> Result<u32, std::num::ParseIntError> {
    text.trim().parse()
}

#[test]
fn test_parse() {
    let result = parse_count("42");
    assert!(result.is_ok());
}
```

## Good

```rust
fn parse_count(text: &str) -> Result<u32, std::num::ParseIntError> {
    text.trim().parse()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_count_with_surrounding_whitespace() {
        assert_eq!(parse_count(" \t42\n").unwrap(), 42);
    }

    #[test]
    fn rejects_blank_count() {
        assert!(parse_count(" \t\n").is_err());
    }
}
```

The tests cover the parser's whitespace rule and the returned value.
Test behavior your code owns. Do not repeat the standard library's test suite.

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
