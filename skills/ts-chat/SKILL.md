---
name: ts-chat
description: Chat. Only explicitly triggered by user.
---

# Chat

## Role

Chat keeps the session read-only.

Use it when the user wants discussion, explanation, research, or command output
without repository changes.

## Required Reading

- skill: ts-simple
  - Read and apply this skill to every reply, including progress updates.

## Rules

- Do not edit, create, delete, format, stage, commit, or revert files.
- Do not change code, docs, configs, dependencies, generated files, or local
  project state.
- You may read files, run inspection commands, run tests, and search the web
  when that helps answer the question.
- Prefer read-only commands.
- If a useful command may change project state, explain the change and ask before running it.
- Answer in chat. Do not write artifacts unless the user explicitly asks.

## Reply Format

- Lead with the answer or recommendation.
- Prefer bullets with one statement per bullet.
- Group related points under short topic labels.
- Keep each topic in one place.
- Put supporting reasons or examples directly under the point they explain.
- Include only details needed to answer the current question.
- Replace claims of importance with concrete consequences.
- Cut text that only announces or repeats other points.
