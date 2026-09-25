---
name: ts-workflow-implement-review
description: Run an implement-review loop. Only explicitly triggered by user.
---

# Workflow Implement Review

## Router Required Reading

- skill: ts-log

The router must not read `ts-implement` or `ts-review`. Pass those exact skill names to the assigned judges.

## Role

Workflow Implement Review is a router.

It runs a fixed sequence:

`(judge-implement -> judge-review){1,n}`

It sends each pass to a sub-agent judge, reads the status and planned action for each finding,
and chooses the next pass. It never edits, reviews, verifies, or changes code
itself.

The router writes only the work log. A dispatched judge makes any code changes.

Use this when the user asks to build, implement, fix, or change code and wants a
review loop. This skill does not create a plan. The user request can be ad-hoc
or linked to a prior plan.

## Sub-Agent Selection

Choose sub-agent judges as follows.

- Choose the first available entry for the judge role.
- If the agent tool cannot set provider, model line, and reasoning separately, choose the closest available model.
  Record what actually ran.
- Do not dispatch extra judges just to use every entry.

### Implementation Judge

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `sol` latest | `high` |
| 2 | Anthropic | `opus` latest | `high` |
| 3 | OpenAI | `terra` latest | `medium` |
| 4 | Cursor | `composer` | `high` |

### Review Judge

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `astra` latest | `high` |
| 2 | Anthropic | `fable` latest | `high` |
| 3 | OpenAI | `sol` latest | `high` |
| 4 | Anthropic | `opus` latest | `high` |
| 5 | Cursor | `composer` | `high` |

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
- Record where work starts: base ref (current `git HEAD`) and files already changed (`git status`).
- The router creates the log and records which pass runs next. Each judge pass records its own log entry,
  artifact links, findings, worker count, types, providers, model lines, reasoning levels, and handoff.
- Record each dispatched judge's exact provider, model line, and reasoning level in the work log.
- Replace `<provider>`, `<model-line>`, and `<reasoning>` in each judge prompt with the selected values.
- Always pass the same log path to every judge pass.
- Use the owning skill's artifact directory for each pass: reviews in
  `docs/reviews/`, work logs in `docs/work-logs/`.
- Start sub-agents with fresh context. Never pass parent history. Give each a complete prompt with the cwd,
  log path, source request, baseline, relevant artifacts, and required response format.
- Close each sub-agent after it returns its status line, before choosing the next pass.

### DISPATCH_IMPLEMENT

- Dispatch an implementation judge from the `Implementation Judge` list.
- Prompt:

```text
You are the implementation judge. Use `skill: ts-implement`.

Work log path: <path>. Use the recorded baseline to keep unrelated earlier user changes out of your work.
Dispatched judge: provider <provider>, model line <model-line>, reasoning <reasoning>.

Task input:
- On pass 1: implement the linked source request from the log.
- Apply developer feedback recorded in the log during implementation.
- On later passes, fix each blocker with the smallest change within scope.
  Treat suggested fixes as advice.
- Escalate before expanding a public contract, architecture, what gets deployed, or product scope
  without recorded user permission.
- Preserve the writing edits the reviewer recorded in the log unless an open finding explicitly requires changing them.

Before returning, you must:
- Write or update the work log at `<path>`.
- Record the dispatched judge and every worker as provider, model line, and
  reasoning level in the work log.
- Record worker dispatches as `<count> (<type>: <provider>/<model-line>/<reasoning>, ...)`, e.g.
  `2 (frontend: openai/terra latest/medium, backend: anthropic/sonnet latest/medium)`.

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

Review the changes made by this workflow against the source request, recorded baseline,
and latest implementation handoff in the log.
The source request, named plan or design, and recorded user decisions set the review requirements.
Principles do not expand them. The first formal review is
`initial`; later reviews are `follow-up`.

For a new inspection, run all review types from `skill: ts-review`.
When answering pending review questions, continue ruling on findings from the existing artifact.
Keep the mode, finding IDs, and admission classes. Inspect only missing or changed evidence.
Workers do not know the mode or prior rulings. Classify their findings:
- `regular`: found in the first review or caused by a known later change
- `out-of-scope`: not supported by the review requirements or fix
- `carried`: the same open finding is still unresolved
- `regression`: the same resolved finding has returned
- `late`: first reported in a follow-up without a later change that caused it

Use `carried` or `regression` only for the prior ID with the same contract and impact.
Classify broader defects separately. New follow-up findings default to `late`.
Use `regular` only when evidence identifies the later change that caused the defect.
Record `**Admission:**` and `**Scope Basis:**` with the requirement, decision, finding ID, or fix.
Technical-writing review may make direct writing edits allowed by `ts-review`.
Count those edits as changes made by the review within this workflow.
In a follow-up review, limit technical-writing direct edits to writing changed
by the latest implementation pass or required by an open finding.

Rule on every finding before assigning work. Keep rejected, resolved, and duplicate findings in the review artifact.
Do not assign fixes for them.
For deferred rulings, record the finding IDs and exact questions in the log and
return `STATUS: ESCALATE: review context needed` for the router to relay.
Choose actions only for upheld findings, using their final severity:
- Critical and high `regular`, `carried`, and `regression`: `fix now`.
- Critical and high `late`: record it and return `STATUS: ESCALATE`.
- Low or `out-of-scope`: `follow-up` with enough detail to carry out.
- Work outside the review requirements: `STATUS: ESCALATE`.

This is a formal workflow review. Write a separate review artifact even when there are no findings.
Keep upheld and deferred findings in `## Open Findings`, with ruling, reasoning,
final severity, admission, scope basis, disposition, and next action. Remove
closed entries from that section; retain every finding in the review artifact.

