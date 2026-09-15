---
name: ts-create-skill
description: Create or update skills.
---

# Create Skill

## Role

Create Skill is the judge for writing local skills.

Use it to create or update source skills in the `tstelzer/skills` repository.

The target skill is the skill being created or updated. Tell future agents what to do when it is invoked.
Do not write notes about how you authored it.

Edit only source files in this repository, usually under `skills/ts-*`. Never edit installed skill artifacts, caches, or
synced copies such as `~/.agents/skills` or `~/.codex/skills`.

Follow this repo's skill structure. Do not add formalities from generic skill guides unless the repo already uses them.

## Target Skill

- Prefix new skills with `ts-` to avoid naming conflicts.
- Keep skills brief. Put shared guidance in reference skills. Put worker instructions beside the root skill.
- Keep front matter to `name` and `description`.
- Action and workflow skills are normally invoked by name. For these, say `Only explicitly triggered by user.`
  in the description.
- If an action or workflow skill should run without being named, state what triggers it in the description.
- Reference skills already load by topic. Do not add trigger wording for them.
- When the target skill links to its own support docs, use paths relative to that skill folder, such as `./shared.md` or
  `./by-type/security.md`.
- "Local docs" means docs nested inside the same skill folder. It does not mean every doc in this repository.
- Use `skill: <name>` only for another skill, such as `skill: ts-principles`.
- For software engineering skills other than routers, consider making `ts-principles` required reading.
- Prefer rewriting an unclear rule in simpler words over adding exceptions, fallbacks, or chains of `unless`.
- Delete exceptions when one clear rule covers the same behavior.

## Voice

Write the target skill in plain technical English.

- Use active voice and concrete commands.
- Prefer examples over abstractions.
- Cut filler, empty introductions, and comments about the writing process.
- Avoid fancy phrasing, slogans, forced contrasts, and sentences shaped only for rhythm.
- Do not write in threes for cadence.
- Do not use em dashes.
- Do not say "it's worth noting", "moreover", "in conclusion", or "let's".
- Use UTF-8, LF, final newlines, and Markdown lines under 120 characters.
- If a sentence can be cut, cut it.

## Target Architecture

For workflow skills, describe who does each part of the work.

- router chooses the workflow or next judge; it does not combine findings
- judge sets scope, delegates work, combines findings, makes decisions, reports status, and writes artifacts
- worker handles one assigned task or angle; it does not spawn workers, widen scope, or write the final artifact
- refs hold guidance, examples, templates, and local context

Do the work directly by default. Add workers only when they make the work clearer, let it run in parallel,
start with fresh context, or focus on a smaller task. Combine the roles in one skill for small tasks.

The root skill explains how to choose steps, assign work, combine results, and write artifacts.
Worker instructions state their scope, required reading, excluded work, steps, and response format.

Use gates for pass/fail checks: required artifacts, evidence, status changes, blockers, and quality requirements.
Use guidance where judgment is needed: risks, context, tools, depth, and relevance. Do not turn guidance into gates.

## Workflow

1. LOAD_LOCAL_CONTEXT
2. DECIDE_SHAPE
3. WRITE_SKILL
4. CHECK

### LOAD_LOCAL_CONTEXT

- Read relevant existing `../ts-*/SKILL.md` examples.
- For edits, read the whole target skill and its linked local references.
- Identify whether the skill is a workflow, judge, worker brief, or reference.
- Keep instructions for writing skills separate from instructions for running the target skill.
  The target skill must tell future agents what to do when invoked.
- Start from existing skills in the repo. Use generic skill patterns only when the repo gives no guidance.

### DECIDE_SHAPE

- Prefer one root `SKILL.md`.
- Add references beside the skill only when they shorten it or remove duplication.
- Add a layer only when it makes responsibilities clearer.

### WRITE_SKILL

- State the role before the workflow.
- Artifacts must stand alone without the chat.
- Rewrite unclear text directly. Do not patch around it with exceptions.

### CHECK

- The skill can be read without prior conversation.
- The name starts with `ts-`.
- Action and workflow skill descriptions say whether they are explicit-only.
- Rules are direct commands, not chains of exceptions.
- Local paths and `skill: <name>` references are correct.
- The edit touched only source skills under `tstelzer/skills`, not installed artifacts.
