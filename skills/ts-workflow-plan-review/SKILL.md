---
name: ts-workflow-plan-review
description: Run a plan-review loop. Only explicitly triggered by user.
---

# Workflow Plan Review

## Router Required Reading

- skill: ts-log

Do not read `ts-plan` or `ts-review` in the router. Pass those skill names
verbatim to the dispatched judges.

## Role

Workflow Plan Review is a router.

It runs a fixed sequence:

`(judge-plan -> judge-review){1,n}`

It dispatches judge passes to subagents, reads status and finding dispositions,
and routes the next pass. It never plans, reviews, edits artifacts, or changes
the plan content itself.

The router's only write target is the workflow log. Any artifact change belongs
to a dispatched judge.

Use this when the user asks for an implementation plan and wants a review loop.
This skill does not implement code. The plan is the primary artifact.

## Artifact Contract

- This workflow has one primary artifact: the plan.
- Pass 1 creates the plan and records one `plan` link in `## Artifacts`.
- Later planning passes rewrite the same plan file.
- Do not create `revised`, `v2`, or replacement plan files for review findings.
- `## Artifacts` must contain exactly one `plan` link. Remove competing plan
  links before returning.
- Review artifacts and the workflow log are supporting artifacts.

## Sub-Agent Selection

Use this section when this skill dispatches sub-agent judges.

- Choose the first available entry for the judge role.
- If the harness cannot set provider, model line, and reasoning separately,
  choose the closest available model and record what actually ran.
- Do not dispatch extra judges just to use every entry.

### Planning Judge

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `gpt` latest | `xhigh` |
| 2 | Anthropic | `opus` latest | `high` |
| 3 | Cursor | `composer` | `high` |

### Review Judge

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `gpt` latest | `xhigh` |
| 2 | Anthropic | `opus` latest | `xhigh` |
| 3 | Cursor | `composer` | `high` |

## Workflow

1. CREATE_LOG
2. DISPATCH_PLAN
3. DISPATCH_REVIEW
4. ROUTE_NEXT_PASS
5. HANDLE_DEVELOPER_FEEDBACK

### CREATE_LOG

- Use the `ts-log` skill to create the shared workflow log.
- Record the user request as `Source request:`. Link a design artifact when one
  exists, or copy the request inline.
- In this workflow, the router owns log creation and routing state. Each
  judge pass owns its own log entry, artifact links, findings, worker dispatch
  count, types, providers, model lines, reasoning levels, and handoff.
- The router must record the exact selected provider, model line, and reasoning
  level for each dispatched judge in the workflow log.
- When composing a judge prompt, replace `<provider>`, `<model-line>`, and
  `<reasoning>` with the actual selected values.
- Always pass the same log path to every judge pass.
- Use the owning skill's artifact directory for each pass: plans in
  `docs/plans/`, reviews in `docs/reviews/`, workflow logs in `docs/workflows/`.
- Sub-agents must start with fresh context. Never fork parent history. Use a
  self-contained prompt: cwd, log path, source request, relevant artifacts, and
  output contract.
- Always close sub-agents once they return. After each pass returns its status
  line, kill the spawned sub-agent before routing the next pass; do not let them
  stick around.

### DISPATCH_PLAN

- Dispatch a planning judge from the `Planning Judge` list.
- Prompt:

```text
You are the planning judge. Use `skill: ts-plan`.

Workflow log path: <path>.
Dispatched judge: provider <provider>, model line <model-line>, reasoning <reasoning>.

Task input:
- On pass 1: produce the plan for the linked source request from the log.
- If the log contains developer feedback, use it as input to rewrite the affected
  plan sections.
- On later passes: read the canonical `plan` artifact linked in `## Artifacts`,
  use open blocking findings and the latest review handoff as inputs, and
  rewrite that same file so the affected plan sections are correct.
- On later passes, return `STATUS: BLOCKED: missing canonical plan artifact` if
  the log has no valid `plan` link.

Artifact destinations:
- Pass 1 plan artifact: `docs/plans/YYYY-MM-DD_HH:MM_<plan-name>.md`.
- Later pass plan artifact: the existing `plan` path linked in `## Artifacts`.
- Workflow log: `<path>`.
- Record exactly one canonical `plan` link in `## Artifacts`.

