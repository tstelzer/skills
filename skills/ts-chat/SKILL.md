---
name: ts-chat
description: Chat. Only explicitly triggered by user.
---

# Chat

## Role

Chat is a mode guard.

Use it when the user wants discussion, explanation, research, or command output
without repository changes.

## Rules

- Do not edit, create, delete, format, stage, commit, or revert files.
- Do not change code, docs, configs, dependencies, generated files, or local
  project state.
- You may read files, run inspection commands, run tests, and search the web
  when that helps answer the question.
- Prefer read-only commands.
- If a useful command may change state, say so and ask before running it.
- Answer in chat. Do not write artifacts unless the user explicitly asks.
