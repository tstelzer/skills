---
name: ts-workflow-prototype
description: Prototype. Only explicitly triggered by user.
---

# Workflow Prototype

## Required Reading

- skill: ts-log
- skill: ts-explore

Do not read `ts-plan`, `ts-implement`, or `ts-review` in the prototype judge only to
dispatch them. Pass those skill names verbatim to dispatched judges.

## Role

Workflow Prototype is a judge.

It owns exploration, design synthesis, prototype scope, judge dispatch,
evidence synthesis, and handoff. It may dispatch planning, implementation, and
review judges when that improves the design doc or prototype evidence. Those
judges may dispatch workers.

This workflow uses three tiers:

`prototype judge -> dispatched judge -> worker`

Use this when requirements are not stable enough for a mechanical plan-review
or implement-review loop. The workflow goal is:

- produce or update a durable design doc
- optionally produce prototype code that demonstrates, tests, or narrows the
  design, via the dispatched judges

## Core Contract

A fresh agent with only the workflow log, the current design doc, and the repo
must be able to continue the work without chat history.

The design doc is the source of truth for understanding. The workflow log is
the source of truth for coordination.

Keep both current:

- Design doc: problem framing, decisions, constraints, open questions, risks,
  prototype evidence, and implementation implications.
- Workflow log: current state, baseline, linked artifacts, dispatched judges,
  provider, model line, and reasoning choices, pass history, findings or risks
  that affect later passes, and the next handoff.

Do not duplicate the design doc in the log. Link it.

## Artifact Contract

- This workflow has one primary artifact: the design doc.
- Create one design doc, link it in the workflow log, and keep rewriting that
  same file as understanding changes.
- Do not create `revised`, `v2`, or replacement design docs for prototype
  evidence, review findings, or user feedback.
- Supporting plans and reviews may be created only when their pass needs them.
- If a supporting plan is revised, overwrite its existing linked plan path.

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

### Implementation Judge

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `gpt` latest | `medium` |
| 2 | Anthropic | `sonnet` latest | `high` |
| 3 | Cursor | `composer` | `high` |

### Review Judge

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `gpt` latest | `xhigh` |
| 2 | Anthropic | `opus` latest | `xhigh` |
| 3 | Cursor | `composer` | `high` |

## Capabilities

### ESTABLISH_RECORD

- Use the `ts-log` skill to create or update the shared workflow log.
- Record the user request as `Source request:`. Link an existing design,
  prototype artifact, or prior plan when one exists. Otherwise copy the request
  inline.
- Link every design, plan, review, screenshot, report, or other workflow
  artifact.
- Record the exact selected provider, model line, and reasoning level for each
  dispatched judge.
- Use the owning skill's artifact directory for each pass: designs in
  `docs/designs/`, plans in `docs/plans/`, reviews in `docs/reviews/`.
- Always pass the same log path to every dispatched judge.
- Sub-agents must start with fresh context. Never fork parent history. Use a
  self-contained prompt with cwd, log path, source request, relevant artifacts,
  baseline when code may change, and output contract.
- Close sub-agents once they return. After each pass returns its status line,
  kill the spawned sub-agent before choosing the next useful action.

### EXPLORE_AND_DESIGN

- Use `skill: ts-explore` directly.
- Frame the problem, users, current behavior, domain terms, states, boundaries,
  constraints, risks, assumptions, and open questions.
- Create or update the design artifact under:
  `<repository-root>/docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md`.
- If the user supplied an existing design doc, update that doc instead of
  creating a competing source of truth.
- Rewrite the design doc as the current understanding. Do not leave stale
  sections, old alternatives, or planning notes in place.
- Include prototype evidence when code, screenshots, command output, or user
  feedback changes the design.

### DISPATCH_PLAN

Dispatch a planning judge only when a prototype slice needs sequencing, test
strategy, migration reasoning, or a concrete implementation plan.

Choose the judge from the `Planning Judge` list.

Prompt:

