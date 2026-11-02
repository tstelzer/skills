# cargo-machete

Use the latest cargo-machete 0.9 release to find unused dependencies.

Install `cargo-machete` through the [Rust installation guidance](../index.md#installation). With Nix, add
[`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell.

- Review findings before removing dependencies. Generated code and renamed crates can produce false reports.
- Describe renamed crates with `package.metadata.cargo-machete.renamed` when needed.
- Keep `package.metadata.cargo-machete.ignored` entries narrow and explain each one beside the entry.
- Keep `--with-metadata` out of the check recipe; it can change `Cargo.lock`.

Merge [`reference/just.fragment`](./reference/just.fragment) into `check`.

See [cargo-machete](https://github.com/bnjbvr/cargo-machete) for metadata settings.
