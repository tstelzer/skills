---
name: ts-design-document
description: Create and maintain design documents. Only explicitly triggered by user.
---

# Design Document

## Role

Create or edit the design document directly. Use this skill on its own or from another skill.
Explain what the system should do and why. Keep the document useful without the chat.

## Required Reading

Use skill: ts-project-context when creating or updating a design. Read the relevant project facts and decisions.
Follow its approval rules before changing shared project context.

For software designs, use skill: ts-principles. Read the skill and the principles that apply.
Read the examples below before editing.

## Content

Explain the problem, intended result, and scope. Include the facts and limits that shape the design.
Describe the current direction, who owns each part, and what the system must guarantee.

Put reasons beside decisions. Explain what each choice gains and costs, and why real alternatives were rejected
or deferred. Cover risks, failure behavior, and limits on operation or migration when they affect the choice.
Keep assumptions clear. Do not invent options or reasons to fill sections.

Collect open decisions, their proposals, and unresolved conflicts in one `## Open Questions` section.
Give each question only the context needed to answer it. Do not scatter open choices through other sections.
Move answers into the relevant sections and remove resolved questions. Omit the section when none remain.

Keep technical detail at the level needed to judge the design. Recovery after a restart belongs here;
worker methods and field lists do not. Link to the source that defines a contract, with useful line references.
Summarize only the promise the design relies on.
Keep code snippets, pseudocode, diffs, schemas, and command output out.

Keep work history and execution status out. Use skill: ts-log for major completed actions and essential blockers.
Omit routine updates and changed-file lists; Git already shows file changes. Put task order and commands in a plan.
Do not add session notes, dated updates, or notes about writing the document.
Link to other documents when needed; do not copy their contents.

## Editing

### Read

Use the scope, reader, and path from the request or calling skill.
Read the whole existing document and the findings behind the change.
Check sources needed to support changed claims. Keep research limited to what the document needs.

Separate facts, agreed decisions, proposals, and assumptions. Code shows what exists; it does not prove agreement.
A design states intended behavior; it does not prove that behavior has shipped.

### Update

Rewrite affected sections and those that depend on them. Replace stale claims.
Keep valid decisions and their reasons, including reasons for rejected options.
Preserve unaffected text and concurrent edits.

Put missing reasons and unresolved choices in `## Open Questions`.
Ask a focused question when its answer changes the design.
For an update that only reports progress or implementation details, say no design change is needed and stop.

Open with the problem and current direction. Use headings that name the topic or decision.
Write short paragraphs. Give each decision only the reason and consequences needed to judge it.
Keep examples brief. Include ordering only when the system requires it, such as supporting old and new records.

### Check And Save

Check that the document stands alone and its sections agree. Decisions must have reasons supported by evidence.
Keep all open choices in `## Open Questions`. Remove work history, implementation steps, and code.

Use the supplied path. Update an existing design in place. For a new design without a supplied path, use:

```text
<repository-root>/docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md
```

Create the parent directory if needed. Report the path and any open design questions in chat.

## Examples

The good examples assume the findings support their claims.

### Choice And Cost

Bad:

> Use a queue because it is robust and scalable.

Good:

> Background jobs avoid request timeouts but require stored state.

### Work History

Bad:

> Added the worker. All 42 tests pass. Next, build the progress screen.

Leave the design unchanged. Log only the major completed action.

A finding from that work may belong:

> A retry must not duplicate records. The import service owns that guarantee.

### Implementation Details

Bad:

> Add `ImportWorker.runBatch()`, inject `ImportRepository`, and call `saveCheckpoint()` after the loop.

Good:

> Batch data and its checkpoint are saved together so a restart cannot skip records.

### Code

Bad:

```ts
await db.transaction(async (tx) => {
  await tx.insert(rows)
  await tx.saveCheckpoint(batch.end)
})
```

Good:

> A failed batch leaves data and checkpoint unchanged, making retries safe.

### Changed Decision

Old claim: memory is enough because imports are short.
New requirement: long imports must survive restarts.

Bad:

> Update, 2026-10-07: The earlier section is outdated. Add saved progress next.

Replace the old claim:

> Import progress survives restarts. Keeping it only in memory would lose hours of work.

Update related sections too. Do not explain stale claims in a later note.

### Proposal

An agent suggests keeping imports for 30 days. No requirement has been agreed.

Bad:

> Completed imports are kept for 30 days.

Good:

> ## Open Questions
>
> - **Retention:** Is the proposed 30-day limit enough for support and acceptable for customer data?

### Evidence

Bad:

> Two restart tests failed. Added a test and handed off the fix.

Good:

> Separate writes can lose records on restart. Batch data and progress must be saved together.

Link to the evidence. Keep the test history out.

### Migration

Bad:

> Add the reader, deploy the writer, run the migration script, then remove the fallback.

Good:

> Readers accept both formats during migration. Writers use only the new format so migration can finish.

### Open Question

Bad:

> Next: implement cancellation, add tests, and ask about partial imports.

Good, in `## Open Questions`:

> - **Cancellation:** Can users keep partial imports, or must cancellation undo all changes?
