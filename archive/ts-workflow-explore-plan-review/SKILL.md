---
name: ts-workflow-explore-plan-review
description: Run an interactive explore phase followed by a plan-review loop. Only explicitly triggered by user.
---

# Workflow Explore Plan Review

## Router Required Reading

- skill: ts-workflow-plan-review

Do not read `ts-explore`, `ts-plan`, `ts-review`, or `ts-log` in this router. Pass
`ts-explore` verbatim to the dispatched exploration judge. The delegated
`ts-workflow-plan-review` skill creates the work log, plans, reviews, chooses passes, sets round limits,
chooses actions for findings, and decides when to stop.

## Role

Workflow Explore Plan Review is a router.

It runs a fixed sequence:

`judge-explore -> user gate -> ts-workflow-plan-review`

The router starts an exploration judge, passes messages between it and the user, gets approval for the design,
then invokes `ts-workflow-plan-review`. The plan must follow the accepted design document.

The router does not explore, combine findings, plan, review, or edit code.

Use this when the user wants to explore a problem interactively, agree on a
design, then produce and review an implementation plan. This skill does not
implement code. The design and plan are artifacts.

## Artifact Rules

- Exploration has one main design document before approval.
- The first pass ready for approval writes the design and returns its path.
- Apply user feedback before approval to that same design file.
- Do not create `revised`, `v2`, or replacement design files for approval feedback.
- After approval, the delegated plan-review workflow owns one main plan
  artifact.

## Sub-Agent Selection

Choose the exploration judge as follows.

- Choose the first available entry for the judge role.
- If the agent tool cannot set provider, model line, and reasoning separately, choose the closest available model.
  Record what actually ran.
- Do not dispatch extra judges just to use every entry.

### Exploration Judge

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `astra` latest | `high` |
| 2 | Anthropic | `fable` latest | `high` |
| 3 | OpenAI | `sol` latest | `high` |
| 4 | Anthropic | `opus` latest | `high` |
| 5 | Cursor | `composer` | `high` |

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
- Read context, ask questions, combine findings, make decisions, and write the design document.
- Write the design document when it is clear enough for the user to review for approval.
- Use `docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md` for the first design
  artifact.
- After the first design artifact exists, update that same file.

Conversation rules:
- Ask only questions whose answers change the design.
- Return questions or approval summaries for the router to pass to the user.
- Do not ask the router to combine findings or make design decisions.
- If the user gives feedback after an approval summary, update the same design file and return a new approval summary.

Return exactly one status line at the end of each response:
STATUS: NEEDS_USER_INPUT
STATUS: DESIGN_READY: <design-artifact-path>
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

### RELAY_EXPLORATION

- Pass each exploration judge question or summary of findings to the user.
- Relay each user answer or correction back to the same exploration judge.
- Do not summarize, reinterpret, or decide what is being discussed.
- If the judge returns `STATUS: NEEDS_USER_INPUT`, continue the relay loop.
- If the judge returns `STATUS: DESIGN_READY` without a user-facing approval
  summary and design artifact path, close the judge session and stop with
  `STATUS: BLOCKED: invalid handoff`.
- If the judge returns `STATUS: BLOCKED` or `STATUS: ESCALATE`, close the judge
  session, stop, and report the status.
- If the judge returns no status line or more than one, close the judge session
  and stop with `STATUS: BLOCKED: invalid handoff`.
- If the user pauses before design approval, keep the workflow paused with the
  exploration judge state as the active context.

### PASS_DESIGN_GATE

- When the judge returns `STATUS: DESIGN_READY: <design-artifact-path>`, relay
  the judge's approval summary to the user.
- Approval requires all of these:
  - the design artifact path is present;
  - the exploration judge says the design is ready;
  - the user explicitly accepts the design or asks to proceed after seeing the
    approval summary.
- If the user accepts the design, close the exploration judge session and
  continue to `RUN_PLAN_REVIEW`.
- If the user does not accept the design, relay the feedback back to the same
  exploration judge and continue `RELAY_EXPLORATION`.
- After approval, do not revise the design unless the user explicitly
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
- Follow the accepted design document.
- Produce and review the implementation plan only. Do not implement code.
- If the plan-review loop discovers that the accepted design must change, stop
  with `STATUS: ESCALATE: design change required`.
```

- Do not restate or override the delegated workflow's rules for assigning agents, reviewing, choosing passes,
  choosing actions for findings, round limits, or stopping.
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
- `STATUS: ESCALATE: design change required`: a valid plan requires changing the accepted design.
