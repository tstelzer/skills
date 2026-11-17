# Choose the serialized contract deliberately

Use Serde attributes to match the external format. Keep ordinary Rust naming inside the program.

## Bad

```rust
#[derive(serde::Serialize, serde::Deserialize)]
struct Settings {
    requestTimeout: u64,
    maxRetries: u32,
}
```

## Good

```rust
#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct Settings {
    request_timeout: u64,
    max_retries: u32,
}
```

Use `rename` for individual external names and `with` or custom field serializers for deliberate wire encodings.
Document units and formats, such as seconds versus milliseconds. A field's Rust type alone may not state them.

## Add defaults only when missing input has a meaning

### Bad

```rust
#[derive(Default, serde::Deserialize)]
#[serde(default)]
struct Endpoint {
    host: String,
    timeout_seconds: u64,
}
```

Missing required data now creates an empty host and a zero timeout.

### Good

```rust
fn default_timeout() -> u64 { 30 }

#[derive(serde::Deserialize)]
struct Endpoint {
    host: String,
    #[serde(default = "default_timeout")]
    timeout_seconds: u64,
}
```

This supplies a default for a missing field. Validate the host and numeric range through trusted construction.
An `Option` field can represent missing data; do not make every field optional to avoid a parse error.

- Use `skip_serializing_if` to omit empty values only when omission preserves the format's meaning.
- Use `deny_unknown_fields` for strict formats where a misspelled key should fail.
- Permit unknown fields when forward-compatible readers need them.
- Use `flatten` to inline a nested record or capture extra keys. Do not combine it with `deny_unknown_fields`.
- Review missing, null, and empty values as separate cases when the protocol distinguishes them.

Derived deserialization of `Option<T>` normally maps both a missing field and an explicit null to `None`.
Nesting it as `Option<Option<T>>` does not by itself keep those cases separate.
Use an explicit field-state type with custom deserialization, or a suitable adapter, when that distinction matters.

## Give variants an unambiguous representation

Prefer an explicit tag when you control the format:

```rust
#[derive(serde::Serialize, serde::Deserialize)]
#[serde(tag = "type", content = "data", rename_all = "snake_case")]
enum Event {
    Started { id: u64 },
    Stopped { reason: String },
}
```

Choose external, internal, or adjacent tagging to fit the protocol and variant shapes.
Untagged enums try alternatives and can accept an unintended shape or give poor errors. Use them for formats that need
that behavior and test ambiguous inputs.
