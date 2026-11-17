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

```rust
fn copy_names(target: &mut Vec<String>, source: &[String]) {
    source.clone_into(target);
}
```

`clone_into` copies a borrowed slice into an existing vector. It can reuse both vector and string storage.
Use `target.clone_from(source)` when the source is already a vector.
For new data from an iterator, `clear` followed by `extend` keeps vector capacity but drops the old element buffers.

## Consume values without replacing the container

```rust
fn print_pending(pending: &mut Vec<String>) {
    for message in pending.drain(..) {
        println!("{message}");
    }
}
```

- `clear` drops elements and keeps capacity.
- `Vec::drain` moves elements out while retaining the vector's allocation.
  Dropping its iterator also drops any unconsumed elements in the drained range.
- `extend` appends from an iterator. Let `collect` use an iterator's size hint when building a new collection.
- `with_capacity` reserves storage; it does not initialize elements or change length.
- Check limits on input-provided sizes before reserving memory.
  Use `try_reserve` when a capacity or allocation failure must be returned to the caller.
- Retaining a rare huge buffer can waste memory. Choose when to shrink or replace it based on actual workload sizes.

Use `retain` to filter a vector in place. It keeps elements for which the predicate returns `true`.
Use `swap_remove` for one removal when order does not matter.
