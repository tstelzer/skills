# Python tooling

Read only the matching tool folders.

| Tool | Folder | Condition |
| --- | --- | --- |
| Python | [`runtime/`](./runtime/) | Python runtime and supported versions |
| uv | [`uv/`](./uv/) | Dependency management and lock files |
| uv2nix | [`uv2nix/`](./uv2nix/) | Nix builds the Python environment |
| Ruff | [`ruff/`](./ruff/) | Formatting and linting |
| mypy | [`mypy/`](./mypy/) | Type checking |
| pytest | [`pytest/`](./pytest/) | Tests |

## Environment

Choose one owner for the Python environment before applying command fragments.

| Owner | Installation | Command example |
| --- | --- | --- |
| uv | `uv sync --locked` installs into `.venv` | `uv run --locked python -m pytest` |
| uv2nix | Nix builds the environment from `uv.lock` | `python -m pytest` |

Nix may supply Python and uv without owning `.venv`. Use the uv workflow in that case. Select uv2nix when the
repository needs Nix-built Python dependencies or already uses that setup.

Run project commands through `direnv exec . <command>` from the repository root. Just fragments call tools directly
from the active environment. For a uv-managed environment, prefix each Python tool command with `uv run --locked`.

## Configuration

Merge each selected `pyproject.fragment.toml` into the project's `pyproject.toml`. Combine dependency groups and
tool tables once; do not paste duplicate TOML tables or replace existing dependencies.

The command fragments use `src/` and `tests/`. Adapt those paths and tool settings to the repository, including
Python subprojects in mixed repositories. Choose the package layout in [`uv/`](./uv/README.md) before configuring
imports. Keep application libraries and domain workflows in the target repository.

Merge checks into `check`, fixes into `check-fix`, type checks into `typecheck`, and tests into `test`. Include them
in root `verify`. Compose existing domain recipes such as `ml-test` instead of leaving them outside verification.
In repositories without Just, use the same commands through the selected environment owner.
