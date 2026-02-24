---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from the current workspace or before executing implementation plans; creates an isolated git worktree at ~/dev/worktrees/<project-name>/<feature>
---

# Using Git Worktrees

## Creation Steps

Announce at start: "I'm using the using-git-worktrees skill to set up an isolated workspace."

### 1. Detect Repository Root and Project Name

Project name is the basename of the repository top-level directory (the directory returned by `git rev-parse --show-toplevel`).

```bash
repo_root="$(git rev-parse --show-toplevel)"
project_name="$(basename "$repo_root")"
```

### 2. Choose Feature Name

Use an arbitrary dash-cased feature string (for example: `auth-refactor`, `fix-login-timeout`, `plan-implementation`).

If the user already provided a branch/feature name, reuse it unless it conflicts with project conventions.

### 3. Build Worktree Path

Always use this layout:

- Root: `~/dev/worktrees/`
- Full path: `~/dev/worktrees/<project-name>/<feature>`

```bash
feature="<dash-cased-feature>"
worktree_root="$HOME/dev/worktrees"
worktree_path="$worktree_root/$project_name/$feature"
```

### 4. Create the Worktree

Create parent directories as needed, resolve the default base branch (`master` or `main`), then create a new branch worktree at the computed path.

```bash
mkdir -p "$(dirname "$worktree_path")"

if git show-ref --verify --quiet refs/heads/master; then
  base_branch="master"
elif git show-ref --verify --quiet refs/heads/main; then
  base_branch="main"
else
  echo "Could not find local master or main branch" >&2
  exit 1
fi

git worktree add "$worktree_path" -b "$feature" "$base_branch"
cd "$worktree_path"
```

### 5. Project Setup and Baseline Verification

Do not hardcode generic setup or test commands in this skill.

Infer project setup and any "clean baseline" verification from repository context (files, scripts, tooling) and instructions in `AGENTS.md` / `CLAUDE.md`.

### 6. Report Location

```
Worktree ready at <full-path>
Ready to implement <feature-name>
```

## Quick Reference

| Item | Rule |
|------|------|
| Worktree root | `~/dev/worktrees/` |
| Path layout | `~/dev/worktrees/<project-name>/<feature>` |
| `project-name` | Basename of `git rev-parse --show-toplevel` |
| `feature` | Arbitrary dash-cased string |
| Base branch | Always branch from `master` if present, otherwise `main` |
| Project setup / tests | Infer from context and instructions, not this skill |

## Common Mistakes

### Using a repo-local worktree path

- Problem: Reintroduces assumptions this workflow does not use
- Fix: Always create worktrees under `~/dev/worktrees/<project-name>/`

### Using a non-dash-cased feature name

- Problem: Inconsistent paths and branch naming
- Fix: Normalize to a short dash-cased feature string before creating the worktree

### Hardcoding setup or baseline checks in the skill

- Problem: Generic commands are often wrong for the repo
- Fix: Infer setup/verification from repository context and `AGENTS.md` / `CLAUDE.md`

## Example Workflow

```
You: I'm using the using-git-worktrees skill to set up an isolated workspace.

[Detect repo root: /home/ts/dev/myproject]
[Project name: myproject]
[Feature: auth-refactor]
[Base branch: master]
[Create worktree: git worktree add ~/dev/worktrees/myproject/auth-refactor -b auth-refactor master]

Worktree ready at /home/ts/dev/worktrees/myproject/auth-refactor
Ready to implement auth-refactor
```

## Red Flags

**Never:**
- Create repo-local worktrees for this workflow (`.worktrees/`, `worktrees/`, etc.)
- Hardcode setup/test commands in the skill itself
- Assume `project-name` from remote URL instead of repo top-level folder name
- Branch from current `HEAD` when the intent is a fresh feature off `master` / `main`

**Always:**
- Use `~/dev/worktrees/<project-name>/<feature>`
- Derive `project-name` from `git rev-parse --show-toplevel`
- Use a dash-cased `feature` string
- Pass an explicit base branch (`master` preferred, otherwise `main`) to `git worktree add`
- Infer setup/baseline verification from project context and instructions
