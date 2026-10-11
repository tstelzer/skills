# direnv

Merge [`reference/.envrc`](./reference/.envrc) into the repository root `.envrc`.

Use `watch_file package.json` before `use flake` when the shell reads runtime or package-manager versions from
`package.json`. This reloads the environment when those versions change.

Run project commands through `direnv exec . <command>` from the repository root.

`use flake` loads the Nix development shell. `dotenv` loads the repository's local `.env` when present. Do not
commit secrets or inspect an existing `.env` without explicit user authorization.
