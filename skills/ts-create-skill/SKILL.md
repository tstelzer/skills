---
name: ts-create-skill
description: Create or update skills.
---

# Create Skill

## Role

Create Skill is a local skill-authoring judge.

Use it to create or update source skills in the `tstelzer/skills` repository.

The target skill is the skill being created or updated. Write it as the runtime contract for future agents invoked by
that skill, not as notes about this authoring process.

Edit only source files in this repository, usually under `skills/ts-*`. Never edit installed skill artifacts, caches, or
synced copies such as `~/.agents/skills` or `~/.codex/skills`.

Local skill shape wins over generic skill-creation habits. Do not import ceremony from internal skill docs unless this
repo already uses it.

## Target Skill

- Prefix new skills with `ts-` to avoid naming conflicts.
- Keep skills brief. Put reusable doctrine in reference skills. Put worker briefs beside the root skill.
- Keep front matter to `name` and `description`.
- Action and workflow skills are normally invoked by name. For that usual case, say `Only explicitly triggered by user.`
  in the description.
- If an action or workflow skill is intentionally implicit, say the implicit trigger plainly in the description.
- For reference skills, omit implicit-trigger wording. Topic-based invocation is already implicit.
- When the target skill links to its own support docs, use paths relative to that skill folder, such as `./shared.md` or
  `./by-type/security.md`.
- "Local docs" means docs nested inside the same skill folder. It does not mean every doc in this repository.
- Use `skill: <name>` only for another skill, such as `skill: ts-principles`.
- Unless for routers, its often useful to reference `ts-principles` as required reading, if the skills is related to
  software engineering.
- Prefer rewriting an unclear rule in simpler words over adding exceptions, fallbacks, or chains of `unless`.
- Delete escape hatches when one sharper rule covers the intended behavior.

## Voice

Write the target skill in plain technical English.

- Use active voice and concrete commands.
- Prefer examples over abstractions.
- Cut filler, throat-clearing, and meta commentary.
- Avoid flourishes, slogans, rhetorical reversals, and decorative rhythm.
- Do not write in threes for cadence.
- Do not use em dashes.
- Do not say "it's worth noting", "moreover", "in conclusion", or "let's".
- Use UTF-8, LF, final newlines, and Markdown lines under 120 characters.
- If a sentence can be cut, cut it.

## Target Architecture

For workflow skills, describe a small hierarchy for multi-step agent work.

- router chooses the workflow shape or next judge; it does not synthesize findings
- judge owns scope, delegation, synthesis, decisions, status, and artifacts
- worker owns one bounded task or lens; it does not spawn workers, widen scope, or write the final artifact
- refs provide doctrine, examples, templates, and local context

Default to direct execution. Add workers only when they buy clarity, parallelism, fresh context, or a narrower prompt.
Collapse router, judge, and worker into one skill when the task is small.

The root skill explains routing, delegation, aggregation, and artifacts. Worker briefs define owned scope, required
reading, out-of-scope work, workflow, and output shape.

Use gates for binary checks: required artifacts, evidence, status transitions, blockers, and quality bars. Use guidance
for judgment: risks, context, tools, depth, and relevance. Do not dress guidance up as gates.

## Workflow

1. LOAD_LOCAL_CONTEXT
2. DECIDE_SHAPE
3. WRITE_SKILL
4. CHECK

### LOAD_LOCAL_CONTEXT

- Read relevant existing `../ts-*/SKILL.md` examples.
- For edits, read the whole target skill and its linked local references.
- Identify whether the skill is a workflow, judge, worker brief, or reference.
- Distinguish authoring instructions from the target skill's future runtime contract. The target skill should tell
  future agents what to do when invoked.
- Treat existing repo shape as evidence. Treat generic skill-authoring patterns as fallback only.

### DECIDE_SHAPE

- Prefer one root `SKILL.md`.
- Add co-located references only when they remove bulk or duplication.
- Do not add a layer unless it removes ambiguity.

### WRITE_SKILL

- State the role before the workflow.
- Artifacts must stand alone without the chat.
- Rewrite unclear text directly. Do not patch around it with exceptions.

### CHECK

- The skill can be read without prior conversation.
- The name starts with `ts-`.
- Action and workflow skill descriptions say whether they are explicit-only.
- Rules are direct commands, not chains of exceptions.
- Local paths and semantic skill names are used correctly.
- The edit touched only source skills under `tstelzer/skills`, not installed artifacts.
