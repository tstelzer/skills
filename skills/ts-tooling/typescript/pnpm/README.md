# pnpm

Use pnpm through Corepack in the Nix shell. Add
[`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell. Non-Nix users may use
Corepack, Volta, or another installation they control.

- Pin pnpm exactly with `packageManager`.
- Use pnpm 12. Resolve the latest 12.x release when configuring a repository.
- Include the package integrity hash in `packageManager`. Use `corepack use pnpm@12` to write the exact version and
  hash instead of constructing the value by hand.
- Use `pnpm-workspace.yaml` for workspaces and native dependency build policy.
- Add native build approvals deliberately. Do not copy package-specific entries that are not installed.
- Keep `minimumReleaseAgeExclude` entries only when the repository uses a minimum release age.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`. Use
[`reference/pnpm-workspace.yaml`](./reference/pnpm-workspace.yaml) as a monorepo baseline.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
