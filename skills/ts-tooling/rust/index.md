# Rust tooling

Read only the matching tool folders.

| Tool | Folder | Condition |
| --- | --- | --- |
| Rust toolchain | [`toolchain/`](./toolchain/) | Compiler, Cargo, and matching toolchain components |
| Cargo | [`cargo/`](./cargo/) | Package management, builds, and basic tests |
| rustfmt | [`rustfmt/`](./rustfmt/) | Rust formatting |
| Clippy | [`clippy/`](./clippy/) | Rust linting |
| rust-analyzer | [`rust-analyzer/`](./rust-analyzer/) | Rust editor support |
| Nextest | [`nextest/`](./nextest/) | Test suites that need better filtering, output, or scheduling |
| cargo-machete | [`cargo-machete/`](./cargo-machete/) | Unused dependency checks |
| cargo-deny | [`cargo-deny/`](./cargo-deny/) | Dependency advisories, licenses, and source policies |
| Bacon | [`bacon/`](./bacon/) | Interactive checks while editing |

## Installation

Choose the [toolchain owner](./toolchain/README.md) first. Install Cargo extensions as development tools, not as
dependencies in the project's `Cargo.toml`.

With Nix, merge the toolchain's flake fragment into the repository flake. Add the other selected tools' flake
fragments to the development shell's `packages`. Let `flake.lock` pin the Nix inputs and tool packages.

Without Nix, resolve an exact version from the release line in each tool's README and install it with Cargo:

```sh
cargo install --locked --version '<resolved-tool-version>' '<crate-name>'
```

Use `cargo-nextest`, `cargo-machete`, `cargo-deny`, or `bacon` as the crate name. Keep these setup commands outside
Just recipes.

Run project commands through `direnv exec . <command>` from the repository root. Just recipes call tools directly
from the active environment.

## Configuration

Merge Cargo fragments into the matching manifests. Preserve existing dependencies and combine TOML tables once.
Use the workspace fragments only when the project has several related crates.

Command fragments run from the Cargo workspace root. Adapt working directories for Rust subprojects in mixed
repositories. Keep the same package and feature selection across checks, tests, and watch commands.

Use default features for the baseline. Add checks for other supported feature combinations when the project has
them. Use `--all-features` for compilation only when those features work together; it does not test each combination.

Merge lint and format checks into `check`, fixes into `check-fix`, compiler checks into `typecheck`, and tests into
`test`. Include selected non-interactive checks in root `verify`. Nextest replaces Cargo's ordinary test command
and keeps a separate doctest command for library crates.
