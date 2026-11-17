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
The defining module and its descendants can still write private fields. Keep that code subject to the same rule.

## Keep construction as simple as the options allow

Use a constructor for a few required inputs. A named options struct may be enough for optional settings.
Use a builder when callers need several steps to choose fields that must be checked together.

This standard-library builder opens a file for appending and creates it when missing.

```rust
use std::fs::{File, OpenOptions};
use std::io;
use std::path::Path;

fn open_log(path: &Path) -> io::Result<File> {
    OpenOptions::new().create(true).append(true).open(path)
}
```

`create(true)` needs write or append access. `OpenOptions` checks that combination in `open`, so either setter
can come first. Check related fields together in the builder's final operation, such as `build` or `open`.
Choose defaults only for values callers can safely omit.
Mark consuming builder methods `#[must_use]` when discarding the returned builder would silently lose the setting.
Implement `Default` when one valid default makes sense. Keep an argument-free `new() -> Self` consistent with it.
Write `Default` by hand when the fields' own defaults would produce the wrong values.

## Add state types when operations need distinct stages

Keep cheap derived values local to the operation. This frame checks its payload length when encoding.

```rust
struct Frame { payload: Vec<u8> }

impl Frame {
    fn encode(self) -> Result<Vec<u8>, std::num::TryFromIntError> {
        let length = u16::try_from(self.payload.len())?;
        let mut output = length.to_be_bytes().to_vec();
        output.extend(self.payload);
        Ok(output)
    }
}
```

Use typestate when callers need a sequence of distinct operations.
Each transition consumes the old value and returns the next type.
For example, `connect` can consume a `Disconnected` value and return a `Connected` value that owns the socket.
Only `Connected` exposes `send`. Keep its fields private so callers must use the transition to construct it.

Use an enum for states loaded from a database or changed at runtime by another actor.
Typestate does not prove an external fact is still true.
Use `PhantomData` only when a generic marker or lifetime relationship needs to be represented in a type.
Its choice affects which lifetimes Rust permits, how it checks cleanup, and whether the type can cross threads.
Do not add it just to silence an unused parameter.
