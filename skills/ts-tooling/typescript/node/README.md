# Node.js

Use the latest Node.js LTS release available when the repository is created or updated. Check the
[official release table](https://nodejs.org/en/about/previous-releases) instead of assuming a major version.

- Update the Nix package, `engines.node`, `@types/node`, and Volta pin together.
- Use the latest patch release for the selected LTS line in Volta.
- In work repositories, pin the exact approved Node release with Volta.
- Keep `@types/node` on the selected LTS major.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json` and add
[`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
