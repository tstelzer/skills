# Reuse storage when repeated allocation matters

Reserve useful capacity when the size is known. Keep scratch buffers across repeated work when their retained size is
acceptable.

## Bad

```rust
fn copy_names(target: &mut Vec<String>, source: &[String]) {
    *target = source.to_vec();
}
```

This throws away reusable storage on every update.

## Good

When the caller already has a vector, use it directly:

```rust
fn copy_names(target: &mut Vec<String>, source: &Vec<String>) {
    target.clone_from(source);
}
```

Here `&Vec<String>` is deliberate: `clone_from` can reuse vector and element storage.
For a borrowed slice, prefer the simpler form unless profiling justifies preserving each string's allocation:

```rust
fn copy_names(target: &mut Vec<String>, source: &[String]) {
    target.clear();
    target.extend(source.iter().cloned());
}
```

This keeps the vector allocation but drops the old strings and their buffers.

## Consume values without replacing the container

```rust
fn print_pending(pending: &mut Vec<String>) {
    for message in pending.drain(..) {
        println!("{message}");
    }
}
```

- `clear` drops elements and keeps capacity.
- `drain` moves elements out while retaining the collection's allocation.
- `extend` appends from an iterator. Let `collect` use an iterator's size hint when building a new collection.
- `with_capacity` reserves storage; it does not initialize elements or change length.
- Treat input-provided sizes as untrusted. Check limits before reserving memory.
- Retaining a rare huge buffer can waste memory. Choose when to shrink or replace it based on actual workload sizes.

Use stable `clear` and `extend` patterns instead of adopting version-sensitive collection APIs without checking them.
