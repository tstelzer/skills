# Make the valid states visible

Use a small wrapper type, often called a newtype, when two values have different meanings but the same representation.
Use an enum when exactly one of several states can apply.

## Bad

```rust
struct Transfer {
    source: u64,
    destination: u64,
    amount: u64,
    currency: String,
}

struct Job {
    running: bool,
    done: bool,
    output: Option<String>,
}
```

The transfer can mix IDs with amounts. The job can be running and done at once, or done without output.

## Good

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct AccountId(u64);

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct Cents(u64);

enum Currency { Eur, Usd }

struct Transfer {
    source: AccountId,
    destination: AccountId,
    amount: Cents,
    currency: Currency,
}

enum Job {
    Queued,
    Running,
    Done { output: String },
    Failed { reason: String },
}
```

Two account IDs still have the same type. Use clear parameter names or a named request struct to show their roles.
Do not create a type for every temporary value; give it a rule or meaning worth preserving.

## Choose the result shape

### Bad

```rust
fn first_line(text: &str) -> &str {
    text.lines().next().unwrap_or("MISSING")
}
```

### Good

```rust
fn first_line(text: &str) -> Option<&str> {
    text.lines().next()
}
```

- Use `Option<T>` for meaningful absence. A sentinel such as `0` or `"MISSING"` can be mistaken for real data.
- Use `Result<T, E>` when the operation can fail and the reason matters.
- Use `Result<Option<T>, E>` when a lookup can fail or succeed without finding a value.
- Use a return type of `!` for a function that never returns.
  Do not invent a dummy result after exit or an endless loop.

Return partial output with diagnostics when incomplete output is useful behavior.
For an editor, `Parse { tree, diagnostics }` can represent useful output from unfinished source.
Give partial output a type whose contract permits missing or erroneous parts.
Require a checked conversion before exposing a type that promises full validity.

Keep the fields private when callers must use a constructor to establish a rule.
Public fields suit plain records whose entire representation is part of the API.

## Preserve unknown protocol values

Preserve extensible numeric protocol values in a wrapper.
Use a separate enum when code needs to match the values this implementation recognizes.

```rust
#[derive(Clone, Copy)]
struct WireKind(u8);

enum KnownKind { Ping, Data }

impl TryFrom<WireKind> for KnownKind {
    type Error = WireKind;

    fn try_from(value: WireKind) -> Result<Self, Self::Error> {
        match value.0 {
            1 => Ok(Self::Ping),
            2 => Ok(Self::Data),
            _ => Err(value),
        }
    }
}
```

Keep an unknown number until the protocol rules say to skip or reject it.
A well-formed number can still be unsupported for an operation. Require a known variant where support is necessary.
