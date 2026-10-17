# uv2nix

Use uv to resolve dependencies and Nix to build the Python environment from `uv.lock`.

Merge [`reference/flake.fragment.nix`](./reference/flake.fragment.nix) into the
[repository flake](../../repository/nix/README.md). Merge its inputs, output arguments, and per-system bindings;
preserve the existing shell packages and hooks. The fragment relies on the baseline's nixpkgs and flake-utils inputs.
Set `<python-nix-attribute>` to the interpreter selected in [`runtime/`](../runtime/README.md).

- Prefer wheels. Add package-specific build overrides only when required.
- Match the project's build-backend requirement to the version supplied by the build-system overlay.
- Use the editable environment for development. Use `workspace.deps.default` for runtime packages without dev tools.
- Run `python`, Ruff, and mypy directly from the shell through direnv. Do not use `uv run`, `uv sync`, or `pip install`
  to manage this environment.
- Keep `UV_NO_SYNC`, `UV_PYTHON`, and `UV_PYTHON_DOWNLOADS` set as shown in the fragment.

Add or upgrade a dependency with `uv add --no-sync '<package>==<version>'`. Add `--dev` for development tools.
These commands update the lockfile too. Use `uv lock` after manual metadata edits.
Reload the environment after dependency changes before running checks. Follow the
[direnv watch rules](../../repository/direnv/README.md).

Use the [upstream guide](https://pyproject-nix.github.io/uv2nix/usage/getting-started.html) for build overrides and
platform-specific dependencies.
