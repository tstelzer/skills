# Volta

Use Volta only in work repositories. Add only its `package.json` configuration. Do not add Volta to `flake.nix`.

Pin the latest patch release from the selected Node LTS line. Merge
[`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
