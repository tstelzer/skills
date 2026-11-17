# Move, copy, or share on purpose

Move a value when the old owner is done with it. Clone when both owners need a value.
`Clone` can copy data, allocate storage, or share an allocation. Read what the type's clone means.

## Bad

```rust
fn append_names(target: &mut Vec<String>, names: Vec<String>) {
    target.extend(names.iter().cloned());
}
```

## Good

```rust
fn append_names(target: &mut Vec<String>, names: Vec<String>) {
    target.extend(names);
}
```

The caller gave away `names`. Move its strings instead of cloning them before discarding the originals.

- Implement `Copy` for small values whose implicit copies match their meaning, such as an ID or coordinate.
- Keep `Clone` explicit for owned buffers and other values with meaningful copy cost.
- Use `Arc::clone(&value)` or `Rc::clone(&value)` to make shared ownership visible.
- A move does not run `Clone`. It can still move bytes; the compiler may remove that work.
- Box a large value only when ownership, stack use, or measured move cost warrants the allocation.

## Move out of a mutable field

Use `mem::take`, `mem::replace`, or `Option::take` to leave a valid replacement behind.

### Bad

```rust
fn take_pending(pending: &mut Vec<String>) -> Vec<String> {
    let batch = pending.clone();
    pending.clear();
    batch
}
```

### Good

```rust
fn take_pending(pending: &mut Vec<String>) -> Vec<String> {
    std::mem::take(pending)
}
```

`take` moves the old allocation to the result. The empty replacement does not keep its capacity.
Use `drain(..)` when consuming elements while keeping the original vector's storage is useful.
Use `replace` when the replacement should be a specific value rather than `Default::default()`.

Do not remove a clone that gives a task its own snapshot or separates two independently changing values.
Change the ownership contract first if that copy is the real problem.
