# Clippy

Use Clippy from the selected [Rust toolchain](../toolchain/README.md).

- Start with the default lint groups. Add stricter lints individually when they help the project.
- Do not enable the entire `restriction` group; its rules can conflict.
- Put shared lint settings in `[workspace.lints]`. Set `workspace = true` in each member's `[lints]` table.
- Explain narrow lint exceptions where they apply.

Merge [`reference/just.fragment`](./reference/just.fragment) into `check` and `check-fix`.
`cargo clippy --fix` uses Cargo's usual worktree checks and refuses uncommitted changes by default.

The check uses Cargo 1.97+'s `CARGO_BUILD_WARNINGS=deny` to fail on warnings without changing compiler flags.
For an older pinned toolchain, replace that environment setting with `-- -D warnings` after the Clippy arguments.

See [Clippy usage](https://doc.rust-lang.org/stable/clippy/usage.html).
