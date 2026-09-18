---
name: ts-plan
description: Plan a multi-step code change before editing. Only explicitly triggered by user.
---

# Plan

## Required Reading

- skill: ts-principles
  - Read `ts-principles/SKILL.md`.
  - Read every linked principle detail document before planning.
  - Follow the rules in those documents when planning.
  - Apply the principles without copying their names or slogans into the plan unless the reader needs the reference.
- skill: ts-technical-writing
  - Read `ts-technical-writing/SKILL.md`.
  - Read every linked technical-writing detail document before writing a plan.

## Role

Plan is a judge.

It sets scope, reads context, makes decisions, orders tasks, plans checks, and saves the plan.

Plan directly or delegate a separate question, such as what an API promises, which tests exist, or what could go wrong
during migration or deployment. Workers return raw notes.

Always spawn a sub-agent with `skill: ts-technical-writing` to edit the draft before the final checks.
The editor returns edited plan text, not review findings.

This skill can work within three levels:

- router: chooses when to run planning, build, and review
- judge: makes planning decisions and writes the plan
- worker: answers one planning question within its assigned scope

Default to direct execution.

## Sub-Agent Selection

Choose sub-agent workers as follows.

- Choose the first available entry for the worker role.
- If the agent tool cannot set provider, model line, and reasoning separately, choose the closest available model.
  Record what actually ran.
- Do not spawn extra workers just to use every entry.
- Spawn workers only when they can gather separate evidence that the judge can check and use with little effort.

### Planning Worker

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `terra` latest | `medium` |
| 2 | Anthropic | `sonnet` latest | `medium` |
| 3 | OpenAI | `sol` latest | `high` |
| 4 | Cursor | `composer` | `high` |

Good worker tasks:

- list automated tests
- list affected contracts
- find migration and deployment limits
- find commands to check the work
- map dependencies and their owners

### Technical-Writing Editor

Use the first available entry.

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `terra` latest | `medium` |
| 2 | Anthropic | `sonnet` latest | `medium` |
| 3 | OpenAI | `sol` latest | `high` |
| 4 | Cursor | `composer` | `high` |

## Workflow

1. DETERMINE_SCOPE
2. LOAD_CONTEXT
3. DELEGATE_INVESTIGATIONS
4. RESOLVE_DECISIONS
5. PLAN_TESTS
6. DRAFT_PLAN
7. EDIT_TECHNICAL_WRITING
8. CHECK_GATES
9. WRITE_ARTIFACT

### DETERMINE_SCOPE

- Identify the requested change, affected product behavior, and detail the plan needs.
  Name nearby work a reader might expect that the plan rejects or postpones.
- Name the repository root and planned artifact path:
  `<repository-root>/docs/plans/YYYY-MM-DD_HH:MM_<plan-name>.md`.
- If the request revises an existing plan, use that existing plan path as the
  artifact path.
- Create `docs/plans/` if it does not exist.

### LOAD_CONTEXT

- Use skill: ts-project-context to load shared facts and decisions.
- Read relevant source, tests, docs, configs, `AGENTS.md`, and local guidance.
- Find the current behavior, affected files, rules that must hold, dependencies, interface promises,
  places to test, and commands to check the work.
- Use semantic skill names for external skills, e.g. `skill: ts-principles`.
- Use paths for local files. Do not copy reference material into the plan unless
  the implementer needs the exact snippet.
- If a required read or repo command still fails after the obvious fix, stop and report the failure.
  Do not plan without the required context.

### DELEGATE_INVESTIGATIONS

- Skip when direct planning is cheaper.
- Delegate only separate fact-finding questions with a clear scope.
- Give each worker the question, exact scope, files or skills to read, provider, model line, reasoning level,
  and required response format. Tell workers not to write the plan and to report tool failures to the judge
  instead of silently doing less work.
- Check worker notes, remove duplicates, and resolve conflicts before planning.

### RESOLVE_DECISIONS

- Answer unknowns from the repo and shared project context. Save conclusions useful to later tasks in project context.
- Keep unresolved decisions only in `Open Questions`.
- Do not place alternatives inside implementation tasks.
- If a task depends on an unresolved question, mark that task blocked and name
  the dependency.

### PLAN_TESTS

- Re-read the `tests are code` principle detail before planning test changes.
- Before drafting tasks, decide how automated tests will check each non-trivial behavior change.
- Each planned test change must name:
  - the behavior or rule it proves
  - the interface or user action it exercises
  - the bug it would catch
- If no tests are added, name the existing automated check or explain why no lasting automated check is practical.

### DRAFT_PLAN

