# Compare floats using the meaning of the value

Arithmetic can round. NaN and infinity need explicit treatment when the domain rejects them.
An exact comparison and an approximate comparison answer different questions.

## Bad

```rust
fn close_enough(actual: f64, expected: f64) -> bool {
    actual == expected
}

fn sort_values(values: &mut [f64]) {
    values.sort_by(|left, right| left.partial_cmp(right).unwrap());
}
```

Rounded results may differ, and `partial_cmp` returns `None` for comparisons involving NaN.

## Good

This helper is for finite values. Its caller chooses a finite, nonnegative absolute tolerance and a relative tolerance
between zero and one.

```rust
fn close_enough(actual: f64, expected: f64, absolute: f64, relative: f64) -> bool {
    if !actual.is_finite() || !expected.is_finite() {
        return false;
    }
    let difference = (actual - expected).abs();
    difference.is_finite()
        && difference <= absolute.max(relative * actual.abs().max(expected.abs()))
}

fn sort_values(values: &mut [f64]) {
    values.sort_by(f64::total_cmp);
}
```

Pick tolerances from the acceptable error and scale. Machine epsilon alone is not a universal tolerance.
The finite-difference check rejects subtraction that overflows. Test extreme magnitudes in numeric algorithms.

- Use `is_nan`, `is_infinite`, or `is_finite` to express the domain check.
- Exact equality can be right for a sentinel such as zero or a deliberately exact stored value.
- `==` is not bit equality: positive and negative zero compare equal, while NaN does not equal itself.
- Use `to_bits` when the bit pattern itself is the contract.
- `total_cmp` provides an order that includes NaNs and distinguishes signed zero. It does not reject invalid input.
- Do not assume all NaNs sort last. Their sign affects the total order.

Choose a domain-specific representation when binary floating point cannot meet the required arithmetic contract.
