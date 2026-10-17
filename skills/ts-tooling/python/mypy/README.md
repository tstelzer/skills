# mypy

Use the latest mypy 2 release for Python type checking.

- Check source and tests. Adapt `files` to the repository and set `python_version` to the supported lower bound.
- Use strict checking for new typed packages. For existing code, start with the reference settings and expand the
  checked scope as annotations improve.
- Install third-party stubs in the dev dependency group when available. Scope missing-import overrides to the
  specific untyped dependency. Do not set `ignore_missing_imports` globally.
- Run mypy through the selected Python interpreter so it can find the same installed packages as the application.

Merge [`reference/pyproject.fragment.toml`](./reference/pyproject.fragment.toml) into `pyproject.toml`. Replace
`<python-minor>` with the supported lower bound from [`runtime/`](../runtime/README.md).
Merge [`reference/just.fragment`](./reference/just.fragment) into the repository `justfile` using the command form
selected in the [Python index](../index.md#environment).

See [adopting mypy](https://mypy.readthedocs.io/en/stable/existing_code.html) and its
[configuration](https://mypy.readthedocs.io/en/stable/config_file.html).
