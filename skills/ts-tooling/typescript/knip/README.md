# Knip

Use Knip to find unused files, exports, and dependencies.

- Keep the configuration strict.
- Describe intended entry points and project files.
- Add ignores only for runtime or tool references Knip cannot discover.
- Explain every non-obvious ignore next to the entry.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`. Adapt
[`reference/knip.jsonc`](./reference/knip.jsonc) to the repository layout.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
