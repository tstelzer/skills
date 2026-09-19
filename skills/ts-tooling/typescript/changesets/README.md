# Changesets

Use Changesets only when the repository publishes packages.

- Configure the actual base branch and package access level.
- Keep Changesets scripts separate from CI workflow policy.
- Add release workflows only when the user requests them.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`. Copy and adapt
[`reference/config.json`](./reference/config.json) to `.changeset/config.json`.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
