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
