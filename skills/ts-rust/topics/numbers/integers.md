# Choose overflow behavior explicitly

Use checked arithmetic when an out-of-range result is an expected failure.
Do not let build settings decide the behavior of externally controlled arithmetic.

## Bad

```rust
fn byte_count(items: u64, item_size: u64) -> usize {
    (items * item_size) as usize
}
```

Multiplication can overflow, and the cast can truncate on a smaller target.

## Good

```rust
fn byte_count(items: u64, item_size: u64) -> Option<usize> {
    let bytes = items.checked_mul(item_size)?;
    usize::try_from(bytes).ok()
}
```

| Operation family | Meaning |
| --- | --- |
| `checked_*` | Return `None` when the result does not fit |
| `saturating_*` | Stop at the numeric limit |
| `wrapping_*` | Wrap using modular arithmetic |
| `overflowing_*` | Return the wrapped result and an overflow flag |

Use saturation for a quantity that should stop at a limit, such as a bounded display counter.
Do not saturate sizes, balances, or offsets when hiding overflow would change correctness.
Use wrapping arithmetic for a protocol or algorithm that requires it.

Use `From` for supported lossless conversions and `TryFrom` for conversions that can fail.
Use `as` only when the intended truncation or representation conversion is clear.
Keep units in names or [newtypes](../types/modeling.md).

## Put a numeric rule in the type

```rust
use std::num::NonZeroUsize;

fn batch_size(value: usize) -> Option<NonZeroUsize> {
    NonZeroUsize::new(value)
}
```

`NonZero` makes zero impossible after construction. Some `Option<NonZero*>` forms also have compact layout guarantees.
Use the documented guarantee for the exact type, not a guess from one `size_of` result.

Choose smaller integers when the valid range supports them and storage size matters.
Use `usize` for collection sizes and indexes; do not assume it is always 64 bits.
Use `clamp` for a deliberate range restriction. Validate that the lower bound does not exceed the upper bound.
