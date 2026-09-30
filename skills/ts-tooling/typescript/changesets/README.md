# Changesets

Use Changesets only when the repository publishes packages.

- Configure the actual base branch and package access level.
- Keep Changesets commands separate from CI workflow policy.
- Add release workflows only when the user requests them.

Merge [`reference/package.fragment.jsonc`](./reference/package.fragment.jsonc) into `package.json`. Copy and adapt
[`reference/config.json`](./reference/config.json) to `.changeset/config.json`.

Append [`reference/just.fragment`](./reference/just.fragment) to the repository `justfile` when it uses Just.
Adapt `changeset-version` to the repository's formatting checks and `changeset-publish` to its build recipe.
Use `just changeset-publish` in release jobs with Just. Add a `ci:publish` package script and its required build
scripts only when the release job cannot use Just.
