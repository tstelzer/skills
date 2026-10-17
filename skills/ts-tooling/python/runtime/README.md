# Python

Choose the newest stable Python minor supported by the project's dependencies on Linux and macOS. Check the
[official release table](https://www.python.org/downloads/). Check native dependency wheel support before upgrading.

- Set `requires-python` to the supported range. Its lower bound must match the oldest Python version the code supports.
- Pin the development interpreter to an exact patch in `.python-version` within that range.
- With Nix, record the exact interpreter supplied by `flake.lock`. Keep the selected Nix attribute on the same minor.
- Without Nix, use the latest patch in the selected minor. Let uv select that pin.
- Keep mypy's target Python version at the supported lower bound. Let Ruff infer it from `requires-python`.

Merge [`reference/pyproject.fragment.toml`](./reference/pyproject.fragment.toml) into `pyproject.toml` and adapt
[`reference/.python-version`](./reference/.python-version). Replace `<python-minor>` with a version such as `3.14`
and `<resolved-python-version>` with the selected interpreter's full version.

For Nix shells, add [`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to `packages`. Replace
`<python-nix-attribute>` with the matching attribute, such as `python314`. With uv2nix, use that interpreter in its
`python` binding; the generated environment supplies Python to the shell.
