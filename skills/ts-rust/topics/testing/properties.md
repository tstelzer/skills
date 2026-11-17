# Test a rule across many inputs

Use a property when one statement should hold for a whole input range.
Choose a rule that can catch a defect, such as preserving values, ordering, or agreement with a simpler implementation.

## Bad

```rust
fn sorted_unique(mut values: Vec<i32>) -> Vec<i32> {
    values.sort_unstable();
    values.dedup();
    values
}

#[test]
fn sorts_distinct_values() {
    assert_eq!(sorted_unique(vec![3, 1, 2]), vec![1, 2, 3]);
}
```

This test still passes if duplicate removal is broken.

## Good

This uses `proptest`. The properties check that output is strictly increasing and contains exactly the input's values.

```rust
use proptest::prelude::*;
use std::collections::BTreeSet;

fn sorted_unique(mut values: Vec<i32>) -> Vec<i32> {
    values.sort_unstable();
    values.dedup();
    values
}

proptest! {
    #[test]
    fn removes_only_duplicates(values in proptest::collection::vec(-16_i32..=16, 0..128)) {
        let expected: BTreeSet<_> = values.iter().copied().collect();
        let actual = sorted_unique(values);

        prop_assert!(actual.windows(2).all(|pair| pair[0] < pair[1]));
        prop_assert_eq!(actual.into_iter().collect::<BTreeSet<_>>(), expected);
    }
}
```

Keep useful example tests too. A generated test needs a correct rule and input strategy.
The small value range above makes duplicate inputs common.
Include empty inputs, limits, duplicates, and invalid forms where they matter.
Save failing cases as regression tests after fixing the cause.

Compare a complex implementation with a simple reference when both should agree.
Run the same cases directly against each supported implementation, including the fallback.
Automatic selection on one CPU can leave other implementations untested.
Test lengths just below, at, and above the sizes where the algorithm changes its path.
Vary the starting byte of each slice to cover reads at different memory addresses.

## Fuzz the boundary directly

Use fuzzing for parsers and stateful APIs with many possible inputs.
Call the operation without booting the whole service when that operation can stand alone.
Fuzzing can find crashes, hangs, or invalid memory use without knowing the exact output.
Add output checks when a reference implementation or another rule gives a reliable answer.

- Feed arbitrary bytes to byte parsers.
- Generate structured inputs when random bytes mostly fail before reaching useful behavior.
- Generate command sequences for stateful APIs.
- Check round trips, but also test known external examples; matching encoder and decoder bugs can pass a round trip.
- Record the feature and build variants exercised by the target.

Use snapshots for complex output that humans can review clearly.
Remove irrelevant nondeterminism and review snapshot changes; do not accept them just to make a test pass.
Passing tests does not prove correctness for every input.
