---
name: plan
description: Use when creating a standalone implementation plan for a multi-step code change, before touching code.
---

# Plan

## Overview

Write implementation plans for engineers who have zero project context.
Document exactly what they need to know: files to touch, code to write, tests to
update, docs to check, and how to verify the result. Give them the whole plan as
bite-sized tasks.

Assume they are a skilled developer, but know almost nothing about our toolset
or problem domain. Assume they don't know good test design very well; make the
test intent, fixture setup, assertions, and failure coverage explicit.
Plans must be standalone documents that do not rely on the prior chat.

Plan artifacts should be compact in prose and explicit in code. Explanations
must be clear, but short; code snippets should carry most implementation detail.

**Announce at start:** "I'm using the plan skill to create the implementation plan."

**Save plans to:** `<repository-root>/plans/YYYY-MM-DD_HH:MM_<plan-name>.md`

Create `plans/` if it does not exist.

## Workflow

1. Inspect the repository before drafting. Read relevant source files, tests,
   docs, configs, and local guidance such as `AGENTS.md` when present.
2. Identify the current behavior, affected surfaces, exact files to touch,
   invariants, dependencies, test strategy, and verification commands.
3. Resolve unknowns from repo context where possible. Put remaining decisions
   only in **Open Questions**, and block dependent tasks explicitly.
4. Draft the saved standalone plan with tasks ordered by dependency and each
   task independently verifiable.
5. Before finalizing, run a fresh-reader pass for standalone context, concrete
   tasks, explicit tests, exact files, and no answered questions left behind.

## Plan Structure

```markdown
# Plan: <Feature Name>

## Summary
<1-3 sentences describing what this builds and why>

## Prerequisites
<Only task-specific setup/deps/docs not already implicit from repo context or `AGENTS.md` — skip if none>

## Open Questions
<Bulleted unknowns or decisions to resolve before/during implementation — skip if none>

## Out of Scope
<Bulleted boundaries for what this plan explicitly does NOT cover>

## Overview
<1-2 short paragraphs about approach, constraints, and sequencing>

## Task <n>: <name>
**Files:** `path/to/file.ts:42`, ...
**Depends on:** Task <m> (if any)
**Details:** <Compact bullets with what to do and why>
**Code Changes:** <Code changes in fenced blocks or patch-style hunks; full-ish for non-trivial edits, abbreviated only for trivial/safe edits>

**Verify:** <How to confirm this task is done — command, test, manual check>
```

## Writing Style

- Keep prose lean. Prefer short paragraphs and compact bullets over long narrative sections.
- Preserve reasoning, but make it local and actionable: explain the reason next to the task or code it affects.
- Do not repeat the same motivation across Summary, Overview, and task Details.
- Let code snippets, exact paths, and verification commands do the detailed work.
- Use **Overview** for architecture and sequencing only; do not restate every task.
- Use **Details** for task-specific rationale and steps, ideally 3-6 bullets.
- Do not pad the plan with general engineering advice unless it is specific to this implementation.

## Standalone Plan Rules

- You MUST write a standalone plan; you MUST NOT reference the chat (e.g., "as discussed above").
- You MUST restate all assumptions, constraints, definitions, and goals inside the plan body (Summary/Overview/Prerequisites/Open Questions).
- You MUST NOT include redundant global context in **Prerequisites** (for example: repo root path, generic workspace commands already documented in `AGENTS.md`, or a list of skills used to write the plan).

## Revision Rules

- When revising a plan after feedback, you MUST rewrite the plan as the desired final artifact, not as a delta from the previous draft.
- You MUST fold accepted feedback into the affected sections so the revised plan reads as if it were written correctly from scratch.
- You MUST NOT describe changes relative to the previous draft (for example: "remove X", "do not do Y anymore", "only do A now", "keep B from the earlier plan").
- If feedback eliminates a feature, task, constraint, or option from the plan, you MUST delete it and rewrite surrounding text for coherence instead of mentioning the removal.
- Use negative phrasing only for actual product or implementation constraints that belong in the final plan itself, not to reflect plan-edit history.
- Before finalizing any revision, you MUST do a "fresh-reader" pass: read the document as someone who never saw the earlier draft and remove anything that would require prior conversation context.

## Open Questions Discipline

- All unknowns/decisions MUST appear only in **Open Questions**.
- Tasks MUST be concrete and decision-free; you MUST NOT propose alternatives inside tasks.
- If a task depends on an unanswered question, you MUST explicitly block it and mark the dependency.
- You MUST NOT use ambiguous language in tasks (e.g., "could", "might", "maybe", "either/or", "TBD", "figure out").
- If an open question is answered while drafting, you MUST remove it from **Open Questions** and integrate the answer into Summary/Overview/Prerequisites/Tasks before finalizing.
- Tasks MUST NOT reference **Open Questions** unless the question is still unresolved and the task is explicitly marked blocked.

## Remember

- You MUST include exact file paths (line numbers if relevant).
- You MUST provide concrete, verbose implementation steps (code when useful), not vague directives.
- Code-in-plan policy:
  - If a change is extremely trivial and low-risk (for example: a one-line rename, import addition, or obvious constant tweak), you MAY describe it with an abbreviated inline snippet or short example.
  - Otherwise, you MUST include full or near-full code for the substantive change paths in the task, enough for the implementer to apply it without inventing missing logic.
  - Prefer full function/component/type definitions or patch-style hunks over dumping entire files when only part of a large file changes.
  - For large files, include only the changed regions plus enough surrounding context to apply the edit safely.
  - Do not include generated artifacts or bulky machine-produced diffs (e.g., lockfiles, snapshots, build output) unless they are the core subject of the task.
  - Do not hide substantive edits behind placeholders like "..." when that omits important logic, control flow, types, or error handling.
  - Include comments in snippets when they clarify non-obvious invariants, edge cases, error handling, concurrency, performance tradeoffs, security constraints, or domain rules.
  - Do not add comments that merely narrate obvious syntax. Comments should be useful enough to keep in production code.
- You MUST format non-trivial code changes in fenced code blocks (preferred) or patch-style hunks, and identify the target file/path near each snippet.
- For each task, the `**Files:**` list MUST match the files referenced in that task's code snippets/hunks (no extra or missing files).
- You MUST include exact verification commands and expected output when deterministic; otherwise include the exact command/check and the expected observable result/assertion.
- You MUST NOT include meta process notes in the plan (for example, which plan skill(s) you used to produce the plan). Only mention external docs/tools when they are actual implementation inputs.
- You MUST order tasks by dependency, call out blocking relationships, and make each task independently verifiable.
- If behavior changes, you MUST include test additions/updates in the same task or a dependent task; if not adding tests, explain why.
- Prerequisites and open questions MUST be resolved and integrated before any dependent implementation task begins, or the task MUST be explicitly marked blocked.
- On revisions, deleted scope MUST disappear from the final plan instead of being mentioned as excluded due to review feedback.
- Before finalizing, you MUST run a "standalone + no-open-questions-in-tasks + answered-questions-cleanup" pass.
