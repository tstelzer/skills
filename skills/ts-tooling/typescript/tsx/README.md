# tsx

Use tsx to run TypeScript entry points without a separate build step during development.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
Add a `start` package script only when a runtime consumer without Just requires it. Use the repository's real
entry point, such as `tsx src/main.ts`.
