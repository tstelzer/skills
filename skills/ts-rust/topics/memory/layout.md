# Trade allocation cost against the size of each value

Measure type sizes and common collection lengths before changing representation.
An optimization that removes allocations may make every object larger.

## Bad

```rust
enum Message {
    Ping,
    Snapshot([u8; 8192]),
}
```

For a large collection of mostly `Ping` values, each enum still needs space for its largest variant.

## Good

```rust
enum Message {
    Ping,
    Snapshot(Box<[u8; 8192]>),
}
```

This makes the enum smaller but allocates for snapshots and adds pointer access.
Keep inline data when snapshots dominate or allocation cost matters more than enum size.

| Storage choice | Useful when | Check |
| --- | --- | --- |
| `Box<[T]>` | Heap length is fixed after construction | Need for later growth |
| `Box<str>` | Owned text will not grow | Convert with `String::into_boxed_str`; spare capacity is discarded |
| `SmallVec` | Most sequences fit a small inline capacity | Larger container size and spill frequency |
| `ArrayVec` | Capacity is a hard bound and heap use is unwanted | Fallible insertion and overflow behavior |
| Compact string types | Many stored strings are short | Object size, conversions, and actual length distribution |
| `ThinVec` | Many stored vectors are empty | Extra indirection and crate-specific representation |
| Smaller integers | The real range is small | Conversion checks and target layout |

These crates are options to measure, not default dependencies.
Use `Vec` and `String` until a real cost justifies the added API and representation rules.

Group data that is read together. For a loop that reads one field from many large records, separate field arrays may
help cache use. They also make updates and keeping indexes aligned harder.

Use `size_of` and alignment checks to inspect a target's layout. Add a size assertion only for a justified size budget
and state which targets it covers.
Rust's default field layout is not a stable declaration-order contract.
`repr(C)` and `repr(transparent)` are layout tools, not general speed annotations.