Review status meanings:
- `STATUS: DONE`: review completed with no blocking findings or deferred rulings.
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
- Keep links, the planned action for each finding, pass status, worker metadata, and handoff in the work log.
- If direct edits were made, record changed paths and purpose in the review
  artifact and work log handoff.
- Record the dispatched judge and every worker as provider, model line, and
  reasoning level in the work log.
- Record worker dispatches as `<count> (<type>: <provider>/<model-line>/<reasoning>, ...)`, e.g.
  `2 (automatic-testing: anthropic/fable latest/high, robustness: openai/astra latest/high)`.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### ROUTE_NEXT_PASS

- Read `## Open Findings` and `## Current State` from the log before deciding.
- Count each completed review round once in `## Current State`.
  Pausing for context and resuming rulings stays within the same round.
- If subagent dispatch fails (tool error, no return), stop with `STATUS: BLOCKED: subagents unavailable`.
- If a dispatched judge returns no status line or more than one, stop with `STATUS: BLOCKED: invalid handoff`.
- If implementation returns `BLOCKED` or `ESCALATE`, stop and report.
- If review returns `ESCALATE`, relay its recorded questions or decision to the
  user. Leave the next handoff in `## Current State`; stop until answered.
- If review returns `BLOCKED`, route from `## Open Findings`.
- Treat every `fix now` finding as blocking. Use the action chosen by the review judge.
  The router must not reclassify findings.
- If review has no blocking findings or deferred rulings, stop with `STATUS: DONE`.
- If review has blocking findings and rounds remain, run implementation again with the same log path.
- If developer feedback arrives after any router report, handle it through
  `HANDLE_DEVELOPER_FEEDBACK`.
- Default round limit is 5 unless the user sets another. One round is one
  implementation pass followed by one review pass.
- If the round limit is reached with open blocking findings, stop with
  `STATUS: BLOCKED: review loop limit reached`.

### HANDLE_DEVELOPER_FEEDBACK

- Record user feedback verbatim in `## Timeline` and its next handoff in
  `## Current State`, including feedback after `STATUS: DONE`.
- Send answers to pending review questions to a fresh review judge with the same log and review artifact.
  Continue rulings in the same round. The judge records context useful to later tasks and updates the rulings.
- Route code change requests to implementation as a new round, then review.
  Pass the same log path and any accompanying context answers.
- Before dispatch, update only the work log. Never edit code.

## Stop Conditions

- `STATUS: DONE`: latest review pass completed with no blocking findings or
  deferred rulings in `## Open Findings`.
- `STATUS: BLOCKED: <reason>`: required input, dependency, or verification is
  unavailable. Includes `subagents unavailable`, `invalid handoff`, and
  `review loop limit reached`.
- `STATUS: ESCALATE: <reason>`: a human decision is needed.
