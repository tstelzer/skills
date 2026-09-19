# Watchexec

Use Watchexec to restart a long-running development command when its native watch mode cannot watch the required
inputs or control restarts.

Add [`reference/flake.fragment.nix`](./reference/flake.fragment.nix) to the development shell when the repository
uses Nix. Non-Nix Linux and macOS users install Watchexec with their system package manager or another method they
control.

Keep repeated project-specific options in a committed `watchexec.args` beside the package or subsystem that owns
the process. Put one argument per line. Pass the argument file first and separate the child command with `--`:

```sh
watchexec @workspace/core/watchexec.args -- node --enable-source-maps ./dist/cli.js
```

Choose options for the process:

- Use `--restart` for a child that remains running.
- Use `--stdin-quit` when the caller closes standard input during shutdown.
- Set an explicit debounce duration when builds write several files in one burst.
- Repeat `--watch` for each required path.
- Use `--workdir` to set the child command's working directory.
- Use `--no-vcs-ignore` only when required inputs are ignored, such as generated output or a local `.env`.

Watch the containing directory when an editor may replace a single watched file during save.

Expose reusable invocations through Just. Name the recipe for its outcome, such as `dev-core-watch`, not for
Watchexec.
