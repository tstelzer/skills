# Madge

Use Madge to detect circular imports.

Madge 8 declares optional peer support for TypeScript 5, not TypeScript 7. It works against the current TypeScript 7
baseline, but upstream does not formally support that combination. Run the circular dependency check in the target
repository before adopting it. Do not hide a peer incompatibility with a package-manager override.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`. Replace `src`
with every source root that must remain acyclic.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
