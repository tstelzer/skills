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

## Reuse storage and setup across calls

- Keep scratch buffers where repeated work can reuse them. Clear them between uses.
- Use `clone_from` when both types support useful allocation reuse.
- Avoid formatting values before a disabled log call. Pass structured fields to the logging API.
- Reserve capacity from a known or bounded size. Do not guess a large capacity for every value.
- Avoid repeated `to_string`, `to_owned`, and `collect` calls inside a hot loop when a borrow works.

When setup is costly, offer an object that prepares it once and can run on many inputs.
For example, a searcher can prepare one pattern, then search several files.
Reset per-call progress before reusing the object. Keep prepared data that still applies to the next input.
Keep a simple function for single calls when callers need it.

Copying a small view can be useful if it releases a much larger input buffer.
Shared byte buffers and slices reduce copies but can keep their backing allocation alive.
Read [borrowing](../ownership/borrowing.md) before introducing `Cow` or shared byte storage.

Use an arena when one owner manages many values with the same lifetime.
An index-based arena can express [graph ownership](../ownership/lifetimes.md#use-offsets-or-ids-with-owned-storage).
Measure allocation cost before adopting an arena as a speed optimization.
Check how the chosen arena runs destructors and releases resources. Some bulk allocation APIs do not drop each value.
