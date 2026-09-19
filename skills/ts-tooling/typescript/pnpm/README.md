# pnpm

On Linux, install pnpm's standalone musl binary in the Nix shell. Add
[`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell's `packages` list. The
expression reads the exact version from `packageManager`. On macOS, it falls back to the pnpm package from nixpkgs.
Non-Nix users may use Corepack, Volta, or another installation they control.

- Pin pnpm exactly with `packageManager`.
- Use pnpm 12. Resolve the latest 12.x release when configuring a repository.
- Include the package integrity hash in `packageManager`. Use `corepack use pnpm@12` to write the exact version and
  hash instead of constructing the value by hand.
- Resolve both fixed-output hashes in the Nix fragment for the exact pnpm release. Add another platform mapping when
  the repository supports another Linux architecture.
- Use `pnpm-workspace.yaml` for workspaces and native dependency build policy.
- Add native build approvals deliberately. Do not copy package-specific entries that are not installed.
- Keep `minimumReleaseAgeExclude` entries only when the repository uses a minimum release age.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`. Use
[`reference/pnpm-workspace.yaml`](./reference/pnpm-workspace.yaml) as a monorepo baseline.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
