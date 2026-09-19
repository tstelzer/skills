# Just

Use [`reference/justfile`](./reference/justfile) as the command interface baseline.

Add [`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell when the repository
uses Nix.

- Append the `just.fragment` from each selected command-line tool.
- Keep recipes thin. Put reusable language-specific commands in their native task runner and call them from Just.
- Add `verify` after assembling the file. Include only selected, non-interactive checks.
- Keep mutating and interactive recipes out of `verify`.
