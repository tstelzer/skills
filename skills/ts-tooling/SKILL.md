---
name: ts-tooling
description: Personal repository tooling standards and reference configs. Only explicitly triggered by user.
---

# Tooling

## Role

Use this skill as the source of truth when setting up or updating repository tooling.

Read `skill: ts-principles` before changing a repository.

## Start here

Do not read every file. Establish the repository context, then open only the matching indexes and tool folders.

1. Read [`repository/index.md`](./repository/index.md) for repository-wide tools.
2. Read the language index for each language in use. TypeScript starts at
   [`typescript/index.md`](./typescript/index.md).
3. Read a tool's `README.md` before using anything under its `reference/` folder.

## Rules

- Support Linux and macOS. Do not add Windows-specific configuration or commands.
- Select tools from the target repository's needs. There is no universal tool set.
- Use the reference files as merge sources. Preserve intentional project-specific configuration.
- Update generated lock files with their owning tools. Do not edit lock files by hand.

Reference configs name only the preferred major line. Before applying one, resolve the latest release in that major.
Pin the exact version in dependency, package-manager, and runtime-manager fields. Use the resolved major for support
ranges such as `engines.node`. Replace every `<latest-...>` placeholder. Update this skill only when the preferred
major or configuration shape changes.
