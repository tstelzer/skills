# cargo-deny

Use the latest cargo-deny 0.20 release for dependency advisories, license rules, and allowed dependency sources.

Install `cargo-deny` through the [Rust installation guidance](../index.md#installation). With Nix, add
[`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell.

Adapt [`reference/deny.toml`](./reference/deny.toml) to the repository's dependency policy.

- Set allowed licenses from the project's requirements. The reference starts with MIT and Apache-2.0.
- Allow Git sources explicitly when the project uses them.
- Keep duplicate versions as warnings initially; make them errors only when the project can enforce one version.
- Explain each advisory exception and remove it when the dependency is fixed.
- Check optional dependencies too. The reference enables all features for dependency inspection without compiling.

Merge [`reference/just.fragment`](./reference/just.fragment) into `check`. The command covers all workspace members
and preserves `Cargo.lock`. Let it refresh advisory data; offline runs cannot detect newly published advisories.

See [cargo-deny configuration](https://embarkstudios.github.io/cargo-deny/checks/cfg.html).
