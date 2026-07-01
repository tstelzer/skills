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

Debug is a repair judge.

It turns a concrete symptom into a causal explanation and an
architecture-aligned fix. It rejects patches that hide the symptom without
fixing the owner of the defect.

The judge may edit code. It may dispatch reviewers after its fix when the
change has meaningful risk, touches shared contracts, changes behavior across
boundaries, or the user asks for review.

## Workflow

1. FRAME_SYMPTOM
2. REPRODUCE
3. TRACE_CAUSE
4. CHOOSE_REMEDY
5. APPLY_FIX
6. VERIFY
7. REVIEW_IF_NEEDED
8. HANDOFF

### FRAME_SYMPTOM

- Capture the exact error, command, input, environment, and expected behavior
  when available.
- Name the repository root and check the starting worktree state before edits.
- Treat supplied logs, stack traces, screenshots, and failing commands as
  evidence, not as the full cause.

### REPRODUCE

- Reproduce the failure locally when possible.
- Use the smallest command that shows the symptom.
- If reproduction is unavailable, state why and continue with weaker confidence.

### TRACE_CAUSE

- Identify the failing boundary: command, tool, API, module, data contract,
  runtime state, dependency, environment, or external service.
- Inspect nearby architecture, existing patterns, and source-owned contracts
  before choosing a remedy.
- Explain the causal chain before editing code.
- Fix the owner of the defect, not the nearest caller that can mask it.

### CHOOSE_REMEDY

Before editing, classify the remedy:

- `causal fix`: changes the code or contract that owns the defect.
- `boundary adaptation`: handles a real external contract at the edge.
- `containment`: mitigates an upstream or environmental defect.
- `workaround`: hides the symptom without fixing ownership.

Apply `causal fix` or `boundary adaptation`.

Apply `containment` only when the cause is outside the repo or cannot be fixed
now. Record the reason and removal condition.

Do not apply `workaround`.

Treat these as suspect until proven necessary:

- build-tool wrappers
- broad catches or swallowed errors
- loosened types
- skipped tests or changed snapshots
- sleeps, retries, and timing changes
- broad fallback paths
- special cases far from the owning boundary

### APPLY_FIX

- Keep the fix scoped to the owner of the defect.
- Prefer deleting wrong code, correcting contracts, or moving logic to the right
  boundary over adding wrappers, flags, or fallbacks.
- Add or update tests when the changed behavior needs proof.
- Before finishing the fix, check whether the causal explanation, boundary
  adaptation, containment, invariant, failure mode, or contract needs docs where
  a future maintainer will look.
- Add `/** ... */`, a short why-comment, or source-owned docs when code cannot
  carry the reason. Do not add comments that restate the code.
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

Reviewer prompts must include:

- the original symptom
- the causal explanation
- the debug-owned diff
- verification run
- suspected risk areas

Reviewers must look for false fixes, hidden workarounds, contract drift,
overbroad changes, missing tests, and behavior masked by tooling changes.

### HANDOFF

Report:

- Symptom and reproduction status.
- Root cause and owning boundary.
- Remedy classification.
- Fix applied.
- Verification run and result.
- Review result, open risks, or deviations.
