# Ruff

Use Ruff for Python formatting and linting. Resolve the latest Ruff 0.x release when configuring a repository.

- Start with defaults. Add settings under `[tool.ruff]` only for project needs, such as the repository's line length.
- Let Ruff infer the supported Python version from `requires-python`.
- Keep checks read-only. Apply safe fixes with `check-fix`; do not enable unsafe fixes by default.

Merge [`reference/pyproject.fragment.toml`](./reference/pyproject.fragment.toml) into `pyproject.toml` and merge
[`reference/just.fragment`](./reference/just.fragment) into the repository `justfile`. Adapt the source and test
paths. Use the command form selected in the [Python index](../index.md#environment).

See [Ruff configuration](https://docs.astral.sh/ruff/configuration/) for settings beyond the defaults.
