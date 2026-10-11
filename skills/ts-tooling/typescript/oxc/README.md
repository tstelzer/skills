# Oxfmt and Oxlint

Use Oxfmt for formatting and Oxlint for linting.

- Install both as `devDependencies` and invoke them with `pnpm exec` from Just recipes.
- Use `check` for lint and format checks. Use `check-fix` to apply safe lint fixes and format files.
- Make `check` fail on lint warnings. Keep lint and format checks read-only.
- Start with defaults. Add config files only for intentional repository-specific rules.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`.

Merge [`reference/just.fragment`](./reference/just.fragment) into the repository `justfile` when it uses Just.
Add other selected lint checks, such as Actionlint, to the same `check` recipe.
