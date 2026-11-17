# Avoid unnecessary generic code

Use a concrete borrowed type when it provides the operations the function needs.
Generics can produce a separate compiled body for each concrete type.
Those copies can increase compilation work and binary size.

## Bad

```rust
fn parse_words(input: impl AsRef<str>) -> Vec<String> {
    input.as_ref()
        .split_whitespace()
        .filter(|word| !word.starts_with('#'))
        .map(str::to_owned)
        .collect()
}
```

This body only needs `&str`. String slices and borrowed `String` values can both use that interface.

## Good

```rust
fn parse_words(input: &str) -> Vec<String> {
    input.split_whitespace()
        .filter(|word| !word.starts_with('#'))
        .map(str::to_owned)
        .collect()
}
```

Keep generics when the algorithm or actual callers need them.
Split a generic function only when its input flexibility is needed and measured build costs justify a helper.

## Measure the build path you want to improve

- Use `cargo check` when executable output is not needed.
- Inspect Cargo build timings before guessing which crate or dependency is expensive.
- Measure clean builds separately from the usual edit-and-check loop.
- Inspect unused dependencies, duplicate versions, and unnecessary dependency features.
- Look for large macro expansions and many generic or const-generic instantiations.
- Keep build scripts small and deterministic.
  Emit `rerun-if-changed` for file inputs and `rerun-if-env-changed` for external environment inputs.
  Write generated files only inside `OUT_DIR`. Keep network downloads outside build scripts.
  Probe compiler capabilities instead of parsing `rustc --version` text.
- Check the minimum supported Rust version, or MSRV, before adopting newer language or library features.

Use repository commands and its existing tooling. Dependency, linker, and profile changes need their own evidence.
Crate splitting is an architecture decision; a smaller source file does not by itself reduce compilation work.
For `no_std` code, state whether it needs only `core`, also `alloc`, or platform-specific services.
Feature gates should add capabilities and remain compatible when dependencies enable them together.
