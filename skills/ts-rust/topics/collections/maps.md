# Update a map through its entry

Use the entry API when an operation needs to find or create one value.
It keeps the decision and the mutation together.

## Bad

```rust
use std::collections::HashMap;

fn count(counts: &mut HashMap<String, usize>, word: String) {
    if !counts.contains_key(&word) {
        counts.insert(word.clone(), 0);
    }
    *counts.get_mut(&word).unwrap() += 1;
}
```

## Good

```rust
use std::collections::HashMap;

fn count(counts: &mut HashMap<String, usize>, word: String) {
    *counts.entry(word).or_default() += 1;
}
```

Use `or_insert_with` when creating the missing value is expensive.
Use `get` or `get_mut` for a plain lookup. A `HashMap<String, V>` can be queried with `&str` without allocating a key.

`entry` takes an owned key. When a borrowed key usually exists, allocating a `String` for every entry lookup may waste
more work than a borrowed lookup followed by insertion on a miss. Measure this case before complicating it.

## Choose hashing with the input in mind

Keep the standard hasher as the starting point.
Alternative hashers can improve some workloads, but differ in speed, collision behavior, and attack resistance.
Check whether callers can choose keys before using a hasher intended for trusted input.

Do not add a hashing dependency solely because it appears in a performance guide.
Benchmark representative keys and map sizes. Treat exact hash values and iteration order as implementation details.
