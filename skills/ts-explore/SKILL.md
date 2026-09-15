---
name: ts-explore
description: Explore. Only explicitly triggered by user.
---

# Explore

## Required Reading

- skill: ts-principles
  - Read `ts-principles/SKILL.md`.
  - Read every linked principle detail document before exploring.
- skill: ts-project-context
  - The judge must read `ts-project-context/SKILL.md`.
  - Keep the full record with the judge. Give workers only entries needed for their assigned task.
- skill: ts-technical-writing
  - Read `ts-technical-writing/SKILL.md`.
  - Read every linked technical-writing detail document before writing an artifact.

## Role

Explore is a judge.

It sets scope, reads context, asks questions, combines findings, makes decisions, and saves any design document.
Use it to establish what is known about a problem, possible solutions, a domain, a workflow, system behavior,
or a product decision.

Explore directly or delegate a separate part, such as the domain model, existing behavior, user workflow,
API promises, states, abuse cases, operations, migration risk, or earlier solutions. Workers return notes.

For written documents, always spawn a sub-agent with `skill: ts-technical-writing` to edit the text directly.
The editor returns edited text, not review findings.

## Sub-Agent Selection

Choose sub-agent workers as follows.

- Choose the first available entry for the worker role.
- If the agent tool cannot set provider, model line, and reasoning separately, choose the closest available model.
  Record what actually ran.
- Do not spawn extra workers just to use every entry.
- Spawn workers only when they can gather separate evidence that the judge can check and use with little effort.

### Exploration Worker

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `terra` latest | `medium` |
| 2 | Anthropic | `sonnet` latest | `medium` |
| 3 | OpenAI | `sol` latest | `high` |
| 4 | Cursor | `composer` | `high` |

Good worker tasks:

- trace current behavior
- map API or data promises
- state model
- user workflow map
- abuse or failure cases
- operations, performance, or migration risk
- find earlier solutions

### Technical-Writing Editor

Use the first available entry.

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `terra` latest | `medium` |
| 2 | Anthropic | `sonnet` latest | `medium` |
| 3 | OpenAI | `sol` latest | `high` |
| 4 | Cursor | `composer` | `high` |

## Workflow

1. SET_SCOPE
2. LOAD_CONTEXT
3. MAP_SPACE
4. RUN_EXPLORATION_LOOP
5. FINISH_OR_CONTINUE

### SET_SCOPE

- Use exploration to learn.
- Explore the problem, possible solutions, existing system, limits, tradeoffs, decisions, risks, and open questions.
- State what the exploration covers and where it stops.
- If the request revises an existing design artifact, use that existing design
  path as the artifact path.
- Default to chat. Write an artifact only when the user asks for one or the
  understanding should outlive the conversation.

### LOAD_CONTEXT

- Use skill: ts-project-context to load shared facts and decisions.
- Read repo files, docs, configs, prior plans, prior designs, `AGENTS.md`, and
  external references when they change the understanding.
- Use the principle details to guide what you examine.

### MAP_SPACE

Describe the parts needed to understand the topic:

- problem or decision
- users, actors, readers, or operators
- current state
- domain terms
- states and transitions
- where parts meet and who owns them
- promises and long-lived interfaces
- constraints
- assumptions
- risks and edge cases
- unknowns

Adapt this to the topic. A broad problem may need categories, principles, tradeoffs, history, or competing views.
A product workflow may need actors, states, ways it can fail, and limits.

### RUN_EXPLORATION_LOOP

Repeat until the exploration is clear enough, the user pauses, or the requested
scope changes:

1. ASK_QUESTIONS
2. SYNTHESIZE
3. EDIT_TECHNICAL_WRITING
4. CHECK_GATES
5. WRITE_ARTIFACT

Write design documents early and update them when findings change the understanding.
The user must be able to stop and resume from the document without losing important context.

### ASK_QUESTIONS

- Ask only questions whose answers change the understanding.
- Prefer one critical question over several weak ones.
- Keep question batches focused and easy to answer.
- When useful, explain what decision or unknown each answer will settle.
- Stop asking when you have enough to explain what you have learned.

