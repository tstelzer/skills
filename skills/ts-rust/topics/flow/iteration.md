# Traverse values directly and collect only when needed

Use iterators for transformations and direct loops for stateful work or several side effects.
Iterator adapters are lazy: creating an iterator does not consume it.

## Bad

```rust
fn total_lengths(names: &[String]) -> usize {
    let lengths: Vec<usize> = names.iter().map(|name| name.len()).collect();
    let mut total = 0;
    for index in 0..lengths.len() {
        total += lengths[index];
    }
    total
}
```

## Good

```rust
fn total_lengths(names: &[String]) -> usize {
    names.iter().map(String::len).sum()
}
```

Use `enumerate` when an index matters. Use `windows`, `chunks`, or `split` when the work follows groups of elements.
Use `iter`, `iter_mut`, and `into_iter` to show whether the loop borrows, mutates, or consumes items.

`zip` stops at the shorter input. Check equal lengths first when silently dropping a tail would be wrong.
Direct indexing suits algorithms that need random access; prove the bounds or use `get` for expected absence.

## Do not lose errors in a pipeline

### Bad

```rust
fn parse_counts(lines: &[&str]) -> Vec<u32> {
    lines.iter().filter_map(|line| line.parse().ok()).collect()
}
```

This silently discards malformed records when every record is required.

### Good

```rust
fn parse_counts(lines: &[&str]) -> Result<Vec<u32>, std::num::ParseIntError> {
    lines.iter().map(|line| line.parse()).collect()
}
```

Collecting `Result` stops at the first error. Use `try_fold` or a loop when later work needs an accumulated result.
Use `filter_map` when skipping missing or invalid items is the intended behavior.

- Keep intermediate values as iterators until a caller needs storage or repeated access.
- Collect when it clarifies ownership or avoids repeating expensive work.
- Prefer a plain `for` loop over `map` used only for side effects.
- Do not ban `chain` or force iterators for speed. Measure the actual hot loop.
