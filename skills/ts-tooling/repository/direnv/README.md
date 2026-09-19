# direnv

Copy [`reference/.envrc`](./reference/.envrc) to the repository root.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.

`use flake` loads the Nix development shell. `dotenv` loads the repository's local `.env` when present. Do not
commit secrets or inspect an existing `.env` without explicit user authorization.
