---
name: ts-tooling
description: Personal repository tooling standards and reference configs. Only explicitly triggered by user.
---

# Tooling

## Role

Use this skill as the source of truth when setting up or updating repository tooling.

## Start here

Do not read every file. Establish the repository context, then open only the matching indexes and tool folders.

1. Read [`repository/index.md`](./repository/index.md) for repository-wide tools.
2. Read the index for each language in use: [`typescript/index.md`](./typescript/index.md) or
   [`python/index.md`](./python/index.md).
3. Read a tool's `README.md` before using anything under its `reference/` folder.

## Rules

- Support Linux and macOS. Do not add Windows-specific configuration or commands.
- Select tools from the target repository's needs. There is no universal tool set.
- Use the reference files as merge sources. Preserve intentional project-specific configuration.
- When using Just, apply its [command ownership rules](./repository/just/README.md) before merging package scripts.
- Use `check` for lint and format checks and `check-fix` to apply fixes. Merge selected tools into those recipes.
- In pnpm workspaces, keep shared, build, tooling, and type-check configs separate. Follow the
  [TypeScript config layout](./typescript/typescript/README.md).
- Watch files the development shell reads in `.envrc`. Follow the [direnv setup](./repository/direnv/README.md).
- Update generated lock files with their owning tools. Do not edit lock files by hand.

Reference configs name the preferred release line. Before applying one, resolve the latest release in that line.
When selected tools publish a compatibility matrix, use the newest supported combination instead of resolving each
tool independently.
Pin the exact version in dependency, package-manager, and runtime-manager fields. Use the tool's compatibility model
for support ranges, such as a Node.js major or Python minor. Replace every placeholder. Update this skill only when
the preferred release line or configuration shape changes.
