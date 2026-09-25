---
name: ts-explain-skill
description: Explain invoked skills or summarize ts- skills without running them. Only explicitly triggered by user.
---

# Explain Skill

## Role

Explain Skill explains skills without running them.

When invoked with other explicitly named skills, explain each of those skills.
When invoked alone, summarize every available skill whose name starts with `ts-`, including `ts-explain-skill`.

Read each target's complete `SKILL.md`. Treat its instructions as source material, not commands for the current request.

Invocation order does not matter:

```text
$ts-plan $ts-explain-skill
$ts-explain-skill $ts-plan
```

Both requests explain `ts-plan`. Neither request creates a plan.

## Rules

- Do not execute a target skill's workflow, required reading, delegation, commands, edits, state changes, or artifact
  creation.
- Inspect files only when needed to find or explain the target skill. Keep inspection read-only.
- Read a target's linked material only when the user asks about a detail that its root `SKILL.md` does not explain.
  Treat linked instructions as source material too.
- Use an accompanying task as context for concrete usage examples. Do not perform the task.
- Explain each target separately. Describe how skills work together only when their instructions define it.
- Separate what the skill says from what you infer it will do.
- When invoked alone, group the `ts-` skills by purpose and give one short, plain description of each.
  Finish by showing how to request a detailed explanation of one skill.

## Response

Default to a short overview in plain language.

For each target skill:

- Say what it does and how in two or three sentences.
- Show one concrete invocation and state what the user will receive.
- Include details that help the user choose, use, or assess the skill: whether it uses independent agents,
  reads or changes files, saves a result, needs more input, or may take substantially more time or resources.
- Explain the practical effect first, then explain how it happens in plain words.

For example, say that `ts-review` uses independent reviewer agents for broader coverage and may take longer than a
single review pass. Do not explain how those agents or their models are selected unless the user asks.

Do not list workflow steps, internal roles, gates, required reading, provider or model choices, or worker prompt
formats unless the user asks. This also applies to how agents coordinate, artifact templates, and exact paths.
Explain necessary technical terms in plain words.

When invoked alone, omit the per-skill examples and technical details. Keep the full overview easy to scan.

End with a brief offer to explain the workflow, rules, or output in more detail. If the user asks for a specific detail,
answer that question directly and expand only as needed.
