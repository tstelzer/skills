# Make names and signatures state the operation

Use Rust's naming conventions so callers can focus on behavior.

| Item | Convention | Example |
| --- | --- | --- |
| Type, trait, enum variant | `UpperCamelCase` | `HttpClient`, `ConnectionState::Ready` |
| Function, method, module, variable | `snake_case` | `read_frame`, `request_id` |
| Constant or static | `SCREAMING_SNAKE_CASE` | `MAX_FRAME_SIZE` |
| Generic parameter | Short and meaningful | `T`, `E`, `K`, `V`, `Reader` |
| Lifetime | Short relationship name | `'a`, `'src`, `'de` |

Treat acronyms as words, such as `HttpServer`. Avoid adding `-rs` or `-rust` to crate names without a reason.

## Bad

```rust
struct Buffer { bytes: Vec<u8> }

impl Buffer {
    fn get_data(&self) -> Vec<u8> {
        self.bytes.clone()
    }
}
```

The name hides a copy, and every caller must pay for owned storage.

## Good

```rust
struct Buffer { bytes: Vec<u8> }

impl Buffer {
    fn as_slice(&self) -> &[u8] {
        &self.bytes
    }

    fn into_vec(self) -> Vec<u8> {
        self.bytes
    }
}
```

| Name | Expected meaning |
| --- | --- |
| `as_*` | Cheap borrowed view or conversion |
| `to_*` | Conversion that keeps the source and may do work |
| `into_*` | Conversion that consumes the source |
| `len`, `name` | Simple property access; omit `get_` |
| `get` | Lookup that can fail, often returning `Option` |
| `is_*`, `has_*`, `can_*` | Boolean question |
| `iter`, `iter_mut`, `into_iter` | Shared, exclusive, or consuming iteration |

Name iterator types after the method, such as `Iter` or `Keys`.
Return useful values already computed during an operation when that saves callers from repeating the work.
Use `#[must_use]` for values whose silent loss would usually be a bug. Explain the reason in the attribute message.
Do not mark every return value just to create more warnings.

Keep simple parameters concrete. Add a generic bound when callers need several implementations or the algorithm
actually works over the capability. Avoid broad `Clone + Send + Sync + 'static` bounds copied onto every type.
