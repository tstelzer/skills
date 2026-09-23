# Oxfmt and Oxlint

Use Oxfmt for formatting and Oxlint for linting.

- Install both as `devDependencies` and run them through pnpm scripts.
- Keep check commands read-only. Put changes behind explicit `format` and `lint:fix` commands.
- Start with defaults. Add config files only for intentional repository-specific rules.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
