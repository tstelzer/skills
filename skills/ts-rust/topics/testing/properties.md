# Test a rule across many inputs

Use a property when one statement should hold for a whole input range.
Choose a rule that can catch a defect, such as preserving values, ordering, or agreement with a simpler implementation.

## Bad

```rust
#[test]
fn sorts_one_list() {
    let mut values = vec![3, 1, 2];
    values.sort();
    assert_eq!(values, vec![1, 2, 3]);
}
```

One list alone gives little coverage for a custom sorting implementation.

## Good

This uses `proptest` to show the property shape. Replace the standard sort call with the project operation under test.

```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn sorting_preserves_values(mut values in proptest::collection::vec(any::<i32>(), 0..256)) {
        let mut expected = values.clone();
        expected.sort_unstable();
        values.sort();
        prop_assert_eq!(&values, &expected);
        prop_assert!(values.windows(2).all(|pair| pair[0] <= pair[1]));
    }
}
```

Keep useful example tests too. A generated test needs a correct rule and input strategy.
Include empty inputs, limits, duplicates, and invalid forms where they matter.
Save failing cases as regression tests after fixing the cause.

## Fuzz the boundary directly

Use fuzzing for parsers and stateful APIs with many possible inputs.
Call the operation without booting the whole service when that operation can stand alone.

- Feed arbitrary bytes to byte parsers.
- Generate structured inputs when random bytes mostly fail before reaching useful behavior.
- Generate command sequences for stateful APIs.
- Compare a complex implementation against a simple reference when both should agree.
- Check round trips, but also test known external examples; matching encoder and decoder bugs can pass a round trip.
- Record the feature and build variants exercised by the target.

Use snapshots for complex output that humans can review clearly.
Remove irrelevant nondeterminism and review snapshot changes; do not accept them just to make a test pass.
Property tests, fuzzing, and snapshots all need a meaningful expected result. None proves correctness by itself.
