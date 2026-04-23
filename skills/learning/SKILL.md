---
name: learning
description: Use when durable per-user preferences or lessons may matter across sessions. Consult shared memory proactively and update it with new high-signal entries when warranted.
---

# Learning

Keep durable per-user memory in `~/.agents/memory.md`. Read it at the start of every task. Keep the file small and high-signal.

Invoke this skill autonomously by default. Do not wait for the user to ask explicitly.

## Workflow

1. Open `~/.agents/memory.md` at the start of the task. If it does not exist, create it with a `# Agent Memory` heading and a flat list of entries.
2. Read the whole file. The store should stay small enough to load every session.
3. Apply current user instructions first, then resolve memory by scope: `path` over `workspace` over `global`.
4. Add or update memory only when the information is durable, behavior-relevant, and does not fit better in repo docs, code, task notes, or a feedback/change-request workflow.
5. Mention any memory additions or updates in the final response.

## Entry Shape

Use a flat list. Every entry must include:

- `id`
- `type`: `fact` | `preference` | `lesson`
- `scope`: `global` | `workspace` | `path`
- `workspace`: absolute path for `workspace` or `path` scope
- `path`: absolute path for `path` scope
- `provenance`: `user-stated` | `agent-inferred`
- `statement`: the memory itself
- `effect`: how future agent behavior should change
- `updated_at`: `YYYY-MM-DD`

## Write Rules

- Prefer the narrowest plausible scope.
- Use `global` only for durable preferences or lessons that clearly generalize across work.
- Current state only: update matching entries in place instead of creating near-duplicates.
- This skill may add or update entries, not delete them.
- If promoting a memory to a broader scope, rewrite the statement for the broader scope instead of only widening the scope field.
- A single high-signal observation is enough for v1, but do not persist weak hunches.

## Do Not Store

- Temporary task state
- Speculative guesses
- Repo facts that belong in `README.md`, `ARCHITECTURE.md`, `AGENTS.md`, or code comments
- Requests to change docs, tooling, or repo structure
- One-off debugging notes
- Sensitive personal observations
- Anything that does not plausibly change future agent behavior

## Example

```md
# Agent Memory

- id: concise-final-responses
  type: preference
  scope: global
  provenance: user-stated
  statement: User prefers concise final responses unless extra depth is requested.
  effect: Keep close-out messages short by default.
  updated_at: 2026-04-23

- id: legacy-payments-surgical-edits
  type: lesson
  scope: path
  workspace: /abs/path/to/workspace
  path: /abs/path/to/workspace/services/payments
  provenance: agent-inferred
  statement: Broad refactors in the payments area tend to create churn; prefer surgical edits.
  effect: Avoid wide-scope rewrites in this path unless the user explicitly asks for one.
  updated_at: 2026-04-23
```

## Examples

- "Remember that I prefer concise final answers."
- "Check my persistent memory before you start."
- "Update the shared memory with what you learned here."
