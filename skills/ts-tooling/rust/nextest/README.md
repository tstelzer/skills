# Nextest

Use the latest cargo-nextest 0.9 release when the test suite needs its filtering, output, or test scheduling.
Use Cargo's built-in runner for small suites that do not need those features.

Install `cargo-nextest` through the [Rust installation guidance](../index.md#installation). With Nix, add
[`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell.

Replace Cargo's test recipe with [`reference/just.fragment`](./reference/just.fragment). Nextest runs ordinary
tests; the second command runs doctests for library crates. Omit that command only in repositories with no library
targets. Apply the same package and feature selection to both commands.

Start with Nextest defaults. Add `.config/nextest.toml` only for project needs, such as test timeouts or limits on
tests that share an external resource. Keep retries off by default so intermittent failures remain visible.

See [running tests](https://nexte.st/docs/running/) and
[configuration](https://nexte.st/docs/configuration/reference/).
