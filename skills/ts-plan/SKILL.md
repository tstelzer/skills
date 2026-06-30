---
name: ts-plan
description: Plan a multi-step code change before editing. Only explicitly triggered by user.
---

# Plan

## Required Reading

- skill: ts-principles
  - Read `ts-principles/SKILL.md`.
  - Read every linked principle detail document before planning.
  - Treat the principle details as binding planning constraints, not optional
    background.

## Role

Plan is a judge.

It owns scope, context loading, decisions, task sequencing, verification
strategy, and the saved plan artifact.

The judge may do the work directly. Delegate only when a bounded investigation
can run independently, such as API contract discovery, migration risk, test
inventory, or rollout constraints. Workers return raw notes. The judge writes
the plan.

This skill fits a three-tier workflow:

- router: chooses when to run planning, build, and review
- judge: owns the planning decision and artifact
- worker: answers one bounded planning question

Default to direct execution.

## Workflow

1. DETERMINE_SCOPE
2. LOAD_CONTEXT
3. DELEGATE_INVESTIGATIONS
4. RESOLVE_DECISIONS
5. DESIGN_TEST_SIGNALS
6. DRAFT_PLAN
7. CHECK_GATES
8. WRITE_ARTIFACT

### DETERMINE_SCOPE

- Determine the requested change, affected product behavior, planning depth,
  and any plausible nearby work the plan intentionally rejects or defers.
- Name the repository root and planned artifact path:
  `<repository-root>/docs/plans/YYYY-MM-DD_HH:MM_<plan-name>.md`.
- If the request revises an existing plan, use that existing plan path as the
  artifact path.
- Create `docs/plans/` if it does not exist.

### LOAD_CONTEXT

- Read relevant source, tests, docs, configs, `AGENTS.md`, and local guidance.
- Identify current behavior, affected files, invariants, dependencies,
  contracts, test seams, and verification commands.
- Use semantic skill names for external skills, e.g. `skill: ts-principles`.
- Use paths for local files. Do not copy reference material into the plan unless
  the implementer needs the exact snippet.
- If a required read or repo command fails after the obvious fix, stop and
  escalate. Missing context is not a license to plan blindly.

### DELEGATE_INVESTIGATIONS

- Skip when direct planning is cheaper.
- Delegate only independent, bounded questions.
- Worker prompts must include the question, exact scope, files or skills to
  read, expected output shape, the rule that workers must not write the plan
  artifact, and the rule that workers must escalate tooling failures to the
  judge instead of silently downgrading output.
- Treat worker output as evidence. Deduplicate and reconcile it before
  planning.

### RESOLVE_DECISIONS

- Resolve unknowns from repo context when possible.
- Keep unresolved decisions only in `Open Questions`.
- Do not place alternatives inside implementation tasks.
- If a task depends on an unresolved question, mark that task blocked and name
  the dependency.

### DESIGN_TEST_SIGNALS

- Re-read the `tests are code` principle detail before planning test changes.
- For each non-trivial behavior change, decide the automated regression signal
  before drafting tasks.
- Each planned test change must name:
  - the behavior, invariant, or contract protected
  - the public boundary exercised
  - the regression that should fail
- If no tests are added, name the existing automated signal or explain why no
  durable signal exists.

### DRAFT_PLAN

- Write implementation instructions for a skilled engineer with no prior chat
  context. Treat review findings, user feedback, and handoffs as inputs to the
  plan, not content in the plan.
- Use exact file paths, line numbers when useful, and dependency-ordered tasks.
- Make each task leave the repository coherent after its dependencies are
  applied. Do not split a refactor so an earlier task breaks imports, types,
  tests, or runtime behavior that a later task repairs.
- If a task cannot be verified honestly before a dependent task, merge the tasks.
- Put tests in the same task as the behavior change or in a dependent test
  task. For each test task, include the test signal from DESIGN_TEST_SIGNALS.
- Use `Details` for intent, invariants, and sequencing. Put exact mechanics in
  `Code Changes`; do not repeat hunks in prose.

Code-in-plan policy:

- Default to diffs. For a small change to a preexisting file, show only the
  changed lines as a patch-style hunk with a few lines of surrounding context.
- Use larger code blocks only for new files, or when extra context is needed to
  understand the change. New files, new functions, new components, new types,
  and heavily rewritten units need full or near-full code.
- Do not dump whole existing files for small edits.
- Do not include generated artifacts, lockfiles, snapshots, or build output
  unless they are the subject of the change.
- Do not hide substantive logic behind `...`.
- Add comments only for non-obvious invariants, edge cases, error handling,
  concurrency, performance, security, or domain rules.

### CHECK_GATES

Before writing the artifact, verify:

- The plan stands alone without prior chat.
- Every non-trivial task lists exact files.
- Every task is concrete and decision-free.
- Every task's `Verify` section is valid immediately after that task and its
  dependencies are applied.
- `Open Questions` contains only unresolved decisions.
- Optional sections marked `skip if none` are omitted when empty.
- No answered question remains as an open question.
- Blocked tasks name their blocker.
- Verification commands and expected results are explicit.
- Every verification command's underlying tool runs in this repo. Invoke each
  tool with a no-op (e.g., `--help`, dry-run, version check, or a no-target
  invocation) to confirm availability. For commands that exercise
  yet-to-be-implemented code, confirming the tool itself is sufficient. If a
  tool cannot run after the obvious fix, escalate.
- Every non-trivial behavior change has an automated test signal, an existing
  signal, or an explicit reason no durable signal exists.
- Task file lists match the snippets or hunks in that task.
- The plan has no notes about the planning, review, handoff, or revision process.

### WRITE_ARTIFACT

- Write the final plan to the artifact path chosen in `DETERMINE_SCOPE`.
- New plans use `<repository-root>/docs/plans/YYYY-MM-DD_HH:MM_<plan-name>.md`.
- Revisions overwrite the existing plan path. Do not create a revised copy or
  write a delta.
- Use accepted feedback to rewrite the affected sections: summary, overview,
  tasks, test signals, code changes, verification, open questions, or scope.
- Delete superseded scope instead of describing that it was removed.

## Artifact Template

````markdown
# Plan: <Feature Name>

## Summary
<1-3 sentences describing what this builds and why>

## Prerequisites
<Task-specific setup, dependencies, or docs; skip if none>

## Open Questions
<Unresolved decisions only; skip if none>

## Out of Scope
<Nearby work the reader might reasonably expect from this plan, but this plan rejects or defers; skip if none>

## Overview
<1-2 short paragraphs about architecture, approach, constraints, and sequencing>

## Task <n>: <name>
**Files:** `path/to/file.ts:42`, `path/to/test.ts`
**Depends on:** Task <m> or `None`
**Blocked by:** <open question or external dependency; omit if unblocked>

**Details:**
- <Intent, invariant, or sequencing note not obvious from the code>
- <Concrete step only when no code hunk carries it>

**Test Signal:** <For test tasks only: behavior protected, boundary exercised,
and regression that should fail; omit otherwise>

**Code Changes:**
```ts
// Patch-style hunk for small edits; full definition only for new/rewritten code.
```

**Verify:**
- `<command>`
- Expected: <observable result>
````
