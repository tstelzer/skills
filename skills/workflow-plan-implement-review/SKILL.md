---
name: workflow-plan-implement-review
description: Use when a user asks to plan, implement, and review a code change with subagent-dispatched plan-review and implementation-review loops, a shared workflow log, bounded retries, and clear stop conditions.
---

# Workflow Plan Implement Review

## Router Required Reading

- skill: log

Do not read `plan`, `implement`, or `review` in the router. Pass those skill
names verbatim to the dispatched judges.

## Role

Workflow Plan Implement Review is a router.

It runs a fixed sequence:

`(judge-plan -> judge-review){1,n} -> (judge-implement -> judge-review){1,n}`

It dispatches judge passes to subagents, reads status and finding dispositions,
and routes the next pass. It does not plan, edit, review, or verify code itself.

Use this when the user asks to take a code change from plan through
implementation with review gates at both phases. This skill produces a reviewed
plan first, then implements the reviewed plan and reviews the workflow-owned
diff.

## Workflow

1. CREATE_LOG
2. PLAN_LOOP
3. IMPLEMENT_LOOP
4. ROUTE_NEXT_PASS

### CREATE_LOG

- Use the `log` skill to create the shared workflow log.
- Record the user request as `Source request:`. Link a design artifact when one
  exists, or copy the request inline.
- Record the workflow baseline: base ref (current `git HEAD`) and starting
  dirty files (`git status`).
- In this workflow, the router owns log creation and routing state. Each judge
  pass owns its own log entry, artifact links, findings, worker dispatch count,
  types, models, efforts, and handoff.
- The router must record the exact selected model and effort for each
  dispatched judge in the workflow log.
- When composing a judge prompt, replace `<model> <effort>` with the actual
  selected values.
- Track phase and round counters in `## Current State`: `plan round`,
  `implementation round`, and current phase.
- Always pass the same log path to every judge pass.

### PLAN_LOOP

Run:

`(judge-plan -> judge-review){1,n}`

#### DISPATCH_PLAN

- Dispatch a sub-agent with models: `opus high` or `gpt-5.5 xhigh`.
- Prompt:

```text
You are the planning judge. Use `skill: plan`.

Workflow log path: <path>.
Dispatched judge model/effort: <model> <effort>.

Task input:
- On pass 1: produce the plan for the linked source request from the log.
- On later passes: revise the plan to resolve every open planning-phase `fix now` finding in the log and the latest review handoff.

Before returning, you must:
- Write the plan artifact.
- Write or update the workflow log at `<path>`.
- Record the dispatched judge model/effort and every worker model/effort in the
  workflow log.
- Record worker dispatches as `<count> (<type>: <model> <effort>, ...)`, e.g.
  `0 (judge direct)` or
  `2 (api-contract: opus high, test-inventory: gpt-5.5 high)`.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

#### DISPATCH_PLAN_REVIEW

- Dispatch a sub-agent with models: `opus high` or `gpt-5.5 high`.
- Prompt:

```text
You are the review judge. Use `skill: review`.

Workflow log path: <path>.
Dispatched judge model/effort: <model> <effort>.

Review the plan artifact linked in the log against the source request. Score the plan only; there is no implementation diff yet.

This is a formal workflow review, not an informal review. You must write a
separate review artifact, even when there are no findings.

Record accepted `fix now` findings from this review as planning-phase findings.
The router will use those findings only to decide whether another planning
round is needed.

Before returning, you must:
- Write the review artifact.
- Write or update the workflow log at `<path>`.
- For every planning-phase open finding, prefix `Source` with `plan-review:`.
- Record the dispatched judge model/effort and every worker model/effort in the
  workflow log.
- Record worker dispatches as `<count> (<type>: <model> <effort>, ...)`, e.g.
  `0 (judge direct)` or
  `2 (automatic-testing: opus high, robustness: gpt-5.5 high)`.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### IMPLEMENT_LOOP

Run after PLAN_LOOP completes with no planning-phase `fix now` findings:

