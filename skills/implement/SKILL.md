---
name: implement
description: Implement or fix code. Only explicitly triggered by user.
---

# Implement

## Required Reading

- skill: principles (read details you deem relevant)

## Role

Implement is a judge.

It owns scope, delegation, changes, verification, and handoff. Use it for concrete code work: building a request, fixing bugs, applying review findings, or changing behavior. Not for discovery or planning.

The judge may do the work directly. Delegate only when the work separates cleanly across files, domains, or independent tasks. Workers return changes and verification notes. The judge reconciles them.

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
- Workers must not spawn other workers, widen scope, or write the handoff.
- The prompt of each worker MUST include:
    - The bounded task and scope.
    - The skills to use, e.g. `skill: principles`.
    - The output shape: changes made, verification run, open risks.
    - The rule that workers escalate tooling failures to the judge instead of silently downgrading output.

### APPLY_CHANGES

- Apply the changes per `skill: principles`.
- Add or update tests when the changed behavior needs proof.

### VERIFY

- Run the most relevant checks available: typecheck, lint, tests touching the change.
- If a required check cannot run after the obvious fix, stop and escalate. In a workflow, return `STATUS: ESCALATE: <tool> unavailable: <reason>`. Outside a workflow, stop and surface the failure inline. Recording-and-proceeding is allowed only when the task input explicitly authorizes proceeding without that check.

### HANDOFF

- Report:
    - Scope changed.
    - Verification run and result.
    - Open risks or deviations.
    - Findings resolved or still unresolved.
- If a log path was provided, use the `log` skill to update it. Otherwise report inline.
