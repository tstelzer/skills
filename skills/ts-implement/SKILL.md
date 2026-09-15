---
name: ts-implement
description: Implement or fix code. Only explicitly triggered by user.
---

# Implement

## Required Reading

- skill: ts-principles
  - Read `ts-principles/SKILL.md`.
  - Read every linked principle detail document before implementing.

## Role

Implement is a judge.

It sets scope, delegates work, changes code, checks results, and reports the handoff.
Use it to build a requested change, fix bugs, address review findings, or change behavior.
Do not use it to explore or plan.

Implement directly or delegate work that splits cleanly by files, domains, or independent tasks.
Workers return changes and check results. The judge checks and combines them.

When the change adds or edits technical writing, always spawn a sub-agent with `skill: ts-technical-writing`
to edit it directly. The editor returns edited writing, not review findings.

## Sub-Agent Selection

Choose sub-agent workers as follows.

- Choose the first available entry for the worker role.
- If the agent tool cannot set provider, model line, and reasoning separately, choose the closest available model.
  Record what actually ran.
- Do not spawn extra workers just to use every entry.
- Spawn workers only when their patches do not overlap and the judge can check and combine them with little effort.
- Keep architecture that spans modules, decisions about shared ownership, and final integration with the judge.

### Implementation Worker

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `terra` latest | `medium` |
| 2 | Anthropic | `sonnet` latest | `medium` |
| 3 | OpenAI | `sol` latest | `high` |
| 4 | Cursor | `composer` | `high` |

Good worker tasks:

- one module or adapter
- one part of the UI
- one test file or test suite
- one docs update before the final technical-writing edit
- one mechanical part of a refactor

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
2. DETERMINE_DELEGATION
3. APPLY_CHANGES
4. EDIT_TECHNICAL_WRITING
5. VERIFY
6. HANDOFF

### DETERMINE_SCOPE

- Identify the task input: a request, plan, design, or open findings.
- Treat every supplied finding as in scope unless impossible or unsafe. Do not drop findings silently.

### DETERMINE_DELEGATION

- Implement directly when the change is one scoped edit.
- Spawn sub-agent workers only when the work separates cleanly across files, domains, or independent tasks.
- Give parallel workers separate files or areas to edit.
- Workers must not spawn other workers, widen scope, or write the handoff.
- Each worker prompt must include:
    - The assigned task and its limits.
    - The worker's assigned provider, model line, and reasoning level.
    - The skills to use, e.g. `skill: ts-principles`.
    - The response format: changes made, checks run, open risks.
    - The rule that workers report tool failures to the judge instead of silently doing less work.

### APPLY_CHANGES

- Apply the changes per `skill: ts-principles`.
- Add or update tests when the changed behavior needs proof.
- Before finishing code, check whether changed exported interfaces, rules that must hold, failure cases, concurrency,
  performance, security, or domain rules need an explanation the code cannot give.
- Put that explanation nearby: `/** ... */` for exported interfaces, short comments for surprising rules or pitfalls,
  or docs kept with the source for changed behavior.
- Do not add comments that repeat names, types, schemas, tests, or obvious code.

### EDIT_TECHNICAL_WRITING

- Run this step whenever the change creates or modifies technical writing:
  Markdown docs, README files, comments, JSDoc, changelog text, migration notes,
  CLI help, UI technical copy, workflow logs, or handoff artifacts.
- Always spawn a technical-writing editor sub-agent with
  `skill: ts-technical-writing`.
- The editor edits the writing directly. It must return the edited files or
  patch, not review findings or suggestions.
- The editor must preserve technical facts, commands, APIs, file paths, code
  symbols, examples, source links, behavior, and scope.
- The editor may adjust the writing to its reader and purpose, fix structure, bullets, prose, and examples,
  and remove llm-isms.
- The judge must not perform the technical-writing edit itself. The judge may
  make factual corrections after the edit.
- Run the editor again if factual corrections substantially change the text.
- The editor prompt must include:
    - The changed writing and its exact file paths.
    - The technical facts and behavior that must not change.
    - The assigned provider, model line, and reasoning level.
    - `skill: ts-technical-writing`.
    - The rule that the editor is not a reviewer and must edit directly.

### VERIFY

- Run the most relevant checks available: typecheck, lint, tests touching the change.
- If a required check cannot run after the obvious fix, stop and escalate. In a workflow, return
  `STATUS: ESCALATE: <tool> unavailable: <reason>`. Outside a workflow, stop and surface the failure inline.
  Record the failure and continue only when the task explicitly allows proceeding without that check.

### HANDOFF

- Report:
    - What changed.
    - Checks run and their results.
    - Open risks or departures from the requested work.
    - Findings resolved or still unresolved.
- If a log path was provided, use the `ts-log` skill to update it. Otherwise report inline.
