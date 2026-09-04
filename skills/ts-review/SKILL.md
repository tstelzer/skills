---
name: ts-review
description: Review local code. Only explicitly triggered by user.
---

# Review

## Required Reading

- skill: ts-principles
  - Read `ts-principles/SKILL.md`.
  - Read every linked principle detail document before reviewing.
- skill: ts-technical-writing
  - Required when the judge writes any review artifact.
  - Before aggregation, read `ts-technical-writing/SKILL.md`, `ts-technical-writing/audience.md`,
    `ts-technical-writing/prose.md`, and `ts-technical-writing/structure.md`.
  - For `technical-writing` reviews, read every linked technical-writing detail document before reviewing.

## Role

Review is a judge.

It owns review types, scope, worker dispatch, aggregation, severity, findings,
and dispositions. Workers own inspection and evidence. Use their reports
without repeating their work. Investigate only missing, conflicting, or
insufficient evidence.

## Authority And Evidence

The caller may make a source request, plan, design, decision, or explicit scope
authoritative. Principles guide review inside that contract. They do not add
product or architecture scope.

Prior reviews and handoffs do not prove the current artifact. Do not reopen an
accepted decision unless current worker evidence invalidates its assumptions.

## Sub-Agent Selection

Use this section when this skill spawns sub-agent workers.

- Choose the first available entry for the worker role.
- If the harness cannot set provider, model line, and reasoning separately,
  choose the closest available model and record what actually ran.
- Do not spawn two workers of the same review type on the same provider and
  model line. Two releases of `sol` are one model class, not two.

### Review Worker

| Priority | Provider | Model line | Reasoning |
| --- | --- | --- | --- |
| 1 | OpenRouter | `glm` latest | `xhigh` |
| 2 | Anthropic | `fable` latest | `xhigh` |
| 3 | OpenAI | `sol` latest | `xhigh` |
| 4 | OpenRouter | `gemini flash` latest | `high` |
| 5 | OpenRouter | `deepseek v4 pro` latest | `high` |
| 6 | Cursor | `composer` | `high` |

## Workflow

1. DETERMINE_TYPE
2. DETERMINE_SCOPE
3. SPAWN_REVIEW_WORKERS
4. AGGREGATE_FINDINGS
5. WRITE_ARTIFACT

### DETERMINE_TYPE

- Determine most useful review types based on the user's request, and your own judgement.
- Available review types:
    - `automatic-testing` - broken tests, weak tests, and missing automated coverage for changed behavior
    - `technical-writing` - incorrect, missing, stale, unsafe, or unclear technical writing, examples, docs,
      upgrade guidance, or instructions readers must follow
    - `performance` - latency, throughput, memory, concurrency, unnecessary work, and hot-path regressions
    - `robustness` - correctness, failure handling, maintainability, coupling, developer experience, and overall
      implementation quality
    - `security` - trust boundaries, auth, input handling, secret exposure, and exploitability
    - `stability` - backwards compatibility, contract drift, migrations, rollout safety, and user-visible behavior
      changes
- If the user asks for a docs review, select `technical-writing`.
- Unless explicitly requested, include at least:
    - `automatic-testing`
    - `robustness`

### DETERMINE_SCOPE

- Determine review scope based on the user's request: files, commits, docs, plans, designs, etc.

### SPAWN_REVIEW_WORKERS

- The judge owns review type selection, scope, worker prompts, aggregation, severity normalization, and artifact
  writing.
- Workers own one review type only.
- Workers must not spawn other workers, widen scope, or aggregate findings.
- Workers must not write files unless the review type file explicitly allows direct edits.
- `technical-writing` is the only review type that may directly edit files.
- When direct edits are enabled for `technical-writing`, dispatch only one worker for that review type. The worker owns
  the writing pass.
