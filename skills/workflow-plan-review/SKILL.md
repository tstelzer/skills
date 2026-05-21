---
name: workflow-plan-review
description: Use when a user asks to plan a code change with a subagent-dispatched plan-review loop, shared workflow log, bounded retries, and clear stop conditions.
---

# Workflow Plan Review

## Required Reading

- skill: log

## Role

Workflow Plan Review is a router.

It runs a fixed sequence:

`(judge-plan -> judge-review){1,n}`

It dispatches judge passes to subagents, reads status and finding dispositions, and routes the next pass. It does not plan or review itself.

Use this when the user asks for an implementation plan and wants a review loop. This skill does not implement code; the produced plan is the artifact.

## Workflow

1. CREATE_LOG
2. DISPATCH_PLAN
3. DISPATCH_REVIEW
4. ROUTE_NEXT_PASS

### CREATE_LOG

- Use the `log` skill to create the shared workflow log.
- Record the user request as `Source request:`. Link a design artifact when one exists, or copy the request inline.
- Always pass the same log path to every judge pass.

### DISPATCH_PLAN

- Dispatch a sub-agent with model `opus high`.
- Prompt:

```text
You are the planning judge. Use `skill: plan`.

Workflow log path: <path>.

Task input:
- On pass 1: produce the plan for the linked source request from the log.
- On later passes: revise the plan to resolve every open `fix now` finding in the log and the latest review handoff.

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

Review the plan artifact linked in the log against the source request. Score the plan only; there is no implementation diff in this workflow.

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
- If planning or review returns `BLOCKED` or `ESCALATE`, stop and report.
- If review has no `fix now` findings, stop with `STATUS: DONE`.
- If review has `fix now` findings and the round limit is not reached, dispatch planning again with the same log path.
- Default round limit is 3 unless the user sets another. One round is one planning pass followed by one review pass.
- If the round limit is reached with open `fix now` findings, stop with `STATUS: BLOCKED: review loop limit reached`.

## Stop Conditions

- `STATUS: DONE`: latest review pass completed and `## Open Findings` has no `fix now` findings.
- `STATUS: BLOCKED: <reason>`: required input, dependency, or verification is unavailable. Includes `subagents unavailable`, `invalid handoff`, and `review loop limit reached`.
- `STATUS: ESCALATE: <reason>`: a human decision is needed.
