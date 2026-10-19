---
name: ts-design-document
description: Create and revise design documents. Only explicitly triggered by user.
---

# Design Document

## Role

Describe the intended system and why it solves the problem. Write that vision in present tense.
The design remains valid when implemented. It does not track progress toward that vision.

Prepare design documents for user approval. Use this skill on its own or from another skill.
Keep the document useful without the chat.

| Artifact | Responsibility |
| --- | --- |
| Design | Intended behavior, constraints, decisions, and reasons |
| Plan | Changes needed to reach the design and their order |
| Work log | What happened, results, and blockers |
| Git | Source code and its change history |

## Approval

- Create or edit a design only through this skill and at the user's request.
  Reading, referencing, or implementing a design does not authorize edits.
- Invoking this skill does not authorize saving a design. Get explicit user approval of exact changes before creating a document or making any change in meaning.
- Approval covers only the proposed changes. Approval of a decision or another task does not authorize document edits.
- Additions, deletions, and rewording require approval. This includes facts, reasons, and open questions.
- Formatting needs no signoff. Limit it to whitespace, line wrapping, and Markdown layout that preserve meaning.

## Required Reading

Use skill: ts-project-context when creating or updating a design. Read the relevant project facts and decisions.
Follow its approval rules before changing shared project context.

For software designs, use skill: ts-principles. Read the skill and the principles that apply.
Read the examples below before editing.

## Relationship To Code

Implementation progress never triggers a design update. Do not mark requirements as implemented, complete, or pending.
Do not recast agreed decisions as proposals because they have not been built.

Code shows what exists; it does not prove agreement.
A difference between code and design does not make the design stale.
Use code as evidence about feasibility and constraints. Bring evidence that challenges a design decision to chat.
Follow the approval process for any resulting design change.

Code that implements an open proposal can justify asking whether the user accepts that choice.
Ask in chat. Do not infer acceptance from implementation or resolve the question in the document without approval.

## Content

Start every design with this exact line, before its title:

```text
Before editing, read and follow skill: ts-design-document. Get user approval for every change in meaning.
```

Include a missing notice in the proposed changes to an existing design.

Explain the problem, intended result, and scope. Describe responsibilities and guarantees.
Include facts and constraints only when they explain a design choice. Do not inventory the current implementation.

Put reasons beside decisions. Explain what each choice gains and costs, and why real alternatives were rejected
or deferred. Describe failure behavior, risks, and constraints on operation or migration when they shape the design.
Keep assumptions clear. Do not invent options or reasons to fill sections.

Collect open decisions, their proposals, and unresolved conflicts in one `## Open Questions` section.
Give each question only the context needed to answer it. A proposal is an undecided choice, not an unbuilt requirement.
After approval, move accepted decisions into the relevant sections and remove resolved questions.
Omit the section when none remain.

Keep technical detail at the level needed to judge the design.
Show domain models and contracts with type declarations. Include fields and variants that express design decisions.
Explain responsibilities and reasons in prose. Keep implementation details such as worker methods out.
Use source references only to illustrate a decision. Keep the explanation understandable without opening the source.
Avoid line numbers and details tied to file layout. Code movement does not require a design rewrite.
Keep executable code, pseudocode, diffs, database schemas, and command output out.

Keep implementation status, work history, and next steps out. Put task order and commands in a plan.
Use skill: ts-log for requested work logs. Git holds code changes.
Do not add implementation checklists, session notes, or dated updates.
Link to other documents when needed; do not copy their contents.

## Editing

### Read

Use the scope, reader, and path from the request or calling skill.
Read the whole existing document and the findings behind the change.
Check sources needed to support changed claims. Keep research limited to what the document needs.

Identify what changes about the intended behavior, constraints, reasons, or open choices.
For a request that only reports implementation progress, say no design change is needed and stop.

### Propose

Draft changes in chat. Do not write the document before approval.
Explain why the design needs each change. Propose replacements for affected sections and those that depend on them.
Keep valid decisions and their reasons, including reasons for rejected options.
Preserve unaffected text and concurrent edits.

Put missing reasons and unresolved choices in `## Open Questions`.
Ask a focused question when its answer changes the design.

Open the body with the problem and intended solution. Use headings that name the topic or decision.
Use bullet points as the main format. Put each idea, decision, or note in its own bullet so it can be edited on its own.
Give each decision only the reason and consequences needed to judge it.
Keep examples brief. Describe required system behavior; put the work needed to build it in a plan.

### Check And Approve

Check that the proposed document stands alone and its sections agree. Decisions must have reasons supported by evidence.
Check that its first line is the required editing notice.
Check that implementing the design would leave its statements valid without status updates.
Keep all open choices in `## Open Questions`. Remove implementation status, work history, task steps, and executable code.

Show the exact proposed text or diff in chat, including changes to related sections. Wait for explicit user approval.
Leave the document unchanged while waiting. Get approval again for any revision to the proposed changes.

### Save

Apply only the approved changes. Re-read the document before writing and preserve concurrent edits.
Formatting-only edits need no approval.

Use the supplied path. Update an existing design in place. For a new design without a supplied path, use:

```text
<repository-root>/docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md
```

Create the parent directory if needed. Report the path and any open design questions in chat.

## Examples

The good examples show proposed text. Check that findings support each claim and get approval before saving it.

### Implemented Decision

The design says:

> - Imports survive restarts.
> - Saved progress prevents a restart from losing hours of work.

The code now implements restart recovery. Leave the design unchanged.
Do not add an implementation note or mark the decision complete. Completion belongs in a work log.

### Plan And Design

Plan:

> Add the reader, deploy the writer, run the migration script, then remove the fallback.

Design:

> - Readers accept both formats during migration.
> - Writers use only the new format so migration can finish.

The design states compatibility requirements. The plan orders the work.

### Source References

Bad:

> `ImportWorker.runBatch()` calls `saveCheckpoint()` in `src/import/worker.ts:84`.

Good:

> - Batch data and its checkpoint commit together so a restart cannot skip records.

Moving or renaming the worker does not change that design decision.

### Changed Decision

Existing decision: memory is enough because imports are short.
New requirement: long imports must survive restarts.

Propose replacing the decision:

> - Import progress survives restarts.
> - Keeping progress only in memory would lose hours of work.

Include related sections in the proposal. Apply it only after approval.
The new requirement justifies the change; implementation progress does not.

### Implemented Proposal

The design has an open question:

> - **Retention:** Is the proposed 30-day limit enough for support and acceptable for customer data?

The code deletes imports after 30 days. Ask in chat whether the user accepts that retention policy.
Keep the document unchanged until the user approves the exact edit that records the decision and removes the question.
