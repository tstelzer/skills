# Pyright

Use Pyright 1.1 for Python type checking in the editor and repository checks.

## Installation

With Nix, add [`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell's `packages`.
Let `flake.lock` pin Pyright and its Node.js runtime. Use this package with both uv and uv2nix environments.

Without Nix, install Node.js and resolve the latest Pyright 1.1 release, then install that exact version:

```sh
npm install --global 'pyright@<resolved-pyright-version>'
```

Keep installation outside Just recipes. Use `pyright` and `pyright-langserver` from the same installation.

## Configuration

- Check source and tests. Adapt `include` and set `pythonVersion` to the supported Python lower bound.
- Use `strict` checking for new typed packages. For existing code, start with the reference's `standard` mode.
- Install third-party stubs in the Python dev dependency group when available. Keep missing-import checks enabled.
- Keep shared settings in `[tool.pyright]`. Merge any `pyrightconfig.json` into that table and remove the JSON file,
  which would otherwise override it.
- Run Pyright in the selected Python environment so it resolves the same packages as the application.

Merge [`reference/pyproject.fragment.toml`](./reference/pyproject.fragment.toml) into `pyproject.toml`. Replace
`<python-minor>` with the supported lower bound from [`runtime/`](../runtime/README.md).
Merge [`reference/just.fragment`](./reference/just.fragment) into the repository `justfile` using the command form
selected in the [Python index](../index.md#environment).

Use `pyright-langserver --stdio` for editor support. Let Ruff own formatting, lint fixes, and import sorting;
keep Pyright's type diagnostics enabled. Read type-check settings from the project config in both the editor and CI.

See [Pyright configuration](https://github.com/microsoft/pyright/blob/main/docs/configuration.md) and
[environment discovery](https://github.com/microsoft/pyright/blob/main/docs/import-resolution.md).
