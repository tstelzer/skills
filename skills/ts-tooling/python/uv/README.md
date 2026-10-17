# uv

Use uv for dependency declarations and `uv.lock`. Use the latest compatible uv 0.13 release. With Nix, use the
version supplied by the pinned nixpkgs input and check its lock format against the selected uv2nix revision.

Merge [`reference/pyproject.fragment.toml`](./reference/pyproject.fragment.toml) into `pyproject.toml`. Replace
`example-app` with the project name. Add runtime dependencies to `project.dependencies` and development tools to
`dependency-groups.dev`. Commit `uv.lock` and update it with uv. Include `uv lock --check` in `verify`.

## Package layout

For new packaged code, use `src/<package_name>/` and install the project in editable mode through the selected
environment owner. For pure Python packages, merge
[`reference/pyproject.package.fragment.toml`](./reference/pyproject.package.fragment.toml) to use `uv_build`.
Keep an existing backend that meets the project's needs. Use a backend that supports native extensions when needed.
Keep only the selected backend's settings.

For script-only projects, omit `[build-system]` and package-discovery settings. Run scripts by path or modules with
`python -m`. Configure import roots for the chosen layout; do not copy another project's `PYTHONPATH` or `src.main`
package name.

## uv-managed environment

- Add or upgrade a dependency with `uv add '<package>==<version>'`. Add `--dev` for development tools. These commands
  update declarations, the lockfile, and `.venv` together.
- Use `uv sync --locked` to install the committed dependency set. Run commands with `uv run --locked`.
- Use `uv lock --upgrade-package <package>` for transitive upgrades allowed by the dependency constraints, then sync.
- Ignore `.venv/`, `__pycache__/`, `.ruff_cache/`, `.mypy_cache/`, and `.pytest_cache/` in Git.

For Nix shells, add [`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to `packages`. When Nix supplies
Python, set `UV_PYTHON` to that interpreter and `UV_PYTHON_DOWNLOADS = "never"` in the shell.

For a Nix-built environment, follow [`uv2nix/`](../uv2nix/README.md) instead of syncing `.venv`.

See [locking and syncing](https://docs.astral.sh/uv/concepts/projects/sync/) and the
[build backend](https://docs.astral.sh/uv/concepts/build-backend/).
