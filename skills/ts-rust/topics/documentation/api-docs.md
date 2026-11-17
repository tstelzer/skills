# Document the contract the signature cannot show

Explain units, allowed values, failures, and effects that callers must know.
Use `///` for items and `//!` for module or crate guidance.

## Bad

```rust
/// Parses a count.
pub fn parse_count(text: &str) -> Result<u32, std::num::ParseIntError> {
    text.parse()
}
```

## Good

```rust
/// Parses a decimal count without trimming whitespace.
///
/// # Errors
/// Returns an error for empty input, invalid digits, or a value outside `u32`.
pub fn parse_count(text: &str) -> Result<u32, std::num::ParseIntError> {
    text.parse()
}
```

Add sections when the contract needs them:

| Section | State |
| --- | --- |
| `# Examples` | A normal call and its meaningful result |
| `# Errors` | Conditions that return an error |
| `# Panics` | Caller-visible assumptions that can panic |
| `# Safety` | Conditions an unsafe caller must establish |

Every public unsafe function needs a safety contract. A safety comment at its implementation is not a substitute.
Document thread, cancellation, and blocking behavior when a caller's correct use depends on it.

## Make examples useful as doctests

Use the crate's actual public import path, realistic input, and an assertion.
Propagate expected failure with `?` instead of making a normal error path panic.
Hide setup or the final result type with rustdoc's `# ` lines when that keeps the visible example short.
Keep the setup real; hiding it does not excuse an incomplete example.
Use `no_run` for examples that should compile but need external resources to run.
Use `compile_fail` for an example that must be rejected. `ignore` skips the check, so state why it is needed.

Use intra-doc links such as ``[`std::path::Path`]`` for related API items.
Check that links and examples still work after a rename.
Explain module purpose and how its public types fit together rather than restating each declaration.

Keep README and crate introduction content consistent. `include_str!` can share the introduction when its links and
examples work in both contexts. Do not force one file to serve incompatible audiences.
For a published crate, keep description, license, repository, and other relevant Cargo metadata accurate.
