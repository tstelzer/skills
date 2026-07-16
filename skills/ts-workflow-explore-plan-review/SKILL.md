---
name: ts-workflow-explore-plan-review
description: Run an interactive explore phase followed by a plan-review loop. Only explicitly triggered by user.
---

# Workflow Explore Plan Review

## Router Required Reading

- skill: ts-workflow-plan-review

Do not read `ts-explore`, `ts-plan`, `ts-review`, or `ts-log` in this router. Pass
`ts-explore` verbatim to the dispatched exploration judge. The delegated
`ts-workflow-plan-review` skill owns log creation, planning, review, routing,
round limits, finding dispositions, and stop conditions.

## Role

Workflow Explore Plan Review is a router.

It runs a fixed sequence:

`judge-explore -> user gate -> ts-workflow-plan-review`

The router dispatches an exploration judge, relays conversation between that
judge and the user, gates the accepted design, then invokes
`ts-workflow-plan-review` with the design artifact as binding source context.

The router does not explore, synthesize, plan, review, or edit code.

Use this when the user wants to explore a problem interactively, agree on a
design, then produce and review an implementation plan. This skill does not
implement code. The design and plan are artifacts.

## Artifact Contract

- Exploration has one primary design artifact before the gate.
- The first gate-ready pass creates the design and returns its path.
- User feedback before the gate updates that same design file.
- Do not create `revised`, `v2`, or replacement design files for gate feedback.
- After the gate, the delegated plan-review workflow owns one primary plan
  artifact.

## Sub-Agent Selection

Use this section when this skill dispatches the exploration judge.

- Choose the first available entry for the judge role.
- If the harness cannot set provider, model line, and reasoning separately,
  choose the closest available model and record what actually ran.
- Do not dispatch extra judges just to use every entry.

### Exploration Judge

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `sol` latest | `xhigh` |
| 2 | Anthropic | `fable` latest | `high` |
| 3 | Cursor | `composer` | `high` |

## Workflow

1. DISPATCH_EXPLORE
2. RELAY_EXPLORATION
3. PASS_DESIGN_GATE
4. RUN_PLAN_REVIEW

### DISPATCH_EXPLORE

- Dispatch one exploration judge from the `Exploration Judge` list.
- Keep the same exploration judge session alive for the whole exploration
  phase. Do not spawn a fresh judge for each user question.
- If exploration judge dispatch fails, stop with
  `STATUS: BLOCKED: subagents unavailable`.
- Prompt:

```text
You are the exploration judge. Use `skill: ts-explore`.

Dispatched judge: provider <provider>, model line <model-line>, reasoning <reasoning>.

Task input:
- Explore the original user request interactively.
- Own context loading, questions, synthesis, decisions, and the design artifact.
- Write the design artifact when the design is coherent enough for user gate
  review.
- Use `docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md` for the first design
  artifact.
- After the first design artifact exists, update that same file.

Interaction contract:
- Ask only questions whose answers change the design.
- Return user-facing questions or gate summaries for the router to relay.
- Do not ask the router to synthesize or decide design content.
- If the user gives feedback after a gate summary, update the same design file
  and return a new gate summary.

Return exactly one status line at the end of each response:
STATUS: NEEDS_USER_INPUT
STATUS: DESIGN_READY: <design-artifact-path>
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### RELAY_EXPLORATION

- Relay each exploration judge question or synthesis to the user.
- Relay each user answer or correction back to the same exploration judge.
- Do not summarize, reinterpret, or resolve the substance of the exchange.
- If the judge returns `STATUS: NEEDS_USER_INPUT`, continue the relay loop.
- If the judge returns `STATUS: DESIGN_READY` without a user-facing gate
  summary and design artifact path, close the judge session and stop with
  `STATUS: BLOCKED: invalid handoff`.
- If the judge returns `STATUS: BLOCKED` or `STATUS: ESCALATE`, close the judge
  session, stop, and report the status.
- If the judge returns no status line or more than one, close the judge session
  and stop with `STATUS: BLOCKED: invalid handoff`.
- If the user pauses before the design gate, keep the workflow paused with the
  exploration judge state as the active context.

### PASS_DESIGN_GATE

- When the judge returns `STATUS: DESIGN_READY: <design-artifact-path>`, relay
  the judge's gate summary to the user.
- The gate passes only when:
  - the design artifact path is present;
  - the exploration judge says the design is ready;
  - the user explicitly accepts the design or asks to proceed after seeing the
    gate summary.
- If the user accepts the design, close the exploration judge session and
  continue to `RUN_PLAN_REVIEW`.
- If the user does not accept the design, relay the feedback back to the same
  exploration judge and continue `RELAY_EXPLORATION`.
- After the gate passes, do not revise the design unless the user explicitly
  returns the workflow to exploration.

### RUN_PLAN_REVIEW

- Invoke `skill: ts-workflow-plan-review`.
- Use this handoff:

```text
Source request:
<original user request>

Design artifact:
<accepted design artifact path>

Plan-review constraints:
- Treat the design artifact as binding source context.
- Produce and review the implementation plan only. Do not implement code.
- If the plan-review loop discovers that the accepted design must change, stop
  with `STATUS: ESCALATE: design change required`.
```

- Do not restate or override the delegated workflow's dispatch, review,
  routing, finding disposition, round limit, or stop-condition rules.
- Relay the delegated workflow status as this workflow status.

## Stop Conditions

- `STATUS: DONE`: the delegated `ts-workflow-plan-review` returns done.
- `STATUS: BLOCKED: subagents unavailable`: exploration judge dispatch failed.
- `STATUS: BLOCKED: invalid handoff`: the exploration judge returned no status
  line or more than one.
- `STATUS: BLOCKED: <reason>`: the exploration judge or delegated
  `ts-workflow-plan-review` returns blocked.
- `STATUS: ESCALATE: <reason>`: the exploration judge or delegated
  `ts-workflow-plan-review` returns escalate.
- `STATUS: ESCALATE: design change required`: the accepted design cannot stand
  as the source for a valid plan.
