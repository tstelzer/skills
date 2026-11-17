# Keep the main path flat

Use `?` to pass through failure or absence. Use `let ... else` when a missing pattern needs an early exit.
Use `match` when several outcomes need different work.

## Bad

```rust
fn double_positive(text: Option<&str>) -> Option<u32> {
    if let Some(text) = text {
        if let Ok(value) = text.parse::<u32>() {
            if value > 0 {
                return value.checked_mul(2);
            }
        }
    }
    None
}
```

## Good

```rust
fn double_positive(text: Option<&str>) -> Option<u32> {
    let value = text?.parse::<u32>().ok()?;
    if value == 0 {
        return None;
    }
    value.checked_mul(2)
}
```

This contract deliberately treats malformed, absent, and out-of-range input as no result.
Return a typed error when callers need to tell them apart.

For per-item skips, make the exit local:

```rust
fn print_assignments(lines: &[String]) {
    for line in lines {
        let Some((key, value)) = line.split_once('=') else {
            continue;
        };
        println!("{key}: {value}");
    }
}
```

## Match your own enums exhaustively

### Bad

```rust
enum State { Queued, Running, Done }

fn label(state: State) -> &'static str {
    match state {
        State::Done => "done",
        _ => "waiting",
    }
}
```

The wildcard hides `Running` and any future state.

### Good

```rust
enum State { Queued, Running, Done }

fn label(state: State) -> &'static str {
    match state {
        State::Queued => "waiting",
        State::Running => "working",
        State::Done => "done",
    }
}
```

Use a wildcard when all remaining cases intentionally share one meaning, or when a foreign non-exhaustive enum needs it.
Use `matches!` for a boolean pattern test. Use `@` to keep a matched value, such as `port @ 1..=1024`.
Use `if let` for one case.
Let chains combine bindings and tests on Rust 1.88 or newer with the 2024 edition.
Do not compress several branches into combinators that make side effects hard to see.
