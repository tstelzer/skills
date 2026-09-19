# Oxfmt and Oxlint

Use Oxfmt for formatting and Oxlint for linting.

- Install both through the flake for NixOS.
- Install both as `devDependencies` for non-Nix Linux and macOS users and package scripts.
- Keep check commands read-only. Put changes behind explicit `format` and `lint:fix` commands.
- Start with defaults. Add config files only for intentional repository-specific rules.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`. Add
[`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell when the repository uses
Nix.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
