# Treat compiler hints and profiles as experiments

Start with the project's release profile. Change one relevant setting and measure runtime, binary size, and build cost.
Keep the target hardware and deployment constraints in the result.

## Bad

```rust
#[inline(always)]
fn sum(values: &[u64]) -> u64 {
    values.iter().sum()
}
```

The annotation was added without evidence that the call boundary matters.

## Good

```rust
fn sum(values: &[u64]) -> u64 {
    values.iter().sum()
}
```

Let the compiler make its normal choice first. Add `#[inline]` for a measured cross-crate hot call when it helps.
Use `#[inline(always)]` sparingly; duplicated code can increase instruction-cache pressure.
`#[cold]` and `#[inline(never)]` can help separate rare work, but measure them too.

| Experiment | Possible benefit | Cost or constraint |
| --- | --- | --- |
| Link-time optimization, LTO | Optimize across compiled units | More build work; compare thin and full LTO |
| Fewer codegen units | More optimization within a unit | Less compilation parallelism |
| Profile-guided optimization, PGO | Optimize using recorded execution | Training must match real workloads |
| Target-specific CPU features | Use instructions on a known target | The binary may fail on other CPUs |
| SIMD | Process several data elements together | Platform support, layout, tails, and added complexity |

Do not set `target-cpu=native` for a portable binary just because it runs faster on the build machine.
Check CPU support before calling code that uses extra instructions.
Use the build target's guarantees or a runtime feature check.
Use a portable fallback when the extra instructions are unavailable.

Check stable support before using SIMD or branch-hint APIs from a tutorial.
Prefer ordinary iterators and safe slice structure before removing bounds checks with unsafe operations.

Changing the panic strategy changes program behavior. `panic = "abort"` is not a routine speed setting;
it removes unwind cleanup and changes recovery options.
Stripping symbols can make production diagnosis harder. Keep the information the deployment needs.
Do not copy a full profile block from a guide without evidence for each setting.
