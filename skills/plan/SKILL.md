---
name: plan
description: Use as the planning judge for a standalone implementation plan for a multi-step code change, before touching code.
---

# Plan

## Required Reading

- skill: principles (read details you deem relevant)

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
5. DRAFT_PLAN
6. CHECK_GATES
7. WRITE_ARTIFACT

### DETERMINE_SCOPE

- Determine the requested change, affected product behavior, explicit
  exclusions, and planning depth.
- Name the repository root and planned artifact path:
  `<repository-root>/docs/plans/YYYY-MM-DD_HH:MM_<plan-name>.md`.
- Create `docs/plans/` if it does not exist.

### LOAD_CONTEXT

- Read relevant source, tests, docs, configs, `AGENTS.md`, and local guidance.
- Identify current behavior, affected files, invariants, dependencies,
  contracts, test seams, and verification commands.
- Use semantic skill names for external skills, e.g. `skill: principles`.
- Use paths for local files. Do not copy reference material into the plan unless
  the implementer needs the exact snippet.

### DELEGATE_INVESTIGATIONS

- Skip when direct planning is cheaper.
- Delegate only independent, bounded questions.
- Worker prompts must include the question, exact scope, files or skills to
  read, expected output shape, and the rule that workers must not write the
  plan artifact.
- Treat worker output as evidence. Deduplicate and reconcile it before
  planning.

### RESOLVE_DECISIONS

- Resolve unknowns from repo context when possible.
- Keep unresolved decisions only in `Open Questions`.
- Do not place alternatives inside implementation tasks.
- If a task depends on an unresolved question, mark that task blocked and name
  the dependency.

### DRAFT_PLAN

- Write for a skilled engineer with no prior chat context.
- Use exact file paths, line numbers when useful, and dependency-ordered tasks.
- Make each task independently verifiable.
- Put tests in the same task as the behavior change or in a dependent test
  task. If no tests are added, state why.
- Prefer concise prose and concrete code.

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
- `Open Questions` contains only unresolved decisions.
- No answered question remains as an open question.
- Blocked tasks name their blocker.
- Verification commands and expected results are explicit.
- Task file lists match the snippets or hunks in that task.
- The plan has no meta notes about this skill or the planning process.

### WRITE_ARTIFACT

- Write the final plan to
  `<repository-root>/docs/plans/YYYY-MM-DD_HH:MM_<plan-name>.md`.
- When revising a plan, rewrite the complete final artifact. Do not write a
  delta from the previous draft.
- Fold accepted feedback into the relevant sections.
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
<Boundaries this plan does not cover>

## Overview
<1-2 short paragraphs about architecture, approach, constraints, and sequencing>

## Task <n>: <name>
**Files:** `path/to/file.ts:42`, `path/to/test.ts`
**Depends on:** Task <m> or `None`
**Blocked by:** <open question or external dependency; omit if unblocked>

**Details:**
- <Concrete implementation step>
- <Concrete implementation step>

**Code Changes:**
```ts
// Patch-style hunk for small edits; full definition only for new/rewritten code.
```

**Verify:**
- `<command>`
- Expected: <observable result>
````