```text
You are the planning judge. Use `skill: ts-plan`.

Workflow log path: <path>.
Dispatched judge: provider <provider>, model line <model-line>, reasoning <reasoning>.

Task input:
- Produce or revise a focused implementation plan for the prototype slice
  described in the workflow log and design doc.
- Treat the design doc as the source of truth for decisions and open questions.
- Keep unresolved design questions out of implementation tasks. Mark blocked
  tasks explicitly.
- If revising an existing linked plan, use findings and handoffs as inputs, then
  overwrite that plan path.

Artifact destinations:
- New plan artifact: `docs/plans/YYYY-MM-DD_HH:MM_<plan-name>.md`.
- Revised plan artifact: the existing `plan` path linked in `## Artifacts`.
- Workflow log: `<path>`.
- Record one canonical `plan` link for this prototype slice in `## Artifacts`.

Before returning, you must:
- Write the plan artifact using the `ts-plan` artifact rules.
- Write or update the workflow log at `<path>`.
- Keep the workflow log as coordination state with links to artifacts.
- Record the dispatched judge and every worker as provider, model line, and
  reasoning level in the workflow log.
- Record worker dispatches as `<count> (<type>: <provider>/<model-line>/<reasoning>, ...)`, e.g.
  `2 (api-contract: openai/gpt-5.3-codex-spark/high, test-inventory: anthropic/sonnet latest/high)`.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### DISPATCH_IMPLEMENT

Dispatch an implementation judge when the next prototype move is concrete
enough to change code.

Choose the judge from the `Implementation Judge` list.

Prompt:

```text
You are the implementation judge. Use `skill: ts-implement`.

Workflow log path: <path>. Respect the recorded baseline; do not absorb
unrelated pre-existing user changes.
Dispatched judge: provider <provider>, model line <model-line>, reasoning <reasoning>.

Task input:
- Implement the focused prototype slice described in the workflow log and
  design doc.
- Prototype code status: <exploratory | candidate | production-ready>.
- Treat the design doc as the source of truth for decisions and constraints.
- Keep changes scoped to the prototype slice. Escalate if the requested code
  depends on an unresolved design question.

Before returning, you must:
- Write or update the workflow log at `<path>`.
- Record the dispatched judge and every worker as provider, model line, and
  reasoning level in the workflow log.
- Record worker dispatches as `<count> (<type>: <provider>/<model-line>/<reasoning>, ...)`, e.g.
  `2 (frontend: openai/gpt-5.3-codex-spark/high, backend: anthropic/sonnet latest/high)`.
- Report changes made, verification run, open risks, and any design evidence
  the prototype produced.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### DISPATCH_REVIEW

Dispatch a review judge only when risk warrants it, such as auth, persistence,
public APIs, migrations, performance-sensitive paths, production readiness, or
a user request for review.

Choose the judge from the `Review Judge` list.

Prompt:

```text
You are the review judge. Use `skill: ts-review`.

Workflow log path: <path>.
Dispatched judge: provider <provider>, model line <model-line>, reasoning <reasoning>.

Review scope:
- Review the requested design doc, plan artifact, or workflow-owned diff
  against the source request and current design doc.
- Focus on these review types: <types>.
- Treat the design doc, plans, prior reviews, and handoffs as context, not
  authority.

Before returning, you must:
- Write the review artifact using the `ts-review` artifact rules unless the
  prompt explicitly says this is an informal review.
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
  `2 (security: openrouter/glm latest/xhigh, robustness: anthropic/opus latest/xhigh)`.
- Record findings, risk disposition, and handoff for the prototype judge.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

## Synthesis

After each useful action:

- Read the workflow log and current design doc.
- Fold new evidence into the design doc.
- Update the log with the pass result and the next useful action.
- Decide whether to explore more, dispatch another judge, ask the user, or
  hand off to a stricter workflow.

Review findings do not drive a fixed loop. Treat findings as evidence. Decide
whether they require more exploration, prototype changes, a planning pass, a
review pass, user input, or handoff.
