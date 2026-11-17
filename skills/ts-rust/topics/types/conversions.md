# Use conversion traits for their stated meaning

Implement `From` for an infallible, meaningful conversion. Rust then provides the matching `Into` implementation.
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
| `From<T>` / `TryFrom<T>` | Convert an owned input, with or without possible failure |
| `Display` | Deliberate text for users |
| `Debug` | Diagnostic view for developers |
| `FromIterator<T>` / `Extend<T>` | Build a collection or add items from an iterator |
| `IntoIterator` | Iterate by value or by reference, as implemented |

Use `&str` or `&mut [T]` when a simple borrowed parameter meets the need.
Use `impl Into<String>` for a storing API when callers benefit from passing either owned or borrowed text.
Keep large generic bodies out of that convenience layer; see [build costs](../performance/builds.md).

Derive standard traits when their meaning fits the type. Check `Eq` and `Hash` together: equal values must hash equally.
Keep ordering consistent with equality. Do not derive `Debug` for secrets without redacting their contents.

Implement operators only when the operation has the meaning readers expect.
Implement `LowerHex`, `Binary`, or related formatting traits when callers need those views of a numeric wrapper.
Do not implement `Deref` to imitate inheritance. Reserve it for types that act like pointers or guards;
ordinary domain wrappers can use named accessors.
