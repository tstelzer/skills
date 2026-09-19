# Nix flake

Use [`reference/flake.nix`](./reference/flake.nix) as the empty development-shell baseline.

- Track `nixos-unstable` and use `flake-utils` for Linux and macOS systems.
- Add packages only from the selected tool folders. Their `flake.fragment.nix` files own the package choices.
- Add project-specific native libraries where the project that needs them documents them.
- Keep the flake usable without making it the only supported installation path.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.

Update `flake.lock` with `nix flake update`. Never write it by hand.
