# Borrow only what the function needs

Use `&T` for reading and `&mut T` for exclusive access. Take `T` when the function needs ownership.
Cloning to read a value adds work and hides what the function needs.

## Bad

```rust
fn word_count(text: &String) -> usize {
    let copy = text.clone();
    copy.split_whitespace().count()
}
```

## Good

```rust
fn word_count(text: &str) -> usize {
    text.split_whitespace().count()
}
```

Use borrowed views when the owning container adds no useful capability.

| Need | Parameter |
| --- | --- |
| Read text | `&str` |
| Read a sequence | `&[T]` |
| Change existing elements | `&mut [T]` |
| Grow, shrink, or replace a vector | `&mut Vec<T>` |
| Read a filesystem path | `&Path` |
| Store text or a sequence | `String` or `Vec<T>` |

A borrowed view avoids requiring one storage type. It does not make every operation on the view free.
Use `AsRef` only when accepting several input types improves actual call sites.

## Borrow values inside `Option` and `Result`

Use `as_ref` or `as_mut` to work through a borrow of the contained value.
Use `as_deref` to turn `Option<String>` into `Option<&str>` without copying its text.

### Bad

```rust
fn has_name(name: &Option<String>) -> bool {
    name.clone().is_some_and(|text| !text.is_empty())
}
```

### Good

```rust
fn has_name(name: Option<&str>) -> bool {
    name.is_some_and(|text| !text.is_empty())
}

let name = Some(String::from("Ada"));
assert!(has_name(name.as_deref()));
```

The caller keeps its owned value. The function accepts a borrowed name from any storage type.

## Borrow until a change needs a new value

Use `Cow` when the usual result can borrow from the input and another path needs owned storage.

### Bad

```rust
fn unix_lines(text: &str) -> String {
    text.replace("\r\n", "\n")
}
```

This allocates even when no line ending changes.

### Good

```rust
use std::borrow::Cow;

fn unix_lines(text: &str) -> Cow<'_, str> {
    if text.contains("\r\n") {
        Cow::Owned(text.replace("\r\n", "\n"))
    } else {
        Cow::Borrowed(text)
    }
}
```

Keep a plain `String` return when callers always need owned text.
Use slices for borrowed bytes. Consider shared byte storage such as `Bytes` only when buffers need separate owners.
Borrowing part of a buffer can keep the whole buffer alive; copying a small result can use less memory overall.
