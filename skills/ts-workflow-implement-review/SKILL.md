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

It dispatches judge passes to subagents, reads status and finding dispositions,
and routes the next pass. It never edits, reviews, verifies, or changes code
itself.

The router's only write target is the work log. Any code change belongs to a
dispatched judge.

Use this when the user asks to build, implement, fix, or change code and wants a
review loop. This skill does not create a plan. The user request can be ad-hoc
or linked to a prior plan.

## Sub-Agent Selection

Use this section when this skill dispatches sub-agent judges.

- Choose the first available entry for the judge role.
- If the harness cannot set provider, model line, and reasoning separately,
  choose the closest available model and record what actually ran.
- Do not dispatch extra judges just to use every entry.

### Implementation Judge

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `terra` latest | `high` |
| 2 | Anthropic | `sonnet` latest | `high` |
| 3 | Cursor | `composer` | `high` |

### Review Judge

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `sol` latest | `xhigh` |
| 2 | Anthropic | `fable` latest | `xhigh` |
| 3 | Cursor | `composer` | `high` |

## Workflow

1. CREATE_LOG
2. DISPATCH_IMPLEMENT
3. DISPATCH_REVIEW
4. ROUTE_NEXT_PASS
5. HANDLE_DEVELOPER_FEEDBACK

### CREATE_LOG

- Use the `ts-log` skill to create the shared work log.
- Record the user request as `Source request:`. Link a plan or design artifact
  when one exists, or copy the request inline.
- Record the workflow baseline: base ref (current `git HEAD`) and starting dirty
  files (`git status`).
- In this workflow, the router owns log creation and routing state. Each
  judge pass owns its own log entry, artifact links, findings, worker dispatch
  count, types, providers, model lines, reasoning levels, and handoff.
- The router must record the exact selected provider, model line, and reasoning
  level for each dispatched judge in the work log.
- When composing a judge prompt, replace `<provider>`, `<model-line>`, and
  `<reasoning>` with the actual selected values.
- Always pass the same log path to every judge pass.
- Use the owning skill's artifact directory for each pass: reviews in
  `docs/reviews/`, work logs in `docs/work-logs/`.
- Sub-agents must start with fresh context. Never fork parent history. Use a
  self-contained prompt: cwd, log path, source request, baseline, relevant
  artifacts, and output contract.
- Always close sub-agents once they return. After each pass returns its status
  line, kill the spawned sub-agent before routing the next pass; do not let them
  stick around.

### DISPATCH_IMPLEMENT

- Dispatch an implementation judge from the `Implementation Judge` list.
- Prompt:

```text
You are the implementation judge. Use `skill: ts-implement`.

Work log path: <path>. Respect the recorded baseline; do not absorb
unrelated pre-existing user changes.
Dispatched judge: provider <provider>, model line <model-line>, reasoning <reasoning>.

Task input:
- On pass 1: implement the linked source request from the log.
- If the log contains developer feedback, use it as input for the implementation
  pass.
- On later passes, resolve every blocker with the smallest in-scope change.
  Treat suggested fixes as advice.
- Escalate before expanding a public contract, architecture, deployment
  surface, or product scope without recorded user authority.
- Preserve review-owned direct writing edits recorded in the log unless an open
  finding explicitly requires changing them.

Before returning, you must:
- Write or update the work log at `<path>`.
- Record the dispatched judge and every worker as provider, model line, and
  reasoning level in the work log.
- Record worker dispatches as `<count> (<type>: <provider>/<model-line>/<reasoning>, ...)`, e.g.
  `2 (frontend: openai/gpt-5.3-codex-spark/high, backend: anthropic/sonnet latest/high)`.

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

Work log path: <path>.
Dispatched judge: provider <provider>, model line <model-line>, reasoning <reasoning>.

Review the workflow-owned diff against the source request, workflow baseline,
and latest implementation handoff in the log.
The source request, named plan or design, and recorded user decisions define
the review contract. Principles do not expand it. The first formal review is
`initial`; later reviews are `follow-up`.

Run the review against all review types from `skill: ts-review`.
Workers do not know the mode. Classify their findings after they return:
- `regular`: found initially or introduced by an identified later change
- `out-of-scope`: no basis in the review contract or remediation
- `carried`: the same open finding remains unresolved
- `regression`: the same resolved finding has recurred
- `late`: first reported in a follow-up without a later change that caused it

`carried` and `regression` require the prior ID and the same contract and
impact. A broader defect gets its own class. New follow-up findings default to
`late`; use `regular` only when evidence names the later change that caused it.
Record `**Admission:**` and `**Scope Basis:**` with the requirement, decision,
finding ID, or remediation change.
Technical-writing review may make direct writing edits allowed by `ts-review`.
Treat those edits as review-owned workflow changes, not unrelated user changes.
In a follow-up review, limit technical-writing direct edits to writing changed
by the latest implementation pass or required by an open finding.

Apply these dispositions:
- Critical and high `regular`, `carried`, and `regression`: `fix now`.
- Critical and high `late`: record it and return `STATUS: ESCALATE`.
- Low or `out-of-scope`: executable `follow-up`.
- Work outside the review contract: `STATUS: ESCALATE`.

This is a formal workflow review, not an informal review. You must write a
separate review artifact, even when there are no findings.
Preserve severity, admission, scope basis, disposition, and next action in
`## Open Findings`.

