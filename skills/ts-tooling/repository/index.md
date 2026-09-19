# Repository tooling

Read only the folders needed for the task.

| Tool | Folder | Use |
| --- | --- | --- |
| Nix flake | [`nix/`](./nix/) | Reproducible development shell |
| direnv | [`direnv/`](./direnv/) | Load the flake and local environment |
| Just | [`just/`](./just/) | Repository command interface |
| Watchexec | [`watchexec/`](./watchexec/) | Restart development commands when files change |
| Actionlint | [`actionlint/`](./actionlint/) | Check GitHub Actions workflows |
| EditorConfig | [`editorconfig/`](./editorconfig/) | Shared editor defaults |
| AGENTS.md | [`agents/`](./agents/) | Repository instructions for agents |
| CodeRabbit | [`coderabbit/`](./coderabbit/) | Work repositories only |

Select only the tools the repository needs. Each tool folder owns its installation and configuration guidance.
