---
name: explore
description: Use for deep exploration of a problem or solution space before planning, implementation, or review.
---

# Explore

## Required Reading

- skill: principles
- all principle details relevant to the topic

## Role

Explore is a judge.

It owns scope, context loading, questions, synthesis, decisions, and any saved
design artifact. Use it to build a source of truth about a problem space,
solution space, domain, workflow, system behavior, or product decision.

Exploration may run as chat or produce a written artifact.

Default to chat. Write an artifact when the user asks for one, the result should
outlive the conversation, or later planning, implementation, or review depends
on the captured understanding.

The judge may do the work directly. Delegate only when a bounded lens can run
independently, such as domain modeling, existing behavior, user workflow, API
contracts, state models, abuse cases, operations, migration risk, or prior art.
Workers return notes. The judge writes the artifact.

## Workflow

1. DETERMINE_OUTPUT
2. LOAD_CONTEXT
3. MAP_SPACE
4. RUN_EXPLORATION_LOOP
5. FINISH_OR_CONTINUE

### DETERMINE_OUTPUT

- Choose `chat` or `written artifact`.
- Name the subject and scope.
- Identify whether exploration should feed planning, implementation, review,
  strategy, documentation, or future exploration.

### LOAD_CONTEXT

- Read repo files, docs, configs, prior plans, prior designs, `AGENTS.md`, and
  external references when they change the understanding.
- Read relevant principle detail docs and use them as lenses for the topic.
- Use semantic skill names for external skills, e.g. `skill: principles`.
- Use paths for local files.

### MAP_SPACE

Build the smallest useful map:

- goal or decision
- users, actors, readers, or operators
- current state
- domain terms
- states and transitions
- boundaries and ownership
- contracts and long-lived interfaces
- constraints
- assumptions
- risks and edge cases
- unknowns

Adapt the map to the topic. A general problem space may need taxonomy,
principles, tradeoffs, history, or competing frames. A product workflow may need
actors, states, failure modes, and constraints.

### RUN_EXPLORATION_LOOP

Repeat until the exploration is clear enough, the user pauses, or the user asks
to move to another phase:

1. ASK_QUESTIONS
2. SYNTHESIZE
3. CHECK_GATES
4. WRITE_ARTIFACT

For written artifacts, write early and keep the design document current after
each meaningful synthesis. The user should be able to stop and resume from the
artifact without losing important context.

### ASK_QUESTIONS

- Ask only questions whose answers change the understanding.
- Prefer one critical question over several weak ones.
- Keep question batches answerable and purposeful.
- Explain what decision or uncertainty each question unlocks when useful.
- Stop asking when the next synthesis step is clear enough.

### SYNTHESIZE

Give each material item a disposition:

- accepted fact
- assumption
- decision
- open question
- out of scope
- risk
- follow-up exploration target

Resolve disagreements and contradictions when possible. Preserve them as open
questions or risks when they remain unresolved.

### CHECK_GATES

At each synthesis point, verify:

- The synthesis answers the requested exploration scope.
- Assumptions are labeled.
- Open questions are real unresolved unknowns.
- Risks, edge cases, and constraints are captured when relevant.
- The output stays at exploration level: concepts, constraints, decisions,
  tradeoffs, risks, and open questions.
- The next phase is clear: continue exploration, plan, implement, review, document,
  or stop.

For written artifacts, also verify:

- The artifact stands alone without prior chat.
- Durable terms, decisions, rejected options, and constraints are preserved.
- Section choices fit the topic.

### WRITE_ARTIFACT

- For chat output, summarize the current understanding, tradeoffs, risks, open
  questions, and next phase.
- For written output, create `docs/designs/` if needed, then create or update:
  `<repository-root>/docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md`.
- Rewrite the whole artifact on each update so it reads as the current source
  of truth.

### FINISH_OR_CONTINUE

- Continue exploration when useful questions remain.
- Move to planning, implementation, review, documentation, or stop when the
  next phase is clear.
- If chat exploration has produced durable context, ask whether to save it before
  switching phases.

## Artifact Template

```markdown
# Design: <Name>

## Summary
<The problem or solution space and current understanding.>

## Context
<Background, audience, existing state, constraints, and why this matters.>

## Goals
<Outcomes this design understanding should support.>

## Non-Goals
<Boundaries for this exploration. Skip if none.>

## Current Understanding
<Domain facts, user needs, system behavior, constraints, assumptions, and edge cases.>

## Design Shape
<Conceptual model, requirements, interfaces, UX shape, system behavior, or decision frame.>

## Decisions
<Resolved decisions and rationale. Skip if none.>

## Options Considered
<Accepted, rejected, and deferred approaches with rationale.>

## Risks and Edge Cases
<Failure modes, abuse cases, unclear scenarios, and weak assumptions.>

## Open Questions
<Unresolved decisions or unknowns. Skip if none.>

## Next Step
<Continue exploration, plan, implement, review, document, or stop.>
```
