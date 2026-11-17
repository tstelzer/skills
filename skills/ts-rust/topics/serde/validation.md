# Deserialize through the same constructor rule

A private field is not enough when a derived deserializer can fill it without checking the type's rule.
Use a raw representation plus `TryFrom` to keep one construction path.

## Bad

```rust
#[derive(serde::Deserialize)]
struct NonEmptyName(String);
```

An empty string can now become a type that claims to hold a nonempty name.

## Good

```rust
#[derive(Debug, serde::Deserialize)]
#[serde(try_from = "String")]
struct NonEmptyName(String);

impl TryFrom<String> for NonEmptyName {
    type Error = &'static str;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        if value.trim().is_empty() {
            return Err("name must not be empty");
        }
        Ok(Self(value))
    }
}
```

Serde reads a string, then applies the same fallible conversion used by other callers.
For several related fields, deserialize a raw struct and validate their relationship in `TryFrom<Raw>`.

Use `#[serde(into = "Raw")]` only when its owned conversion and cloning requirements fit serialization.
A custom borrowed serializer can avoid a clone when serialization is frequent.
Use field-level `with` modules for shared format logic. They supply both `serialize` and `deserialize` functions.
Use `serialize_with` or `deserialize_with` to customize only one direction.

Test valid data, malformed data, old payloads that omit defaulted fields, and ambiguous variant shapes.
Round-trip tests alone do not prove compatibility with existing external data.
Limit input sizes before allocating large buffers or collections from untrusted serialized data.
