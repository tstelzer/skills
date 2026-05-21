---
name: log
description: Use with workflow skills to keep a shared workflow log: current state, pass artifacts, deviations, findings, decisions, verification, and handoff.
---

# Log

## Purpose

Maintain a shared workflow log. Use it only when another skill or workflow
provides a log path or asks for one.

Use the log so the next pass can continue without reading chat. Record only
workflow state that is not already obvious from linked artifacts or the current
diff.

## Location

Create logs under:

```text
docs/workflows/YYYY-MM-DD_HH:MM_<workflow-name>_<short-name>.md
```

Create `docs/workflows/` if it does not exist.

## Rules

- Read the current log before acting.
- Keep `## Timeline` append-only.
- Only `## Current State`, `## Scope`, and `## Open Findings` are mutable.
- Link the source request: plan/design artifact when one exists, or the copied
  user request when no durable artifact exists.
- Record the workflow baseline before changes start: base ref, starting dirty
  files, or another explicit scope boundary the workflow can review against.
- Link every artifact created or consumed by the workflow.
- Do not list implementation files as artifacts. Code files, README changes,
  configs, and tests belong in pass artifacts, diffs, or phase scope.
- Record deviations from the expected plan, task, design, or prior handoff.
- Record findings that could cause repeated mistakes in later passes.
- Record finding dispositions explicitly.
- Do not copy content that already lives in a linked artifact.
- Do not paste command output. Record the command, result, and artifact link
  when the output matters.
- Do not rely on chat history.

## What Belongs Here

Write entries only for workflow coordination:

- Current workflow status and next pass.
- Source request and review baseline.
- Artifact links: plans, reviews, audits, verdicts, screenshots, test reports.
- Deviations from the expected plan, design, task, or prior handoff.
- Non-obvious findings that future passes must account for.
- Decisions that affect later phases.
- Open findings and their dispositions.
- Verification commands and results when they affect the next step.
- Blockers, escalations, and unresolved handoff notes.

Do not write entries for:

- File lists that the diff already shows.
- Routine command output.
- Generic summaries of work already captured in an artifact.
- Style notes with no effect on the next step, handoff, or future mistakes.
- Implementation artifacts such as source files, tests, docs, configs, or
  generated output.

## Status Lines

Each timeline entry must include exactly one status line:

```text
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

Use `BLOCKED` when work cannot continue without missing input or a failed
precondition. Use `ESCALATE` when a human decision is needed.

## Structure

```markdown
# Workflow Log: <Name>

## Current State
- Workflow: `<workflow-name>`
- Status: `<active | blocked | done | escalated>`
- Round: `<n>/<max>`
- Next pass: `<implement | review | other>`
- Next handoff: <one concrete instruction>

## Scope
- Source request: <link to plan/design, or copied user request>
- Baseline: <base ref, starting dirty files, or explicit review boundary>
- Review scope: <what later review should include and exclude>

## Artifacts
- `<artifact-type>`: [docs/path/to/artifact.md](../path/to/artifact.md)

## Open Findings
| ID | Source | Finding | Disposition | Owner / next action |
| --- | --- | --- | --- | --- |
| F-001 | `<pass/artifact>` | <non-obvious issue> | `<fix now | follow-up | waiver>` | <owner/action> |

## Decisions and Deviations
- <decision or deviation that changes later work>

## Timeline
### YYYY-MM-DD HH:MM - <pass-name>
STATUS: DONE
**Skill(s):** `<skill-name>`, `<other-skill>`
**Artifact:** <artifact link, or `None`>
**Verification:** <command and result, or `Not run: <reason>`>
**Findings:** <new, updated, or resolved finding IDs, or `None`>
**Handoff:** <what the next pass needs to know>
```

## Finding Dispositions

Use one workflow disposition for every accepted finding:

- `fix now`: must be addressed before the workflow can finish.
- `follow-up`: valid issue, outside the current workflow scope. Record the
  executable follow-up.
- `waiver`: accepted risk. Record the reason and evidence.

During judge synthesis, findings may also be recorded as `duplicate`, `out of
scope`, `rejected with evidence`, or `blocked`. These do not remain in
`## Open Findings` unless later workflow passes must account for them.

No material finding may disappear silently.

When a finding is fully fixed, leave it in `## Open Findings` only if it still
matters for future passes. Otherwise record the resolution in `## Timeline` and
remove it from `## Open Findings`.

## Examples

- "Create a workflow log for this build."
- "Use this workflow log while reviewing: `docs/workflows/...md`."