- Write instructions for a skilled engineer who has not read the chat. Use review findings, user feedback,
  and handoffs to write the plan. Do not recount them in it.
- Use exact file paths and useful line numbers. Order tasks so dependencies come first.
- Each task must leave the repo working after its dependencies are done. Do not split a refactor so an earlier task
  breaks imports, types, tests, or behavior and a later task repairs them.
- Merge tasks when one cannot be checked until a task that depends on it is done.
- Put tests in the same task as the behavior change or in a dependent test
  task. For each test task, include the test description from PLAN_TESTS.
- Use exact paths, symbols, commands, and contract names. Explain what the change does and why in plain words.
- Use `Details` for purpose, rules that must hold, and task order. Put the code in `Code Changes`;
  do not repeat the patch in prose.

Code in the plan:

- Default to diffs. For a small change to a preexisting file, show only the
  changed lines as a patch-style hunk with a few lines of surrounding context.
- Use larger code blocks only for new files, or when extra context is needed to
  understand the change. New files, new functions, new components, new types,
  and heavily rewritten units need full or near-full code.
- Do not dump whole existing files for small edits.
- Do not include generated artifacts, lockfiles, snapshots, or build output
  unless they are the subject of the change.
- Do not hide important logic behind `...`.
- Plan `/** ... */` or comments where exported interfaces, rules that must hold, edge cases, error handling,
  concurrency, performance, security, or domain rules need explanation.
- Do not plan comments that repeat names, types, schemas, tests, or obvious
  code.

### EDIT_TECHNICAL_WRITING

- Always spawn a technical-writing editor sub-agent after drafting the plan and
  before running gates.
- Include `skill: ts-technical-writing` in the editor prompt.
- The editor rewrites abstract phrases as concrete actions and gives independent rules separate bullets.
  It edits structure, headings, and examples, and removes llm-isms.
- The editor edits the plan draft directly. It must return the complete edited
  plan text, not review findings or suggestions.
- The editor must preserve meaning, exact code and interface names, scope, task order, file paths, code hunks,
  verification commands, open questions, blockers, planned tests, and technical facts. Rewrite descriptive phrases
  and workflow terms in plain words.
- Tell the editor to write for a skilled engineer who has not read the chat. The plan must make clear what to build
  and how to check it.
- The judge must not perform the technical-writing edit itself. The judge may
  make factual corrections after the edit.
- Run the editor again if factual corrections substantially change the plan text.

### CHECK_GATES

Before writing the artifact, verify:

- The technical-writing editor edited the plan after the latest material draft
  change.
- The plan stands alone without prior chat.
- Every non-trivial task lists exact files.
- No task asks the implementer to choose between alternatives.
- Each task's `Verify` section works as soon as that task and its dependencies are done.
- `Open Questions` contains only unresolved decisions.
- Optional sections marked `skip if none` are omitted when empty.
- No answered question remains as an open question.
- Blocked tasks name their blocker.
- Check commands and expected results are stated.
- Every tool used by a check command runs in this repo. Confirm with a no-op such as `--help`, a dry-run,
  a version check, or a call with no target. For checks of code not yet written, confirming the tool is enough.
  If a tool still cannot run after the obvious fix, report the failure.
- Every non-trivial behavior change has a planned automated test, an existing automated check, or an explicit reason no
  lasting automated check is practical.
- Task file lists match the snippets or hunks in that task.
- The plan has no notes about the planning, review, handoff, or revision process.

### WRITE_ARTIFACT

- Write the final plan to the artifact path chosen in `DETERMINE_SCOPE`.
- New plans use `<repository-root>/docs/plans/YYYY-MM-DD_HH:MM_<plan-name>.md`.
- Revisions overwrite the existing plan path. Do not create a revised copy or
  write a delta.
- Use accepted feedback to rewrite the affected sections: summary, overview,
  tasks, planned tests, code changes, verification, open questions, or scope.
- Delete scope that no longer applies. Do not describe its removal.

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
<1-2 short paragraphs about the main parts, approach, limits, and task order>

## Task <n>: <name>
**Files:** `path/to/file.ts:42`, `path/to/test.ts`
**Depends on:** Task <m>; omit when the task has no dependency
**Blocked by:** <open question or external dependency; omit if unblocked>

**Details:**
- <Purpose, rule that must hold, or task-order note not obvious from the code>
- <Concrete step only when no code hunk carries it>

**Tests:** <For test tasks only: behavior proved, interface or user action exercised, and bug caught; omit otherwise>

**Code Changes:**
```ts
// Patch-style hunk for small edits; full definition only for new/rewritten code.
```

**Verify:**
- `<command>`
- Expected: <observable result>
````
