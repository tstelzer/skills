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

It owns scope, delegation, changes, verification, and handoff. Use it for concrete code work: building a request,
fixing bugs, applying review findings, or changing behavior. Not for discovery or planning.

The judge may do the work directly. Delegate only when the work separates cleanly across files, domains, or independent
tasks. Workers return changes and verification notes. The judge reconciles them.

## Sub-Agent Selection

Use this section when this skill spawns sub-agent workers.

- Choose the first available entry for the worker role.
- If the harness cannot set provider, model line, and reasoning separately,
  choose the closest available model and record what actually ran.
- Do not spawn extra workers just to use every entry.
- Spawn workers only when a worker can produce a disjoint patch that the judge
  can verify and integrate cheaply.
- Use Spark first for bounded code edits, test additions, and mechanical
  changes.
- Do not delegate cross-cutting architecture, shared ownership decisions, or
  final integration.

### Implementation Worker

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenAI | `gpt-5.3-codex-spark` | `high` |
| 2 | Cursor | `composer` | `high` |
| 3 | Anthropic | `sonnet` latest | `high` |

Good worker tasks:

- one module or adapter
- one UI surface
- one test file or test suite
- one docs update
- one mechanical refactor slice

## Workflow

1. DETERMINE_SCOPE
2. DETERMINE_DELEGATION
3. APPLY_CHANGES
4. VERIFY
5. HANDOFF

### DETERMINE_SCOPE

- Identify the task input: a request, plan, design, or open findings.
- Treat every supplied finding as in scope unless impossible or unsafe. Do not drop findings silently.

### DETERMINE_DELEGATION

- Implement directly when the change is one bounded edit.
- Spawn sub-agent workers only when the work separates cleanly across files, domains, or independent tasks.
- Use disjoint write scopes for parallel workers.
- Workers must not spawn other workers, widen scope, or write the handoff.
- The prompt of each worker MUST include:
    - The bounded task and scope.
    - The worker's assigned provider, model line, and reasoning level.
    - The skills to use, e.g. `skill: ts-principles`.
    - The output shape: changes made, verification run, open risks.
    - The rule that workers escalate tooling failures to the judge instead of silently downgrading output.

### APPLY_CHANGES

- Apply the changes per `skill: ts-principles`.
- Add or update tests when the changed behavior needs proof.
- Before finishing code, check changed exported contracts, invariants, failure
  modes, concurrency, performance, security, and domain rules for knowledge the
  code cannot carry.
- Add the nearest useful documentation: `/** ... */` for exported contracts,
  short comments for non-obvious invariants or sharp edges, or source-owned docs
  for changed behavior.
- Do not add comments that repeat names, types, schemas, tests, or obvious code.

### VERIFY

- Run the most relevant checks available: typecheck, lint, tests touching the change.
- If a required check cannot run after the obvious fix, stop and escalate. In a workflow, return
  `STATUS: ESCALATE: <tool> unavailable: <reason>`. Outside a workflow, stop and surface the failure inline.
  Recording-and-proceeding is allowed only when the task input explicitly authorizes proceeding without that check.

### HANDOFF

- Report:
    - Scope changed.
    - Verification run and result.
    - Open risks or deviations.
    - Findings resolved or still unresolved.
- If a log path was provided, use the `ts-log` skill to update it. Otherwise report inline.
