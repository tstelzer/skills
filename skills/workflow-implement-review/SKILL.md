---
name: workflow-implement-review
description: Use when a user asks to implement or fix code with a subagent-dispatched implementation-review loop, shared workflow log, bounded retries, and clear stop conditions.
---

# Workflow Implement Review

## Required Reading

- skill: log

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

- Use the `log` skill to create the shared workflow log.
- Record the user request as `Source request:`. Link a plan or design artifact when one exists, or copy the request inline.
- Record the workflow baseline: base ref (current `git HEAD`) and starting dirty files (`git status`).
- Always pass the same log path to every judge pass.

### DISPATCH_IMPLEMENT

- Dispatch a sub-agent with model `sonnet high`.
- Prompt:

```text
You are the implementation judge. Use `skill: implement`.

Workflow log path: <path>. Respect the recorded baseline; do not absorb unrelated pre-existing user changes.

Task input:
- On pass 1: implement the linked source request from the log.
- On later passes: resolve every open `fix now` finding in the log and the latest review handoff.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### DISPATCH_REVIEW

- Dispatch a sub-agent with model `opus high`.
- Prompt:

```text
You are the review judge. Use `skill: review`.

Workflow log path: <path>.

Review the workflow-owned diff against the source request, workflow baseline, and latest implementation handoff in the log.

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
- If implementation or review returns `BLOCKED` or `ESCALATE`, stop and report.
- If review has no `fix now` findings, stop with `STATUS: DONE`.
- If review has `fix now` findings and the round limit is not reached, dispatch implementation again with the same log path.
- Default round limit is 3 unless the user sets another. One round is one implementation pass followed by one review pass.
- If the round limit is reached with open `fix now` findings, stop with `STATUS: BLOCKED: review loop limit reached`.

## Stop Conditions

- `STATUS: DONE`: latest review pass completed and `## Open Findings` has no `fix now` findings.
- `STATUS: BLOCKED: <reason>`: required input, dependency, or verification is unavailable. Includes `subagents unavailable`, `invalid handoff`, and `review loop limit reached`.
- `STATUS: ESCALATE: <reason>`: a human decision is needed.
