# Cargo

Use Cargo from the selected [Rust toolchain](../toolchain/README.md).

- Use edition 2024 for new crates. Migrate existing editions with Cargo's edition migration workflow.
- Set `rust-version` to the oldest compiler the project supports. Test that version when claiming compatibility.
- Commit `Cargo.lock` for applications and libraries. Use `--locked` in recurring build, check, and test commands.
- Generate or update the lock file with Cargo before running locked checks. Keep dependency updates explicit.
- Keep build profiles at the workspace root. Add profile changes only for a measured project need.

## Manifests

For one package, merge [`reference/Cargo.fragment.toml`](./reference/Cargo.fragment.toml) into its `Cargo.toml`.
Replace `<minimum-rust-version>` with the supported lower bound, at least `1.85` for edition 2024.

For several related crates, merge [`reference/workspace/Cargo.toml`](./reference/workspace/Cargo.toml) into the
workspace root. Adapt `members`. Merge
[`reference/workspace/member.fragment.toml`](./reference/workspace/member.fragment.toml) into each member.
Shared metadata takes effect only when members opt in with `workspace = true`.

Use resolver 3 for new workspaces. Keep shared dependency versions under `[workspace.dependencies]` and inherit
them in members with `workspace = true` when several members use the same dependency.

## Commands

Merge [`reference/just.fragment`](./reference/just.fragment) into the repository `justfile`.

`typecheck` checks all workspace packages and target kinds, including tests and examples, for the current platform.
`test` runs Cargo tests and doctests. When selecting Nextest, replace the test recipe through its
[tool folder](../nextest/README.md).

See [Cargo workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html),
[Rust version](https://doc.rust-lang.org/cargo/reference/rust-version.html), and
[edition migration][migration].

[migration]: https://doc.rust-lang.org/edition-guide/editions/transitioning-an-existing-project-to-a-new-edition.html
