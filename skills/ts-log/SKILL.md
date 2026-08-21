---
name: ts-log
description: Keep a shared work log. Only explicitly triggered by user.
---

# Log

## Purpose

Maintain a shared work log that lets another agent continue without reading chat history.

Use it when the user, another skill, or a workflow asks for a log or provides a log path. The log records major
developments and links to durable work artifacts. It does not contain those artifacts.

## Location

Create logs under:

```text
docs/work-logs/YYYY-MM-DD_HH:MM_<short-name>.md
```

Create `docs/work-logs/` if it does not exist.

## Rules

- Read an existing log before contributing to it.
- Keep chronological entries append-only. Use `## Log` unless the caller defines another section.
- Keep `## Artifacts` to artifact links only.
- Link every durable work artifact created or used.
- Record major developments that affect later work. This includes completed work, decisions, discoveries, changed
  assumptions, blockers, and handoffs.
- State the consequence of a linked artifact when it affects later work. Do not summarize or copy its contents.
- Do not paste command output. Record a command and its result only when they affect later work.
- Do not repeat information that is already clear from a linked artifact or the repository.
- Write for an agent that has the repository and log, but no chat history.
- Let calling skills and workflows add arbitrary sections and entry fields.
- Follow rules defined by the calling skill or workflow for the sections it owns.
- Preserve sections and conventions you do not own.
- Do not impose a single current state, next action, work type, or thread of execution.

## What Belongs Here

Add a log entry when work changes what another agent needs to know. Keep it brief and link the supporting artifact when
one exists.

Do not add:

- Routine progress with no effect on later work.
- File lists that the repository already shows.
- Generic summaries of linked artifacts.
- Raw command output.

## Structure

```markdown
# Work Log: <Name>

## Artifacts
- `<artifact-name>`: [Artifact title](../path/to/artifact.md)

## Log
### YYYY-MM-DD HH:MM - <short description>
<concise record of the development and its implications>
```

Calling skills and workflows may add arbitrary sections and may define a different chronological section or entry
shape.

## Examples

- "Create a work log for this effort."
- "Use this work log while continuing: `docs/work-logs/...md`."
