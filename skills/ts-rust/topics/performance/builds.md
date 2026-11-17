# Keep generic entrypoints small when their bodies do not need generics

Generics can produce a separate compiled body for each concrete type.
Convert flexible input at the edge, then let a concrete helper do shared work when that reduces meaningful build cost.

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

For a larger parser used with many input types, the generic input can duplicate a body that only needs `&str`.

## Good

```rust
fn parse_words(input: impl AsRef<str>) -> Vec<String> {
    parse_words_inner(input.as_ref())
}

fn parse_words_inner(input: &str) -> Vec<String> {
    input.split_whitespace()
        .filter(|word| !word.starts_with('#'))
        .map(str::to_owned)
        .collect()
}
```

For this small body, accepting `&str` directly may be simpler. Split the body only when the public flexibility or
measured compilation cost justifies the extra helper.

## Measure the build path you want to improve

- Use `cargo check` when executable output is not needed.
- Inspect Cargo build timings before guessing which crate or dependency is expensive.
- Measure clean builds separately from the usual edit-and-check loop.
- Inspect unused dependencies, duplicate versions, and unnecessary dependency features.
- Look for large macro expansions and many generic or const-generic instantiations.
- Keep build scripts small and deterministic. Declare the inputs that should trigger a rebuild.
- Check the minimum supported Rust version, or MSRV, before adopting newer language or library features.

Use repository commands and its existing tooling. Dependency, linker, and profile changes need their own evidence.
Crate splitting is an architecture decision; a smaller source file does not by itself reduce compilation work.
For `no_std` code, state whether it needs only `core`, also `alloc`, or platform-specific services.
Feature gates should add capabilities and remain compatible when dependencies enable them together.
