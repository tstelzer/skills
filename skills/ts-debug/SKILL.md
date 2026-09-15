---
name: ts-debug
description: Debug. Only explicitly triggered by user.
---

# Debug

## Required Reading

- skill: ts-principles
  - Read `ts-principles/SKILL.md`.
  - Read every linked principle detail document before debugging.

## Role

Debug is the judge for finding and fixing bugs.

It explains what causes a symptom and chooses a fix that fits the architecture.
It rejects patches that hide the symptom while leaving the responsible code broken.

Get explicit user approval for the proposed fix before changing code, including tests and temporary diagnostic edits.
This applies even to trivial fixes. Invoking this skill does not grant approval.

After the fix, it may assign reviewers when the change has meaningful risk, touches shared contracts,
changes behavior across boundaries, or the user asks for review.

## Sub-Agent Selection

Choose sub-agent reviewers as follows.

- Choose the first available entry for the reviewer role.
- If the agent tool cannot set provider, model line, and reasoning separately, choose the closest available model.
  Record what actually ran.
- When spawning more than one reviewer, use different provider and model-line
  pairs when model availability permits.

### Review Worker

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | Anthropic | `fable` latest | `high` |
| 2 | OpenAI | `astra` latest | `high` |
| 3 | OpenRouter | `glm` latest | `xhigh` |
| 4 | Anthropic | `opus` latest | `high` |
| 5 | OpenAI | `sol` latest | `high` |
| 6 | OpenRouter | `gemini flash` latest | `high` |
| 7 | OpenRouter | `deepseek v4 pro` latest | `high` |
| 8 | Cursor | `composer` | `high` |

## Workflow

1. FRAME_SYMPTOM
2. REPRODUCE
3. TRACE_CAUSE
4. CHOOSE_REMEDY
5. WAIT_FOR_SIGNOFF
6. APPLY_FIX
7. VERIFY
8. REVIEW_IF_NEEDED
9. HANDOFF

### FRAME_SYMPTOM

- Capture the exact error, command, input, environment, and expected behavior
  when available.
- Name the repository root and check the starting worktree state before edits.
- Treat supplied logs, stack traces, screenshots, and failing commands as
  evidence, not as the full cause.

### REPRODUCE

- Reproduce the failure locally when possible.
- Use the smallest command that shows the symptom.
- If you cannot reproduce the failure, say why and lower your confidence in the diagnosis.

### TRACE_CAUSE

- Identify the failing boundary: command, tool, API, module, data contract,
  runtime state, dependency, environment, or external service.
- Read the nearby architecture, existing patterns, and contracts defined in source before choosing a fix.
- Explain how the cause leads to the symptom before editing code.
- Fix the responsible code. Do not hide its defect in a caller.

### CHOOSE_REMEDY

Before editing, classify the proposed fix:

- `causal fix`: repairs the responsible code or contract.
- `boundary adaptation`: handles an external contract where it enters the system.
- `containment`: limits the effects of a defect in a dependency or environment.
- `workaround`: hides the symptom without repairing the responsible code.

Propose `causal fix` or `boundary adaptation`.

Propose `containment` only when the cause is outside the repo or cannot be fixed
now. Record why and when the containment can be removed.

Reject `workaround`.

Treat these as suspect until proven necessary:

- build-tool wrappers
- broad catches or swallowed errors
- loosened types
- skipped tests or changed snapshots
- sleeps, retries, and timing changes
- broad fallback paths
- special cases far from the responsible code

### WAIT_FOR_SIGNOFF

- Explain the cause and proposed fix category. Show the affected files, exact proposed changes, and planned checks.
- Ask the user to approve the proposed changes. Wait for explicit signoff before
  editing code or running commands that change it.
- Keep investigation read-only until signoff. Obtain approval before adding
  reproduction tests or temporary instrumentation.
- Apply only the approved changes. Return to this gate when further diagnosis,
  verification, or review requires changes outside the approved scope.

### APPLY_FIX

- Keep the fix in the code responsible for the defect.
- Prefer deleting wrong code, correcting contracts, or moving logic to the right
  boundary over adding wrappers, flags, or fallbacks.
- Add or update tests when the changed behavior needs proof.
- Before finishing, check whether the cause, boundary adaptation, containment, rule that must hold, failure case,
  or contract needs docs where a future maintainer will look.
- Add `/** ... */`, a short comment explaining why, or docs kept with the source when code cannot explain the reason.
  Do not add comments that restate the code.
- Preserve unrelated user changes.

### VERIFY

- Re-run the reproduction command.
- Run the smallest additional check that proves the fix changed behavior for
  the right reason.
- If a required check cannot run after the obvious fix, stop and surface the
  failure.

### REVIEW_IF_NEEDED

Dispatch reviewers when the fix touches auth, persistence, public APIs,
migrations, shared tooling, build behavior, dependency resolution, concurrency,
or cross-module contracts.

Choose reviewers from the `Review Worker` list.

Reviewer prompts must include:

- the original symptom
- the cause
- the diff made during debugging
- checks run
- assigned provider, model line, and reasoning level
- suspected risk areas

Reviewers must look for false fixes, hidden workarounds, changed interface promises, changes beyond the needed scope,
missing tests, and behavior hidden by tool changes.

### HANDOFF

Report:

- Symptom and reproduction status.
- Root cause and responsible code or boundary.
- Fix category.
- Fix applied.
- Checks run and their results.
- Review result, open risks, or departures from the approved fix.
