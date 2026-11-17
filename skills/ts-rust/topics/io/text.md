# Choose bytes or text before parsing

`String` and `str` contain valid UTF-8. `Vec<u8>` and `[u8]` can contain arbitrary bytes.
A byte offset is not a character count.

## Bad

```rust
fn first_character(text: &str) -> &str {
    &text[..1]
}
```

This panics for empty input and for a first character that needs more than one byte, such as `é`.

## Good

```rust
fn first_character(text: &str) -> Option<char> {
    text.chars().next()
}

assert_eq!(first_character("éclair"), Some('é'));
assert_eq!(first_character(""), None);
```

| Operation | What it counts or returns |
| --- | --- |
| `text.len()` | Bytes |
| `text.bytes()` | UTF-8 bytes |
| `text.chars()` | Unicode scalar values, each represented by a Rust `char` |
| `text.char_indices()` | Byte offsets paired with `char` values |
| `text.get(start..end)` | A slice, or `None` for invalid bounds or a split UTF-8 character |

One visible character can contain several `char` values, such as a letter followed by a combining accent.
Use Unicode grapheme segmentation when cursor movement or truncation must follow visible characters.

Use byte operations for byte protocols and validated ASCII input.
Use `char_indices` when a text parser needs offsets it can later use to slice the original text.
Keep one iterator for traversal. Repeatedly calling `chars().nth(index)` starts a new scan each time.

## Reject invalid encoding when exact data matters

### Bad

```rust
fn decode(bytes: &[u8]) -> String {
    String::from_utf8_lossy(bytes).into_owned()
}
```

Lossy decoding replaces invalid bytes. A parser can no longer tell that the input was malformed.

### Good

```rust
fn decode(bytes: &[u8]) -> Result<&str, std::str::Utf8Error> {
    std::str::from_utf8(bytes)
}
```

Use `String::from_utf8` when the caller can give up an owned byte buffer.
Use lossy decoding for display only when replacement characters are acceptable.
Do not use unchecked UTF-8 conversion to skip validation of external input.

Trim, normalize, or change case only when the format requires it. These operations change the value.
Rust string equality compares the stored text; it does not apply Unicode normalization.

## Keep unused input visible

Return the unused input from a parser that reads one value at the start.
For example, read `42` from `42ms` and return `ms` as the unused input.

Use a separate function for callers that need to parse the whole input.
Reject leftover bytes that the format does not allow. A parser that expects only a number must reject `42ms`.
Skip trailing whitespace only when the format permits it.
Test a valid value followed by junk. Also test a valid prefix followed by the next field.
