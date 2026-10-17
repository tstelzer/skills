# direnv

Merge [`reference/.envrc`](./reference/.envrc) into the repository root `.envrc`.

Add `watch_file` before `use flake` for each non-Nix file the development shell reads:

- Watch `package.json` when it supplies runtime or package-manager versions.
- For uv2nix, watch `pyproject.toml`, `uv.lock`, and workspace members' `pyproject.toml` files.
- Watch `.python-version` when it selects the shell's interpreter.

Run project commands through `direnv exec . <command>` from the repository root.

`use flake` loads the Nix development shell. `dotenv` loads the repository's local `.env` when present. Do not
commit secrets or inspect an existing `.env` without explicit user authorization.