Review status semantics:
- `STATUS: DONE`: review completed with no blocking findings.
- `STATUS: BLOCKED`: review completed with blocking findings for the next
  implementation pass.
- `STATUS: ESCALATE`: a human decision or exception is needed.

Before returning, you must:
- Write the review artifact using the `ts-review` artifact rules.
- Write or update the work log at `<path>`.
- Use these artifact destinations:
  - Review artifact: `docs/reviews/YYYY-MM-DD_HH:MM_<review-type>_<review-name>.md`.
  - Workflow log: `<path>`.
- Record the review artifact link in `## Artifacts`.
- Keep the work log as coordination state with links, finding dispositions,
  pass status, worker metadata, and handoff.
- If direct edits were made, record changed paths and purpose in the review
  artifact and work log handoff.
- Record the dispatched judge and every worker as provider, model line, and
  reasoning level in the work log.
- Record worker dispatches as `<count> (<type>: <provider>/<model-line>/<reasoning>, ...)`, e.g.
  `2 (automatic-testing: openrouter/glm latest/xhigh, robustness: anthropic/fable latest/xhigh)`.

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
- Treat any `fix now` finding as blocking. Use the review judge's disposition;
  do not reclassify findings in the router.
- If review has no blocking findings, stop with `STATUS: DONE`.
- If review has blocking findings and the round limit is not reached, dispatch
  implementation again with the same log path.
- If developer feedback arrives after any router report, handle it through
  `HANDLE_DEVELOPER_FEEDBACK`.
- Default round limit is 5 unless the user sets another. One round is one
  implementation pass followed by one review pass.
- If the round limit is reached with open blocking findings, stop with
  `STATUS: BLOCKED: review loop limit reached`.

### HANDLE_DEVELOPER_FEEDBACK

- Developer feedback means user change requests after a router report, including
  after `STATUS: DONE`.
- Interpret every change request in developer feedback as an implementation
  judge task. Words such as `change`, `update`, `fix`, `add`, `remove`,
  `rewrite`, `revise`, and `adjust` always mean dispatch the implementer.
- Reopen the workflow as a new round.
- Record the feedback in `## Timeline` and `## Current State` as the next
  handoff.
- Dispatch implementation with the same log path.
- Run review after that implementation pass.
- Before dispatch, update only the work log. Never edit code.

## Stop Conditions

- `STATUS: DONE`: latest review pass completed and `## Open Findings` has no
  blocking findings.
- `STATUS: BLOCKED: <reason>`: required input, dependency, or verification is
  unavailable. Includes `subagents unavailable`, `invalid handoff`, and
  `review loop limit reached`.
- `STATUS: ESCALATE: <reason>`: a human decision is needed.
