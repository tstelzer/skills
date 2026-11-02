# rustfmt

Use rustfmt from the selected [Rust toolchain](../toolchain/README.md). Start with its defaults; add `rustfmt.toml`
only for project-specific settings supported by stable Rust.

Merge [`reference/just.fragment`](./reference/just.fragment) into the repository's `check` and `check-fix` recipes.
Run formatting after Clippy fixes in `check-fix`.

See [rustfmt](https://github.com/rust-lang/rustfmt) for configuration options.
