# TypeScript

Use the latest TypeScript 7 release and project references for multi-package repositories.

- Use strict checking and exact optional property types.
- Use NodeNext modules for Node projects.
- Keep shared compiler options in `tsconfig.base.json`.
- Keep the root `tsconfig.json` as the project-reference entry point in a monorepo.
- Add the Effect plugin only through the Effect tooling folder.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`. Adapt
[`reference/tsconfig.base.json`](./reference/tsconfig.base.json) and
[`reference/tsconfig.json`](./reference/tsconfig.json) to the repository layout.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
