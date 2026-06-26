---
name: workflow-explore-plan-review
description: Run an interactive explore phase followed by a plan-review loop. Only explicitly triggered by user.
---

# Workflow Explore Plan Review

## Required Reading

- skill: explore
- skill: workflow-plan-review

Do not read `plan`, `review`, or `log` in this workflow. The delegated
`workflow-plan-review` skill owns that routing and its required reading.

## Role

Workflow Explore Plan Review is an adapter.

First, the parent agent is an exploration judge. It uses `skill: explore` in
the active conversation, loads context, asks questions, synthesizes decisions,
and writes the design artifact.

After the design gate passes, the parent agent invokes
`skill: workflow-plan-review` with the accepted design artifact as source
context. The delegated workflow owns log creation, planning, review, routing,
round limits, finding dispositions, and stop conditions.

Use this when the user wants to explore a problem interactively, agree on a
design, then produce and review an implementation plan. This skill does not
implement code. The design and plan are artifacts.

## Workflow

1. EXPLORE_DESIGN
2. PASS_DESIGN_GATE
3. RUN_PLAN_REVIEW

### EXPLORE_DESIGN

- Use `skill: explore` as an in-thread judge. Do not dispatch exploration to a
  sub-agent. Keep this phase interactive with the user.
- The parent agent owns scope, context loading, questions, synthesis,
  decisions, and the design artifact.
- Treat this phase as knowledge finding, not routing.
- Explore the problem space, solution space, existing system, constraints,
  tradeoffs, decisions, risks, and open questions.
- Ask only questions whose answers change the design.
- Synthesize after context loads and after material user input.
- Write the design artifact at the end of this phase, after the user and parent
  agent agree the design is coherent enough to plan from.
- Follow `explore` artifact rules for source-owned contracts, durable design
  language, standalone context, and domain-specific sections.
- The artifact path is
  `docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md`.

### PASS_DESIGN_GATE

- State the design gate in chat: proposed design artifact path, core decisions,
  accepted constraints, assumptions, risks, and unresolved questions.
- The gate passes only when:
  - the design artifact exists;
  - the parent agent judges the design good enough to plan from;
  - the user explicitly accepts the design or asks to proceed after seeing the
    gate summary.
- If the parent agent is not satisfied, continue `EXPLORE_DESIGN`.
- If the user is not satisfied, continue `EXPLORE_DESIGN` using the feedback.
- When the user accepts the gate summary, write the design artifact. If open
  questions remain, record them as assumptions, risks, deferred capabilities,
  or follow-up exploration targets before passing the gate.
- After the gate passes, do not revise the design unless the user explicitly
  returns the workflow to exploration.

### RUN_PLAN_REVIEW

- Invoke `skill: workflow-plan-review`.
- Use this handoff:

```text
Source request:
<original user request>

Design artifact:
<path to accepted design artifact>

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

- Before `RUN_PLAN_REVIEW`, continue exploration until the design gate passes
  or the user pauses.
- After `RUN_PLAN_REVIEW`, use the status returned by
  `workflow-plan-review`.
- `STATUS: ESCALATE: design change required`: the accepted design cannot stand
  as the source for a valid plan.
