# Just

Use [`reference/justfile`](./reference/justfile) as the command interface baseline.

Add [`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell when the repository
uses Nix.

Treat the `justfile` as a curated command interface, not an inventory of tools and package scripts.
Do not add a header comment that explains the `justfile` or repeats these rules.

Add a recipe when it:

- gives a short name to a useful package-manager script
- hides a long workspace or package-filter command
- captures a complex command that is hard to recall
- exposes a frequently used development command such as `test`, `lint`, or `dev`

Do not add recipes for version checks, dependency installation or updates, environment reloads, Nix commands, or
commands already handled by installation and lifecycle hooks. Select recipes by command value. Selecting a tool does
not require adding its `just.fragment`.

## Names

- Use lowercase kebab-case.
- Use conventional names for common repository workflows, such as `build`, `check`, `clean`, `dev`, `lint`, `test`,
  `typecheck`, and `verify`.
- Name a variation `<command>-<variant>`, such as `build-watch`, `check-fix`, or `test-ci`.
- Name a related family `<scope>-<action>[-<variant>]`, such as `benchmark-seed`, `integration-test-setup`, or
  `ml-train-random`.
- Name a standalone task `<verb>-<object>`, such as `canonicalize-brands` or `download-translations`.
- Name recipes for their outcome or project concept, not the tool, executable, or library that implements them.
  Prefer `build-view` over `vite-build`.
- Use one stable scope term across a family. Do not mix names such as `integration-test-*` and
  `integration-tests-*`.
- Make each recipe name clear without its group. Groups do not provide a namespace.

## Groups

- Use Title Case group names.
- Group recipes by user workflow or project domain, not by implementation tool.
- Use `Core` for common repository-wide commands, `Checks` for validation, `Development` for development and watch
  commands, `Runtime` for application processes, and `CLI` for operational commands.
- Add project-domain groups such as `Integration Tests`, `Benchmarks`, `ML`, or `Downloads` when useful.
- Use `CI` only for commands intended specifically for CI.
- Do not create groups for tools such as Vite, Effect, Nix, or Docker.
- Assign every public recipe to one group. Leave private helpers ungrouped.
- Keep group names and capitalization consistent within a file.

- Keep recipes thin. Put reusable language-specific commands in their native task runner and call them from Just.
- Add `verify` after assembling the file. Include only selected, non-interactive checks.
- Keep mutating and interactive recipes out of `verify`.
