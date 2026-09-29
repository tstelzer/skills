# Effect TypeScript tooling

Use this folder only for Effect projects.

- Install `@effect/tsgo`. Do not install `@effect/language-service` with TypeScript 7.
- Run `effect-tsgo patch` from `prepare` so a fresh install patches TypeScript.
- Keep `@effect/language-service` as the plugin name in the shared TypeScript config. This is an identifier provided
  by `@effect/tsgo`, not a package dependency.
- Configure the editor to use the workspace TypeScript version and `effect-tsgo` language server.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json` and the
`compilerOptions` from [`reference/tsconfig.fragment.jsonc`](./reference/tsconfig.fragment.jsonc) into the shared
TypeScript config.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.

## Oxlint integration

Apply this integration when the repository uses Oxlint.

- Resolve `oxlint` and `oxlint-tsgolint` versions supported by the selected `@effect/tsgo` release.
- Merge [`reference/oxlint/package.fragment.jsonc`](./reference/oxlint/package.fragment.jsonc) after the base package
  fragments.
- Replace the Effect plugin entry with
  [`reference/oxlint/tsconfig.fragment.jsonc`](./reference/oxlint/tsconfig.fragment.jsonc).
- Merge [`reference/oxlint/.oxlintrc.json`](./reference/oxlint/.oxlintrc.json) into the root Oxlint configuration.
- Add `--oxlint` to the `effect-patch` Just recipe.

The reference config disables rules that are too broad for repository-wide enforcement:

- `async-function`: allow async functions at Promise and SDK boundaries.
- `node-builtin-import`: allow deliberate Node adapters and launchers.
- `prefer-schema-over-json`: require schemas at unknown boundaries, not for pure serialization or trusted test data.
