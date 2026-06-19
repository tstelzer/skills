---
name: explore
description: Explore. Only explicitly triggered by user.
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

The judge may do the work directly. Delegate only when a bounded lens can run
independently, such as domain modeling, existing behavior, user workflow, API
contracts, state models, abuse cases, operations, migration risk, or prior art.
Workers return notes. The judge writes the artifact.

## Workflow

1. SET_SCOPE
2. LOAD_CONTEXT
3. MAP_SPACE
4. RUN_EXPLORATION_LOOP
5. FINISH_OR_CONTINUE

### SET_SCOPE

- Treat exploration as knowledge finding.
- Explore the problem space, solution space, existing system, constraints,
  tradeoffs, decisions, risks, and open questions.
- Name the subject and boundary of the exploration.
- Default to chat. Write an artifact only when the user asks for one or the
  understanding should outlive the conversation.

### LOAD_CONTEXT

- Read repo files, docs, configs, prior plans, prior designs, `AGENTS.md`, and
  external references when they change the understanding.
- Read relevant principle detail docs and use them as lenses for the topic.

### MAP_SPACE

Build the smallest useful map:

- problem or decision
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

Repeat until the exploration is clear enough, the user pauses, or the requested
scope changes:

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
- source-owned contract
- constraint
- decision
- non-binding example
- implementation implication
- assumption
- open question
- out of scope
- risk
- follow-up exploration target

Before writing, classify each concrete implementation statement as a decision,
constraint, example, implementation implication, or planning note. Exclude
planning notes from durable artifacts.

When a concrete implementation choice is a design decision, explain the reason
or context that makes it part of the design. Do not leave it as a task command.

Resolve disagreements and contradictions when possible. Preserve them as open
questions or risks when they remain unresolved.

### CHECK_GATES

At each synthesis point, verify:

- The synthesis answers the requested exploration scope.
- The confidence level matches the evidence gathered.
- Assumptions are labeled.
- Open questions are real unresolved unknowns.
- Remaining uncertainty is clear enough for the user to decide whether to keep
  exploring.

For written artifacts, also verify:

- The artifact stands alone without prior chat.
- Section choices fit the topic.

### WRITE_ARTIFACT

- For chat output, summarize the current understanding, tradeoffs, risks, and
  open questions.
- For written output, create `docs/designs/` if needed, then create or update:
  `<repository-root>/docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md`.
- Rewrite the whole artifact on each update so it reads as the current source
  of truth.
- When source files or reference docs own a contract, link to the owner with line
  numbers and summarize only the semantic facts needed for the exploration. Do
  not inline copied source contracts, generated output, schemas, or command
  definitions unless the source is unavailable or the snippet is explicitly
  illustrative.
- Use durable design language. Prefer terms like `initial scope`, `accepted
  constraint`, `deferred capability`, `required behavior`, and `known
  implementation implication`.
- Avoid roadmap and task-order language such as `next`, `before`, `for v1`,
  `V1 should`, and step sequencing unless sequencing itself is a design
  constraint.

#### Artifact Shape

Do not force a standard section list.

Use domain- or problem-specific sections. Headings should name real concepts,
workflows, states, decisions, contracts, risks, or boundaries in the explored
space.

Each section should explain the relevant context, current understanding,
constraints, decisions, rationale, risks, assumptions, and open questions for
that part of the domain. Include only the parts that carry knowledge.

Write short, dense prose. Use plain words and active voice. Prefer concrete
examples over abstract framing. Cut filler, transition phrases, roadmap language,
and empty setup.

The first section after the title should summarize the problem being explored,
the current understanding, and the decision space. Do not write a task list or
roadmap.

Preserve:

- source-owned contracts, linked rather than copied;
- decisions and their reasons;
- rejected or deferred options when they clarify the decision space;
- risks, edge cases, assumptions, and open questions.

Omit empty sections.

### FINISH_OR_CONTINUE

- Continue exploration when useful questions remain.
- Stop when the requested scope is understood well enough, or when remaining
  uncertainty is explicit.
- If chat exploration has produced durable context, ask whether to save it.
