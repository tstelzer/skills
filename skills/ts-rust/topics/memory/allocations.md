# Write into the storage you already have

Avoid creating an owned temporary only to copy it into another owned buffer.
Use string literals for fixed text, `push_str` for text, and `write!` for formatted values.

## Bad

```rust
fn append_record(output: &mut String, id: u64, name: &str) {
    output.push_str(&format!("{id}:{name}\n"));
}
```

## Good

```rust
use std::fmt::Write;

fn append_record(output: &mut String, id: u64, name: &str) {
    writeln!(output, "{id}:{name}").expect("writing these values to String succeeds");
}
```

The formatting above uses standard integer and string formatting into `String`.
For a general formatter or fallible I/O writer, propagate the write error instead of assuming success.

## Reuse where repeated work warrants it

- Keep scratch buffers at the scope that repeats the work. Clear them between uses.
- Use `clone_from` when both types support useful allocation reuse.
- Avoid formatting values before a disabled log call. Pass structured fields to the logging API.
- Reserve capacity from a known or bounded size. Do not guess a large capacity for every value.
- Avoid repeated `to_string`, `to_owned`, and `collect` calls inside a hot loop when a borrow works.

Copying a small view can be useful if it releases a much larger input buffer.
Shared byte buffers and slices reduce copies but can keep their backing allocation alive.
Read [borrowing](../ownership/borrowing.md) before introducing `Cow` or shared byte storage.

Use an arena when many values share a clear lifetime and measurements show allocation cost matters.
Check how the chosen arena runs destructors and releases resources. Some bulk allocation APIs do not drop each value.
Do not use an arena to avoid deciding who owns data.
