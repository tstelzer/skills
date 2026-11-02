# Rust toolchain

Use the newest stable Rust 1.x release supported by the project on Linux and macOS.

Adapt [`reference/rust-toolchain.toml`](./reference/rust-toolchain.toml). Replace `<resolved-rust-version>` with an
exact stable release. Keep the development compiler pin separate from Cargo's minimum supported `rust-version`.

The reference selects Cargo and rustc through the minimal profile, then adds Clippy, rustfmt, rust-analyzer, and
`rust-src`. Get these components from the same toolchain. Do not add separate nixpkgs copies of them.

## Nix

Merge [`reference/flake.fragment.nix`](./reference/flake.fragment.nix) into the repository flake. Preserve existing
overlays and shell packages. The overlay reads the shared `rust-toolchain.toml`; add that file to the
[direnv watch list](../../repository/direnv/README.md).

Let the shell supply Rust. Keep rustup out of that shell. Add native libraries only for dependencies that need them.

## Without Nix

Use rustup with the same `rust-toolchain.toml`. Let it install the requested toolchain and components.

See the [rustup toolchain file](https://rust-lang.github.io/rustup/overrides.html#the-toolchain-file) and
[rust-overlay API](https://github.com/oxalica/rust-overlay/blob/master/docs/reference.md).
