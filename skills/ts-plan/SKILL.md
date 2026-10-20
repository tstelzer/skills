---
name: ts-plan
description: Plan a multi-step code change before editing. Only explicitly triggered by user.
---

# Plan

## Role

Plan is a judge. Describe the changes needed to reach the requested result.
Order the work and explain how to check each task.

Write for an engineer who knows how to code but does not know this feature.
Keep the plan understandable without the chat.

Plan directly by default. Delegate separate fact-finding questions when useful.
The judge checks the evidence, resolves choices, and writes the plan.

## Lifetime

Scope every plan to one implementation session. The plan is temporary.

- Revise a plan only to change work still ahead in that session.
- Keep progress, completed work, and actual check results out. Use skill: ts-log for requested work logs.
- Never update a plan after implementation. Differences between finished code and the plan do not justify edits.
- When finding an old plan, confirm whether its implementation is complete.
  Delete completed plans without rewriting them.
- Do not archive completed plans, turn them into documentation, or reuse them for another implementation session.

## Approval

- Create or revise a plan only at the user's request.
  Reading, reviewing, or implementing a plan does not authorize revisions.
- Get explicit user approval of exact changes before creating a plan or changing its meaning.
  Approval covers only the proposed changes.
- Rewording requires approval. Formatting needs no signoff when limited to whitespace, line wrapping,
  and Markdown layout that preserve meaning.

## Required Reading

- skill: ts-simple. Apply it to all prose, including drafts and replies.
- skill: ts-principles. Read the skill and every linked principle.
- skill: ts-technical-writing. Read the skill and every linked local detail document.
- skill: ts-project-context. Read relevant project facts and decisions.
  Follow its approval rules before changing shared context.

## Workflow

### Read Context

Identify the requested result and scope. Use the supplied artifact path when one exists.

For an existing plan, read the whole document and establish whether implementation is complete.
Apply the lifetime rules before proposing revisions.

Read relevant source, tests, docs, and repository guidance.
Find current behavior, affected files, dependencies, and interface promises.
Use the agreed design when one exists.

Follow the repository's tool and environment rules.
If required context or tooling is unavailable, stop and report what the user must provide.
Do not repair unavailable tooling or bypass restrictions.

### Resolve Choices

Use evidence to establish current behavior and constraints. Code does not prove agreement.
Keep facts, accepted requirements, and proposals distinct.

Resolve factual questions from the repository and shared context.
Ask focused questions when evidence cannot settle a choice that changes the work.

Collect unresolved choices and their proposals in `## Open Questions`.
Mark affected tasks blocked and name the question they depend on.
Do not ask the implementer to choose between alternatives inside a task.

Bring conflicts with an agreed design to chat.
Use skill: ts-design-document for design changes the user requests. Follow its approval rules.

### Plan Work And Checks

Order tasks by dependency within the same implementation session.
Describe only the final implementation. Do not plan temporary code or behavior that a later task replaces.
Run each check once all changes it needs are in place.
The repo must work after all tasks are implemented.

Decide how to check each non-trivial behavior change before drafting its tasks.
Name a planned automated test or an existing automated check.
Explain when no lasting automated check is practical.

For each planned test, name the behavior it proves, the interface or action it exercises, and the bug it catches.
Put tests with the behavior change or in a dependent test task.

Give exact check commands, their working directories, and expected results.
Confirm each check tool runs in the prescribed project environment using a harmless no-op.
For code not yet written, confirming the tool is enough. Do not claim the future check passed.

Plan documentation changes where interfaces or behavior need an explanation the code cannot give.
Put lasting explanations in source documentation or approved designs so they survive deletion of the plan.
Do not plan comments that repeat names, types, tests, or obvious code.

### Draft

Start every plan with the editing and deletion notice shown in the template.

Open with the problem and intended result.
Link to the agreed design when one exists. Include only the context needed to carry out the work.

Use numbered tasks with headings that name the action.
Use bullets as the main format. Give each action, constraint, or reason its own bullet.
Put reasons beside the changes they explain.

Explain changes in plain words and code. Name exact affected files and relevant interfaces. Omit line numbers.
Show code for contracts and logic the implementer would otherwise have to design, such as a type or database query.
Use focused snippets or small diffs with real project names and APIs.
Prefer code when it explains a change more clearly than prose. Show the essential logic and leave out boilerplate.
Put snippets beside the action they explain. Use prose for reasons and constraints the code does not show.
Keep command output out of the plan.

Include prerequisites and nearby excluded work only when they affect the reader's actions.
Omit empty sections. Remove answered questions and move their answers into the affected tasks.

Use feedback to rewrite affected sections. Preserve valid decisions and their reasons.
Keep planning history, review discussions, and revision notes out of the artifact.

### Edit And Check

Always spawn a technical-writing editor after the latest material draft change.
Give it the complete draft, skill: ts-simple, and skill: ts-technical-writing.

The editor returns the complete edited draft in chat. It does not write the artifact.
It must preserve technical facts, scope, task order, code, file paths, checks, and unresolved choices.
The judge checks the edit and makes factual corrections.
Run the editor again when those corrections materially change the draft.

Before requesting approval, check:

- The plan stands alone and follows skill: ts-simple.
- Each task names the affected files and clearly states the work.
- Tasks reach the final implementation in one session without temporary states between tasks.
- Non-trivial behavior changes have meaningful checks.
- Commands and expected results are stated.
- Unresolved choices appear only in `## Open Questions`; affected tasks name their blockers.
- The snippets show the chosen contracts and non-obvious logic in enough detail to implement them.
- The plan contains no progress reports or work history.
- Information needed after implementation has a lasting home outside the plan.
- The first line contains the required notice.

### Approve And Save

Show the exact proposed text or diff in chat, including changes to related sections.
Wait for explicit approval. Get approval again for revisions to the proposed changes.

Before saving, re-read the existing document and preserve concurrent edits.
Apply only the approved changes. Update an existing plan in place.

Use the supplied path. For a new plan without one, use:

```text
<repository-root>/docs/plans/YYYY-MM-DD_HH:MM_<plan-name>.md
```

Create the parent directory when saving.
Report the path and any unresolved questions.

## Research Workers

Give each worker one question, its scope, required sources or skills, and a response format.
Require evidence, unresolved questions, and tool failures in the response.

Workers must not spawn workers, widen scope, edit files, or write the plan.
Check their findings and resolve conflicts before using them.

## Artifact Template

Omit sections and fields that do not apply.

````markdown
Before revising, follow skill: ts-plan and get user approval. Delete this plan after implementation.

# Plan: <Change>

## Goal

- <Problem>
- <Intended result>
- Design: <link, when one exists>

## Prerequisites

- <Required setup, dependency, or document>

## Open Questions

- <Unresolved choice, context needed to answer it, and affected tasks>

## Out Of Scope

- <Nearby work a reader might reasonably expect>

## Task <n>: <Action>

Files: `path/to/source`, `path/to/test`
Depends on: <earlier task>
Blocked by: <open question or external dependency>

- <Change to make>
- <Required behavior or constraint>
- <Reason needed to understand the work>

```<language>
<Focused snippet or small diff showing the chosen contract or logic>
```

Tests:

- <Case, interface or action exercised, and expected behavior that catches the bug>

Verify:

- Run `<command>` from `<directory>`.
- Expected: <observable result>
````
