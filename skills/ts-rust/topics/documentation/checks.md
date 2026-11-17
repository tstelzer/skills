# Use checks to catch mistakes, not to replace judgment

Follow the repository's existing format, lint, test, and minimum-version commands.
Run them through its required environment. Do not change tooling configuration merely because a guide lists a setting.

## Bad

```rust
#![allow(clippy::all)]

fn has_values(values: &[u8]) -> bool {
    values.len() > 0
}
```

The broad suppression hides unrelated findings across the crate.

## Good

```rust
fn has_values(values: &[u8]) -> bool {
    !values.is_empty()
}
```

When a lint conflicts with a deliberate API or platform requirement, keep the exception local and explain the reason.
Use the lint mechanism supported by the project's Rust version.

## Match the check to the change

| Change | Useful check |
| --- | --- |
| Rust formatting | Existing rustfmt check |
| Types, imports, feature gates | Cargo check for supported targets and features |
| Common mistakes and unnecessary work | Existing Clippy checks |
| Behavior | Focused unit or integration tests |
| API docs | Documentation build and doctests |
| New language or library APIs | The declared minimum supported Rust version |
| Unsafe or synchronization internals | Targeted Miri or Loom checks where supported |

Fix correctness and suspicious-code findings first. Style, complexity, and performance lints need the code's context.
Use selected pedantic or nursery lints when their value is clear; do not enable every evolving lint group blindly.
Missing docs and unsafe documentation checks can protect a public contract.
Check unexpected `cfg` names so a typo does not silently skip code.

Use shared workspace lint policy when the project already has one, with explicit member inheritance.
Treat public Cargo metadata checks as publication checks, not a reason to add irrelevant metadata to private code.
Test supported feature combinations. `--all-features` alone does not cover a minimal or `no_std` build.

Report what ran and what remained unchecked. A formatting check does not validate an example's behavior.
