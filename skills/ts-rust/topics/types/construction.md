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

This example uses Jiff. Changing October 31 to November 30 must allow setting the month first.

### Bad

```rust
use jiff::civil::{date, Date};

fn set_month(value: Date, month: i8) -> Result<Date, jiff::Error> {
    Date::new(value.year(), month, value.day())
}

assert!(set_month(date(2024, 10, 31), 11).is_err());
```

The first change tries to create November 31. It fails before the caller can set the day to 30.

### Good

```rust
use jiff::civil::date;

let original = date(2024, 10, 31);
let updated = original.with().month(11).day(30).build()?;
assert_eq!(updated, date(2024, 11, 30));
assert_eq!(original.with().day(30).month(11).build()?, updated);

# Ok::<(), jiff::Error>(())
```

Collect related changes in the builder. Check their combined validity in `build`.
Setting different fields in a different order should not cause an early failure.
Choose defaults only for values callers can safely omit.
Mark consuming builder methods `#[must_use]` when discarding the returned builder would silently lose the setting.
Do not implement `Default` when no sensible default exists.

## Carry required checks into the next state

Use typestate when the caller controls a small sequence of transitions.
Each transition consumes the old value and returns the next type.
Make a successful check produce a value required by the next operation.

```rust
struct PendingFrame { payload: Vec<u8> }
struct CheckedFrame { length: u16, payload: Vec<u8> }

impl PendingFrame {
    fn check_length(self) -> Result<CheckedFrame, std::num::TryFromIntError> {
        let length = u16::try_from(self.payload.len())?;
        Ok(CheckedFrame { length, payload: self.payload })
    }
}

impl CheckedFrame {
    fn encode(self) -> Vec<u8> {
        let mut output = self.length.to_be_bytes().to_vec();
        output.extend(self.payload);
        output
    }
}
```

Only the checked state exposes `encode`. Its payload length must stay unchanged after the check.
Keep checked fields private and let checking operations construct the value.
Each constructor or custom verifier must perform the promised check.
Carry the checked data with the proof so it cannot be reused for another input.

Use an enum for states loaded from a database or changed at runtime by another actor.
Type state does not prove an external fact is still true.
Use `PhantomData` only when a generic marker or lifetime relationship needs to be represented in a type.
Its choice affects which lifetimes Rust permits, how it checks cleanup, and whether the type can cross threads.
Do not add it just to silence an unused parameter.
