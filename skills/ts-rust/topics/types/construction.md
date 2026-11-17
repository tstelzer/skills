# Construct a value that already meets its rules

Parse external values into trusted types. A separate `is_valid` call leaves later code holding the unchecked value.

## Bad

```rust
struct Username(pub String);

fn valid_username(text: &str) -> bool {
    !text.trim().is_empty()
}
```

Any caller can construct an empty name or forget the check.

## Good

```rust
#[derive(Debug, PartialEq, Eq)]
pub struct Username(String);

#[derive(Debug, PartialEq, Eq)]
pub struct EmptyUsername;

impl TryFrom<String> for Username {
    type Error = EmptyUsername;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        if value.trim().is_empty() {
            return Err(EmptyUsername);
        }
        Ok(Self(value))
    }
}

impl Username {
    pub fn as_str(&self) -> &str {
        &self.0
    }
}
```

Keep later mutation from breaking the same rule. Deserialization and alternate constructors must also enforce it.
Private fields protect callers outside the defining module; code inside that module still has to follow the rule.

## Keep construction as simple as the options allow

Use a constructor for a few required inputs. Use a builder when optional settings make calls hard to read.

### Bad

```rust
fn connect(host: &str, tls: bool, retry: bool, timeout_ms: u64) {
    // Connection setup omitted.
}

connect("example.test", true, false, 500);
```

### Good

```rust
use std::time::Duration;

struct ConnectOptions {
    tls: bool,
    retry: bool,
    timeout: Duration,
}

let options = ConnectOptions {
    tls: true,
    retry: false,
    timeout: Duration::from_millis(500),
};
```

A named options struct may be enough.
A builder should provide valid defaults and report invalid combinations in `build`.
Mark consuming builder methods `#[must_use]` when discarding the returned builder would silently lose the setting.
Do not implement `Default` when no sensible default exists.

## Encode a short protocol with types

Use typestate when the caller controls a small sequence of transitions.
Each transition consumes the old value and returns the next type.

```rust
struct Draft { text: String }
struct Published { text: String }

impl Draft {
    fn publish(self) -> Published {
        Published { text: self.text }
    }
}

impl Published {
    fn text(&self) -> &str { &self.text }
}
```

Use an enum for states loaded from a database or changed at runtime by another actor.
Type state does not prove an external fact is still true.
Use `PhantomData` only when a generic marker or lifetime relationship needs to be represented in a type.
Its choice affects which lifetimes Rust permits, how it checks cleanup, and whether the type can cross threads.
Do not add it just to silence an unused parameter.
