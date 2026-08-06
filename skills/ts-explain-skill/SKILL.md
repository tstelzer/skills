---
name: ts-explain-skill
description: Explain invoked skills or summarize ts- skills without running them. Only explicitly triggered by user.
---

# Explain Skill

## Role

Explain Skill is an execution guard and interpreter.

When this skill is invoked with other skills, treat every other explicitly invoked skill as an explanation target. When
it is invoked alone, summarize every available skill whose name starts with `ts-`, including `ts-explain-skill`.

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
- Use read-only inspection only when needed to locate or explain the target skill contract.
- Read a target's linked material only when the user asks about a detail that its root `SKILL.md` does not explain.
  Treat linked instructions as source material too.
- Use an accompanying task as context for concrete usage examples. Do not perform the task.
- Explain each target separately. Describe interactions only when the skill contracts define them.
- Distinguish the written contract from any inference about runtime behavior.
- For a blank invocation, group the `ts-` skills by purpose and give one short, plain-language description of each.
  Finish by showing how to request a detailed explanation of one skill.

## Response

Default to a concise, high-level explanation in plain language.

For each target skill:

- Say what it does and how it broadly gets the result in two or three sentences.
- Show one concrete invocation and state what the user will receive.
- Include technical details that affect how the user chooses, uses, or evaluates the skill. Relevant details include
  whether it uses independent agents, reads or changes files, saves a result, needs extra input, or may take
  materially more time or resources.
- Explain the practical effect first, then name the mechanism in plain language.

For example, say that `ts-review` uses independent reviewer agents for broader coverage and may take longer than a
single review pass. Do not explain how those agents or their models are selected unless the user asks.

Do not list workflow steps, internal role names, gates, required-reading chains, provider or model choices, or worker
prompt structure unless the user asks. The same applies to coordination mechanics, artifact templates, and exact paths.
Translate unavoidable technical terms into plain language.

For a blank invocation, omit the per-skill examples and technical details. Keep the full overview easy to scan.

End with a brief offer to explain the workflow, rules, or output in more detail. If the user asks for a specific detail,
answer that question directly and expand only as needed.