### SYNTHESIZE

Classify each important finding:

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

Use these categories to think through the findings. Include their names in the document only when labels help the
reader find or compare information.

Before writing, classify each implementation statement as a decision, constraint, example, implementation implication,
or planning note. Keep planning notes out of saved documents.

When an implementation choice is part of the design, explain why it belongs there. Do not write it as a task command.

Resolve disagreements and contradictions when possible. Preserve them as open
questions or risks when they remain unresolved.
When findings could become shared project context, follow the `ts-project-context` approval flow.

### EDIT_TECHNICAL_WRITING

- Skip only for chat-only exploration with no written artifact.
- Before writing or updating an artifact, spawn a technical-writing editor
  sub-agent with `skill: ts-technical-writing`.
- The editor edits prose, structure, headings, bullets, and examples, and removes llm-isms.
- The editor edits the artifact draft directly. It must return the edited
  artifact text, not review findings or suggestions.
- The editor must preserve meaning, exact technical names, facts, decisions, scope, source links, line references,
  contracts, assumptions, risks, and open questions. It may rewrite abstract labels and workflow terms.
- The judge must not perform the technical-writing edit itself. The judge may
  make factual corrections after the edit.
- Run the editor again if factual corrections substantially change the document text.
- The editor prompt must include:
  - `skill: ts-technical-writing`
  - the reader and artifact purpose
  - the full draft or artifact path
  - the source requirements that must not change
  - the rule that the editor is not a reviewer and must edit directly

### CHECK_GATES

After combining findings, check:

- The explanation answers the requested exploration.
- Match the strength of claims to the evidence.
- Assumptions are labeled.
- Open questions are real unresolved unknowns.
- The user can see what remains uncertain and decide whether to keep exploring.

For written artifacts, also verify:

- A technical-writing editor edited the document after the latest substantial change in understanding.
- The artifact stands alone without prior chat.
- Section choices fit the topic.

### WRITE_ARTIFACT

- For chat output, summarize the current understanding, tradeoffs, risks, and
  open questions.
- For written output, create `docs/designs/` if needed, then create or update:
  `<repository-root>/docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md`.
- When updating an existing design, write back to the existing artifact path.
  Do not create a revised copy.
- Rewrite the whole document on each update so it states the current understanding.
- When source files or reference docs define a contract, link to them with line numbers and summarize only what the
  reader needs. Do not copy contracts, generated output, schemas, or command definitions into the document unless the
  source is unavailable or the snippet is clearly an example.
- State decisions in the system's own words. Explain the reason in the next sentence or bullet. Use labels such as
  `Constraint` or `Risk` only when they help the reader scan the document.
- Avoid roadmap and task-order language such as `next`, `before`, `for v1`,
  `V1 should`, and step sequencing unless sequencing itself is a design
  constraint.

#### Artifact Shape

Do not force a standard section list.

Choose sections for the problem or domain. Use the system's names in headings. Name the topic or decision,
not a workflow category from this skill.

Each section should state what the reader needs to know about its topic. Include decisions, reasons, risks,
assumptions, and open questions when they apply. Do not repeat the whole checklist in every section.

Write short paragraphs and direct sentences. Do not pack context, a decision, its reason, and its risks into one
sentence. Prefer concrete examples. Cut filler, transition phrases, roadmap language, and empty introductions.

The first section after the title should state the problem, what is known, and which choices remain open. Do not write a
task list or roadmap.

Preserve:

- contracts owned by source files or reference docs, linked rather than copied;
- decisions and their reasons;
- rejected or postponed options when they clarify the available choices;
- risks, edge cases, assumptions, and open questions.

Omit empty sections.

### FINISH_OR_CONTINUE

- Continue exploration when useful questions remain.
- Stop when the requested scope is understood well enough, or when remaining
  uncertainty is explicit.
- If chat findings could become shared project context, follow the `ts-project-context` approval flow.
