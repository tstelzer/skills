# Vitest

Use the latest Vitest 5 release for TypeScript tests. Keep the default run command non-interactive and provide a
separate watch command.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`. Adapt
[`reference/vitest.config.ts`](./reference/vitest.config.ts) to the repository layout.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
