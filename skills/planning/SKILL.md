---
name: planning
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Planning

## Overview

Write comprehensive implementation plans assuming the engineer has zero context
for our codebase and questionable taste. Document everything they need to know:
which files to touch for each task, code, testing, docs they might need to
check, how to test it. Give them the whole plan as bite-sized tasks.

Assume they are a skilled developer, but know almost nothing about our toolset
or problem domain. Assume they don't know good test design very well.
Plans must be standalone documents that do not rely on the prior chat.

**Announce at start:** "I'm using the planning skill to create the implementation plan."

**Save plans to:** `<repository-root>/plans/YYYY-MM-DD_HH:MM_<plan-name>.md`

## Plan Structure

```markdown
# Plan: <Feature Name>

## Summary
<One paragraph describing what this builds>

## Prerequisites
<Setup steps, deps to install, docs to read — skip if none>

## Open Questions
<Unknowns or decisions to resolve before/during implementation — skip if none>

## Out of Scope
<What this plan explicitly does NOT cover>

## Overview
<A couple of paragraphs about approach>

## Task <n>: <name>
**Files:** `path/to/file.ts:42`, ...
**Depends on:** Task <m> (if any)
**Details** <What to do and why>
<Code Snippets>

**Verify:** <How to confirm this task is done — command, test, manual check>
```

## Standalone Plan Rules

- You MUST write a standalone plan; you MUST NOT reference the chat (e.g., "as discussed above").
- You MUST restate all assumptions, constraints, definitions, and goals inside the plan body (Summary/Overview/Prerequisites/Open Questions).

## Open Questions Discipline

- All unknowns/decisions MUST appear only in **Open Questions**.
- Tasks MUST be concrete and decision-free; you MUST NOT propose alternatives inside tasks.
- If a task depends on an unanswered question, you MUST explicitly block it and mark the dependency.
- You MUST NOT use ambiguous language in tasks (e.g., "could", "might", "maybe", "either/or", "TBD", "figure out").

## Remember

- You MUST include exact file paths (line numbers if relevant).
- You MUST provide concrete, verbose implementation steps (code when useful), not vague directives.
- You MUST include exact verification commands and expected output.
- You MUST reference relevant skills when applicable.
- You MUST order tasks by dependency, call out blocking relationships, and make each task independently verifiable.
- Open questions and prerequisites MUST be resolved and integrated before implementation.
- Before finalizing, you MUST run a "standalone + no-open-questions-in-tasks" pass.
