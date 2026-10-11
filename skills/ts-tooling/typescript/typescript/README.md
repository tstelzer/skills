# TypeScript

Use the latest TypeScript 7 release and project references for multi-package repositories.

- Use strict checking and exact optional property types.
- Use NodeNext modules for Node projects.
- Add the Effect plugin only through the Effect tooling folder.

## Config layout

Keep these roles separate in pnpm workspaces:

- [`tsconfig.base.json`](./reference/tsconfig.base.json): shared compiler options. Keep file lists and output paths
  in the configs that own them.
- [`tsconfig.json`](./reference/tsconfig.json): root build entry point with `files: []` and workspace references.
  Reference the tooling config too.
- [`workspaces/example/tsconfig.json`](./reference/workspace/tsconfig.json): build one workspace's source into
  `dist`. Set `composite`, `rootDir`, and a unique build-info path. Exclude tests from production output.
  Add references to workspace dependencies.
- [`tsconfig.tools.json`](./reference/tsconfig.tools.json): compile root tooling and tests into `.cache/typescript`.
  Reference the workspaces they import.
- [`tsconfig.typecheck.json`](./reference/tsconfig.typecheck.json): check source, tests, and tooling with `noEmit`.
  Give it its own build-info path. Keep it outside the emitted project-reference graph.

Adapt paths and file patterns to the repository. Include colocated tests and separate test folders.

## Commands

In pnpm workspaces, `typecheck` must run `tsc --build` to check each workspace under its own config.
Include `tsconfig.typecheck.json` as another build entry point to check source, tests, and tooling without emitting
that entry point. Use the same entry points for `typecheck-watch`.

Make `build` produce all project artifacts and `build-watch` rebuild them on changes. Add commands for other
artifacts when needed. `build` and `typecheck` may run the same command when the build covers all type checks.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
For a single-package repository, use its project config and omit workspace-only configs and build entry points.
