---
name: ts-log
description: Keep a compact work log. Only explicitly triggered by user.
---

# Log

## Role

Keep a short record of major work done. Use this skill when the user or another skill asks for a log or gives its path.
Write for someone who has the repository and linked documents, but not the chat.

## Content

Record major completed actions. Use one short sentence per entry: what was done.
Add a blocker only when it stops further work. Name what is blocked and what is missing.

Keep decisions, reasons, alternatives, and open design questions out of the log.
Use skill: ts-design-document for those.
Put future tasks in a plan. The log records that work happened; those documents hold its substance.

Skip routine steps, repeated checks, command output, and summaries of linked documents.
Do not list changed files. Git already records them.
Keep only document links needed to continue in `## Artifacts`. Do not list every document read or changed.

## Writing

Read the existing log first. Append entries in time order under `## Log`. Do not rewrite past entries.
Use section names supplied by the calling workflow. Preserve sections it owns and any concurrent edits.

Use the supplied path. For a new log without a supplied path, use:

```text
docs/work-logs/YYYY-MM-DD_HH:MM_<short-name>.md
```

Create the parent directory if needed. Omit `## Artifacts` when there are no needed links.

```markdown
# Work Log: Imports

## Artifacts

- [Import design](../designs/imports.md)

## Log

- 2026-10-07 14:30: Added import retries.
- 2026-10-07 15:00: Blocked restart checks: test database unavailable.
```

Before saving, check that each entry marks major completed work or an essential blocker.
Cut explanations, copied details, and file lists.

## Examples

### Completed Work

Bad:

> Implemented retries to handle transient failures. This makes imports more robust
> and keeps users from retrying manually.

Good:

> Added import retries.

### Design Update

Bad:

> Chose stored progress over memory because imports must survive restarts.

Good:

> Updated the import design.

Keep the choice and its reason in the linked design.

### Changed Files

Bad:

> Changed worker.ts, progress.ts, repository.ts, and worker.test.ts.

Good:

> Added restart recovery.

### Routine Steps

Bad:

> Read the plan, ran the formatter, checked Git status, and started reviewing.

Omit the entry. These steps do not mark completed work.

### Verification

Bad:

> Ran 42 tests, fixed a fixture, reran them, and checked the output. All tests pass.

Good:

> Verified restart recovery.

Record a useful check's final result. Skip routine reruns and test counts.

### Blocker

Bad:

> Tried several times to run restart checks, but the database seems to be down, so further testing will have to wait.

Good:

> Blocked restart checks: test database unavailable.