`(judge-implement -> judge-review){1,n}`

#### DISPATCH_IMPLEMENT

- Dispatch a sub-agent with models: `sonnet high` or `gpt-5.3-codex high`.
- Prompt:

```text
You are the implementation judge. Use `skill: implement`.

Workflow log path: <path>. Respect the recorded baseline; do not absorb unrelated pre-existing user changes.
Dispatched judge model/effort: <model> <effort>.

Task input:
- On pass 1: implement the reviewed plan artifact linked in the log.
- On later passes: resolve every open implementation-phase `fix now` finding in the log and the latest review handoff.

Before returning, you must:
- Write or update the workflow log at `<path>`.
- Record the dispatched judge model/effort and every worker model/effort in the
  workflow log.
- Record worker dispatches as `<count> (<type>: <model> <effort>, ...)`, e.g.
  `0 (judge direct)` or `2 (frontend: sonnet high, backend: gpt-5.3-codex high)`.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

#### DISPATCH_IMPLEMENT_REVIEW

- Dispatch a sub-agent with models: `opus high` or `gpt-5.5 high`.
- Prompt:

```text
You are the review judge. Use `skill: review`.

Workflow log path: <path>.
Dispatched judge model/effort: <model> <effort>.

Review the workflow-owned diff against the reviewed plan artifact, source request, workflow baseline, and latest implementation handoff in the log.

This is a formal workflow review, not an informal review. You must write a
separate review artifact, even when there are no findings.

Record accepted `fix now` findings from this review as implementation-phase
findings. The router will use those findings only to decide whether another
implementation round is needed.

Before returning, you must:
- Write the review artifact.
- Write or update the workflow log at `<path>`.
- For every implementation-phase open finding, prefix `Source` with
  `implement-review:`.
- Record the dispatched judge model/effort and every worker model/effort in the
  workflow log.
- Record worker dispatches as `<count> (<type>: <model> <effort>, ...)`, e.g.
  `0 (judge direct)` or
  `2 (automatic-testing: opus high, robustness: gpt-5.5 high)`.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### ROUTE_NEXT_PASS

- Read `## Open Findings` and `## Current State` from the log before deciding.
- Increment the active phase round counter in `## Current State` after each
  completed review pass.
- If subagent dispatch fails (tool error, no return), stop with
  `STATUS: BLOCKED: subagents unavailable`.
- If a dispatched judge returns no status line or more than one, stop with
  `STATUS: BLOCKED: invalid handoff`.
- If any judge returns `BLOCKED` or `ESCALATE`, stop and report.
- During PLAN_LOOP, consider only `fix now` findings whose `Source` begins with
  `plan-review:`.
- If the plan review has no planning-phase `fix now` findings, mark the plan
  phase done in `## Current State` and enter IMPLEMENT_LOOP.
- If the plan review has planning-phase `fix now` findings and the plan round
  limit is not reached, dispatch planning again with the same log path.
- During IMPLEMENT_LOOP, consider only `fix now` findings whose `Source` begins
  with `implement-review:`.
- If the implementation review has no implementation-phase `fix now` findings,
  stop with `STATUS: DONE`.
- If the implementation review has implementation-phase `fix now` findings and
  the implementation round limit is not reached, dispatch implementation again
  with the same log path.
- Default round limit is 3 per phase unless the user sets another. One planning
  round is one planning pass followed by one plan review pass. One
  implementation round is one implementation pass followed by one implementation
  review pass.
- If either phase reaches its round limit with open phase-owned `fix now`
  findings, stop with `STATUS: BLOCKED: review loop limit reached`.

## Stop Conditions

- `STATUS: DONE`: latest implementation review pass completed and
  `## Open Findings` has no implementation-phase `fix now` findings.
- `STATUS: BLOCKED: <reason>`: required input, dependency, or verification is
  unavailable. Includes `subagents unavailable`, `invalid handoff`, and
  `review loop limit reached`.
- `STATUS: ESCALATE: <reason>`: a human decision is needed.
