# Bacon

Use the latest Bacon 3 release for interactive compiler, lint, and test feedback while editing. Use Bacon in place
of the archived cargo-watch for this workflow. Use [Watchexec](../../repository/watchexec/README.md) to restart
long-running development commands.

Install `bacon` through the [Rust installation guidance](../index.md#installation). With Nix, add
[`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell.

Adapt [`reference/bacon.toml`](./reference/bacon.toml) at the Cargo workspace root. Keep jobs for the tools selected
by the repository. Match their package and feature selection to the non-interactive checks.

Merge [`reference/just.fragment`](./reference/just.fragment) into the repository `justfile`. When using Nextest,
change `test-watch` to `bacon nextest`. Keep doctests in the non-interactive test recipe.

Keep Bacon out of CI and `verify`. Use `bacon clippy` for continuous lint feedback.

See [Bacon configuration](https://dystroy.org/bacon/config/).