- When the judge performs a `technical-writing` review directly, the judge may make the same direct edits.
- Only when the user explicitly requests exactly one review type may the judge perform that review directly.
- Otherwise, including the default review type set, spawn two sub-agent workers for each selected review type when
  model availability permits. Use different model classes for the two workers so the judge gets independent
  perspectives. If only one model class is available, spawn one worker for that review type. The `technical-writing`
  direct-edit rule overrides this fan-out rule.
- Choose workers from the `Review Worker` list in `Sub-Agent Selection`.
- A model class is one provider and model-line pair from the priority list.
- Workers report findings and direct-edit notes to the judge.
- The prompt of each reviewer MUST include:
    - The review type.
    - The worker's assigned provider, model line, and reasoning level.
    - The local review files the worker must read by path, relative to this skill directory:
        - `./by-type/<type>.md`, e.g. [technical-writing.md](./by-type/technical-writing.md)
        - [shared.md](./shared.md)
        - [review-template.md](./review-template.md)
        - Any review-local files referenced by the review type file.
    - For `technical-writing`, the required semantic skill `skill: ts-technical-writing`, including every linked
      local detail document.
    - The rule that findings MUST follow the [review-template.md](./review-template.md) structure and be returned
      inline in chat, never written as a file.
    - For `technical-writing`, the direct-edit policy from [technical-writing.md](./by-type/technical-writing.md).
      Direct edits must be reported inline with changed paths and a short purpose.
    - For every other review type, the rule that the worker is read-only and must not write files.
    - The evidence rule from this skill: prior reviews and handoffs are not proof of correctness; establish findings
      from the assigned inspection. Do not dispute an accepted scope or design decision unless evidence invalidates
      its assumptions.
    - The rule that if a required tool (read, grep, test runner, etc.) fails after the obvious fix, the worker returns
      the failure to the judge as a tooling-escalation note. Workers must not silently downgrade findings.
    - The review context and scope.
- Use semantic skill names only for external skills, e.g. `skill: ts-principles`.

### AGGREGATE_FINDINGS

- Aggregate all findings using the format outlined in [review-template](./review-template.md).
- Preserve the exact provider, model line, and reasoning level for the judge and every worker so the final artifact can
  identify who produced the review.
- Preserve direct-edit reports from `technical-writing`. Do not convert an issue into an open finding when a direct edit
  fully resolved it.
- Deduplicate findings. Rewrite titles, impact, evidence, and suggested fixes for clarity without changing severity,
  technical meaning, locations, or conclusions.
- After deduplication and priority ordering, assign each finding a document-wide ID: `F001`, `F002`, and so on.
  Treat worker-supplied IDs as provisional. In follow-up reviews, preserve the prior ID for the same finding and assign
  new findings the next unused ID.
- Write titles that name the defect and affected behavior, not the review category.
- State the concrete consequence in `Impact`.
- Start each `Suggested Fix` with an action and name the target file, symbol, command, or document when known.
- Keep exact code symbols, API names, commands, protocol terms, and established domain terms. Replace review workflow
  vocabulary with words the reader uses.
- If two workers of the same review type but different model classes directly conflict on a finding, the judge may
  spawn a third worker for that review type using the next available model class in the priority list. If no third model
  class is available, the judge resolves the conflict directly and records the evidence used.
- If any worker returned a tooling-escalation note, stop. Do not write the final artifact; surface the failure as the
  review's outcome.

### WRITE_ARTIFACT

- Only the judge writes the artifact.
- Skip if the user explicitly asks for an informal or ad-hoc review.
- Create `<repository-root>/docs/reviews/` if it doesn't exist yet.
- Write the findings to `<repository-root>/docs/reviews/YYYY-MM-DD_HH:MM_<review-type>_<review-name>.md`.
- If `technical-writing` direct edits were made, include a `## Direct Edits` section with changed paths and purpose.
- Put the result and findings before scope and reviewer metadata.
- In `## Reviewer Metadata`, record the judge line and one worker line per worker as provider, model line, and
  reasoning level.
- Use `Workers: none (judge direct)` only when the judge performed the only requested review type directly.