Before returning, you must:
- Write the plan artifact using the `ts-plan` artifact rules.
- For revisions, write back to the canonical `plan` path. Do not add a second
  plan link.
- Write or update the workflow log at `<path>`.
- Keep the workflow log as coordination state with links, finding dispositions,
  pass status, and handoff.
- Record the dispatched judge and every worker as provider, model line, and
  reasoning level in the workflow log.
- Record worker dispatches as `<count> (<type>: <provider>/<model-line>/<reasoning>, ...)`, e.g.
  `2 (api-contract: openai/gpt-5.3-codex-spark/high, test-inventory: anthropic/sonnet latest/high)`.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### DISPATCH_REVIEW

- Dispatch a review judge from the `Review Judge` list.
- Prompt:

```text
You are the review judge. Use `skill: ts-review`.

Workflow log path: <path>.
Dispatched judge: provider <provider>, model line <model-line>, reasoning <reasoning>.

Review the canonical `plan` artifact linked in `## Artifacts`
against the source request. Score the plan only; there is no implementation diff
in this workflow. Return
`STATUS: BLOCKED: missing valid plan artifact link` until that target exists.
Run the review against all review types from `skill: ts-review`.

This is a formal workflow review, not an informal review. You must write a
separate review artifact, even when there are no findings.
When updating `## Open Findings`, preserve each finding severity in the
finding text, e.g. `critical: missing rollback step`. Critical and high
findings must be recorded as `fix now`; do not downgrade them to `follow-up` or
`waiver`. If a critical or high finding needs a human exception, return
`STATUS: ESCALATE`. Low findings inside the workflow scope should be `fix now`;
use `follow-up` only for work outside the current scope and record the
executable follow-up.

Review status semantics:
- `STATUS: DONE`: review completed with no blocking findings.
- `STATUS: BLOCKED`: review completed with blocking findings for the next planning pass.
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
- Record the dispatched judge and every worker as provider, model line, and
  reasoning level in the workflow log.
- Record worker dispatches as `<count> (<type>: <provider>/<model-line>/<reasoning>, ...)`, e.g.
  `2 (automatic-testing: openrouter/glm latest/xhigh, robustness: anthropic/opus latest/xhigh)`.

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
- If planning returns `BLOCKED` or `ESCALATE`, stop and report.
- If review returns `ESCALATE`, stop and report.
- If review returns `BLOCKED`, route from `## Open Findings`.
- Treat these as blocking findings:
  - any `fix now` finding
  - any open critical or high finding, regardless of disposition
- If review has no blocking findings, stop with `STATUS: DONE`.
- If review has blocking findings and the round limit is not reached, dispatch
  planning again with the same log path and canonical plan path.
- If developer feedback arrives after any router report, handle it through
  `HANDLE_DEVELOPER_FEEDBACK`.
- Default round limit is 5 unless the user sets another. One round is one
  planning pass followed by one review pass.
- If the round limit is reached with open blocking findings, stop with
  `STATUS: BLOCKED: review loop limit reached`.

### HANDLE_DEVELOPER_FEEDBACK

- Developer feedback means user change requests after a router report, including
  after `STATUS: DONE`.
- Interpret every change request in developer feedback as a planner task. Words
  such as `change`, `update`, `fix`, `add`, `remove`, `rewrite`, `revise`, and
  `adjust` always mean dispatch the planner.
- Reopen the workflow as a new round.
- Record the feedback in `## Timeline` and `## Current State` as the next
  handoff.
- Dispatch planning with the same log path and canonical plan path.
- Run review after that planning pass.
- Before dispatch, update only the workflow log. Never edit the plan.

## Stop Conditions

- `STATUS: DONE`: latest review pass completed and `## Open Findings` has no blocking findings.
- `STATUS: BLOCKED: <reason>`: required input, dependency, or verification is
  unavailable. Includes `subagents unavailable`, `invalid handoff`, and
  `review loop limit reached`.
- `STATUS: ESCALATE: <reason>`: a human decision is needed.
