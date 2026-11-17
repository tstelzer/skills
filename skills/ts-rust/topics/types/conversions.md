# Use conversion traits for their stated meaning

Implement `From` for a conversion that cannot fail and preserves the value's meaning.
Rust then provides the matching `Into` implementation.
Use `TryFrom` when input may be rejected. Use `FromStr` when parsing text should work through `.parse()`.

## Bad

```rust
struct Port(u16);

impl From<u32> for Port {
    fn from(value: u32) -> Self {
        Self(value as u16)
    }
}
```

This silently changes values that do not fit.

## Good

```rust
struct Port(u16);

impl TryFrom<u32> for Port {
    type Error = std::num::TryFromIntError;

    fn try_from(value: u32) -> Result<Self, Self::Error> {
        Ok(Self(u16::try_from(value)?))
    }
}

impl std::str::FromStr for Port {
    type Err = std::num::ParseIntError;

    fn from_str(text: &str) -> Result<Self, Self::Err> {
        text.parse().map(Self)
    }
}
```

This type permits port zero. Reject it in the constructor when the domain requires a nonzero port.

## Match the trait to the operation

| Trait | Meaning |
| --- | --- |
| `AsRef<T>` / `AsMut<T>` | Cheap access to a borrowed view |
| `Borrow<T>` | Borrow a view with matching equality, ordering, and hashing |
| `From<T>` / `TryFrom<T>` | Convert from `T`, with or without possible failure; `T` may itself be a reference |
| `Display` | Deliberate text for users |
| `Debug` | Diagnostic view for developers |
| `FromIterator<T>` / `Extend<T>` | Build a collection or add items from an iterator |
| `IntoIterator` | Iterate by value or by reference, as implemented |

Use `&str` or `&mut [T]` when a simple borrowed parameter meets the need.
Use `impl Into<String>` for a storing API when callers benefit from passing either owned or borrowed text.
Keep large generic bodies out of that convenience layer; see [build costs](../performance/builds.md).

Use `AsRef` for a view that changes equality or hashing rules.
For example, a case-insensitive key must not implement `Borrow<str>` when its comparisons differ from `str`.

Derive standard traits when their meaning fits the type. Check `Eq` and `Hash` together: equal values must hash equally.
Keep `Ord` and `PartialOrd` consistent with equality and with each other.
For an `Eq` type, cloning must produce an equal value. Do not derive `Debug` for secrets without redacting them.

Implement `Display` instead of implementing `ToString` directly. Rust supplies `ToString` for types with `Display`.
Do not promise that `Display` and `FromStr` round-trip unless the format is intended to preserve the full value.

Implement operators only when the operation has the meaning readers expect.
Implement `LowerHex`, `Binary`, or related formatting traits when callers need those views of a numeric wrapper.
Do not implement `Deref` to imitate inheritance. Reserve it for types that act like pointers or guards;
ordinary domain wrappers can use named accessors.
