# Use scoped threads for work that borrows local data

Use a thread scope when all child work must finish before the enclosing operation returns.
The scope can then let threads borrow data owned by the caller.

## Bad

```rust
fn parallel_sum(values: &[u32]) -> u64 {
    let owned = values.to_vec();
    std::thread::spawn(move || owned.iter().map(|&value| u64::from(value)).sum())
        .join()
        .expect("sum worker did not panic")
}
```

This copies the input just to satisfy an independently spawned thread's lifetime.

## Good

```rust
fn parallel_sum(values: &[u32]) -> u64 {
    std::thread::scope(|scope| {
        let (left, right) = values.split_at(values.len() / 2);
        let left_sum = scope.spawn(move || left.iter().map(|&value| u64::from(value)).sum::<u64>());
        let right_sum: u64 = right.iter().map(|&value| u64::from(value)).sum();
        left_sum.join().expect("sum worker did not panic") + right_sum
    })
}
```

This example assumes the total fits `u64`. Use checked arithmetic when the input can exceed that range.
For small inputs, a sequential sum is simpler and can be faster than creating a thread.

- `Send` allows ownership to cross a thread boundary.
- `Sync` allows shared references to cross thread boundaries.
- Scope completion waits for child threads. It does not make their operations free of deadlocks or panics.
- Use `split_at_mut` or another safe split for independent mutable regions.
- Use a reusable pool such as Rayon for repeated CPU work.
  `par_iter` is useful when items have enough independent work.
- Preserve ordering requirements when parallelizing. Side-effect order and floating-point reduction results may change.

Use `thread_local!` with `Cell` or `RefCell` for state that belongs to each OS thread.
Do not treat thread-local state as task-local state: async tasks may move between runtime workers.
Prefer passing state explicitly when that keeps ownership clear.
