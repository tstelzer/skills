---
name: ts-workflow-implement-review
description: Run an implement-review loop. Only explicitly triggered by user.
---

# Workflow Implement Review

## Router Required Reading

- skill: ts-log

Do not read `ts-implement` or `ts-review` in the router. Pass those skill names
verbatim to the dispatched judges.

## Role

Workflow Build is a router.

It runs a fixed sequence:

`(judge-implement -> judge-review){1,n}`

It dispatches judge passes to subagents, reads status and finding dispositions, and routes the next pass. It does not edit, review, or verify code itself.

Use this when the user asks to build, implement, fix, or change code and wants a review loop. This skill does not create a plan. The user request can be ad-hoc or linked to a prior plan.

## Workflow

1. CREATE_LOG
2. DISPATCH_IMPLEMENT
3. DISPATCH_REVIEW
4. ROUTE_NEXT_PASS

### CREATE_LOG

- Use the `ts-log` skill to create the shared workflow log.
- Record the user request as `Source request:`. Link a plan or design artifact when one exists, or copy the request inline.
- Record the workflow baseline: base ref (current `git HEAD`) and starting dirty files (`git status`).
- In this workflow, the router owns log creation and routing state. Each
  judge pass owns its own log entry, artifact links, findings, worker dispatch
  count, types, models, efforts, and handoff.
- The router must record the exact selected model and effort for each
  dispatched judge in the workflow log.
- When composing a judge prompt, replace `<model> <effort>` with the actual
  selected values.
- Always pass the same log path to every judge pass.
- Use the owning skill's artifact directory for each pass: reviews in
  `docs/reviews/`, workflow logs in `docs/workflows/`.
- Sub-agents must start with fresh context. Never fork parent history. Use a
  self-contained prompt: cwd, log path, source request, baseline, relevant
  artifacts, and output contract.
- Always close sub-agents once they return. After each pass returns its status
  line, kill the spawned sub-agent before routing the next pass; do not let them
  stick around.

### DISPATCH_IMPLEMENT

- Dispatch a sub-agent with models: `sonnet high` or `gpt-5.5 medium`.
- Prompt:

```text
You are the implementation judge. Use `skill: ts-implement`.

Workflow log path: <path>. Respect the recorded baseline; do not absorb unrelated pre-existing user changes.
Dispatched judge model/effort: <model> <effort>.

Task input:
- On pass 1: implement the linked source request from the log.
- On later passes: resolve every open blocking finding in the log and the latest review handoff.

Before returning, you must:
- Write or update the workflow log at `<path>`.
- Record the dispatched judge model/effort and every worker model/effort in the
  workflow log.
- Record worker dispatches as `<count> (<type>: <model> <effort>, ...)`, e.g.
  `2 (frontend: sonnet high, backend: gpt-5.5 medium)`.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### DISPATCH_REVIEW

- Dispatch a sub-agent with models: `opus high` or `gpt-5.5 high`.
- Prompt:

```text
You are the review judge. Use `skill: ts-review`.

Workflow log path: <path>.
Dispatched judge model/effort: <model> <effort>.

Review the workflow-owned diff against the source request, workflow baseline, and latest implementation handoff in the log.
Run the review against all review types from `skill: ts-review`.

This is a formal workflow review, not an informal review. You must write a
separate review artifact, even when there are no findings.
When updating `## Open Findings`, preserve each finding severity in the
finding text, e.g. `critical: missing authorization check`. Critical and high
findings must be recorded as `fix now`; do not downgrade them to `follow-up` or
`waiver`. If a critical or high finding needs a human exception, return
`STATUS: ESCALATE`. Low findings inside the workflow scope should be `fix now`;
use `follow-up` only for work outside the current scope and record the
executable follow-up.

Review status semantics:
- `STATUS: DONE`: review completed with no blocking findings.
- `STATUS: BLOCKED`: review completed with blocking findings for the next implementation pass.
- `STATUS: ESCALATE`: a human decision or exception is needed.

Before returning, you must:
- Write the review artifact using the `ts-review` artifact rules.
- Write or update the workflow log at `<path>`.
- Use these artifact destinations:
  - Review artifact: `docs/reviews/YYYY-MM-DD_HH:MM_<review-type>_<review-name>.md`.
  - Workflow log: `<path>`.
- Record the review artifact link in `## Artifacts`.
- Keep the workflow log as coordination state with links, finding dispositions,
  pass status, worker metadata, and handoff.
- Record the dispatched judge model/effort and every worker model/effort in the
  workflow log.
- Record worker dispatches as `<count> (<type>: <model> <effort>, ...)`, e.g.
  `2 (automatic-testing: opus high, robustness: gpt-5.5 high)`.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### ROUTE_NEXT_PASS

- Read `## Open Findings` and `## Current State` from the log before deciding.
- Increment the round counter in `## Current State` after each completed review pass.
- If subagent dispatch fails (tool error, no return), stop with `STATUS: BLOCKED: subagents unavailable`.
- If a dispatched judge returns no status line or more than one, stop with `STATUS: BLOCKED: invalid handoff`.
- If implementation returns `BLOCKED` or `ESCALATE`, stop and report.
- If review returns `ESCALATE`, stop and report.
- If review returns `BLOCKED`, route from `## Open Findings`.
- Treat these as blocking findings:
  - any `fix now` finding
  - any open critical or high finding, regardless of disposition
- If review has no blocking findings, stop with `STATUS: DONE`.
- If review has blocking findings and the round limit is not reached, dispatch implementation again with the same log path.
- Default round limit is 5 unless the user sets another. One round is one implementation pass followed by one review pass.
- If the round limit is reached with open blocking findings, stop with `STATUS: BLOCKED: review loop limit reached`.

## Stop Conditions

- `STATUS: DONE`: latest review pass completed and `## Open Findings` has no blocking findings.
- `STATUS: BLOCKED: <reason>`: required input, dependency, or verification is unavailable. Includes `subagents unavailable`, `invalid handoff`, and `review loop limit reached`.
- `STATUS: ESCALATE: <reason>`: a human decision is needed.
