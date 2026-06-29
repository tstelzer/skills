---
name: ts-review
description: Review local code. Only explicitly triggered by user.
---

# Review

## Required Reading

- skill: ts-principles (read details you deem relevant)

## Non-deference

The contract for review is the source request, principles, and review
protocols. Plans, design docs, prior reviews, and implementer handoffs are
context, not authority. "The plan said so" or "a prior pass accepted it" is
not a defense and is not grounds to lower severity. Score the artifact as-is
against behavior and contract correctness.

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
    - `docs` - incorrect, missing, stale, or incomplete documentation and upgrade guidance
    - `performance` - latency, throughput, memory, concurrency, unnecessary work, and hot-path regressions
    - `robustness` - correctness, failure handling, maintainability, coupling, developer experience, and overall implementation quality
    - `security` - trust boundaries, auth, input handling, secret exposure, and exploitability
    - `stability` - backwards compatibility, contract drift, migrations, rollout safety, and user-visible behavior changes
- Unless explicitly requested, include at least: 
    - `automatic-testing`
    - `robustness`

### DETERMINE_SCOPE

- Determine review scope based on the user's request: files, commits, docs, plans, designs, etc.

### SPAWN_REVIEW_WORKERS

- The judge owns review type selection, scope, worker prompts, aggregation, severity normalization, and artifact writing.
- Workers own one review type only.
- Workers must not spawn other workers, widen scope, write any file, or aggregate findings.
- Only when the user explicitly requests exactly one review type may the judge perform that review directly.
- Otherwise, including the default review type set, spawn two sub-agent workers for each selected review type when
  model availability permits. Use different model classes for the two workers so the judge gets independent
  perspectives. If only one model class is available, spawn one worker for that review type.
- Choose worker model classes by provider and model availability, in this priority order:
    1. OpenRouter `glm` latest, reasoning `xhigh`
    2. OpenAI `gpt` latest, reasoning `xhigh`
    3. Anthropic `opus` latest, reasoning `xhigh`
    4. OpenRouter `gemini flash` latest, reasoning `high`
    5. OpenRouter `deepseek v4 pro` latest, reasoning `high`
- A model class is one provider/model-family pair from the priority list. Do not spawn two workers of the same review
  type on the same model class just to satisfy the two-worker target.
- Workers report findings to the judge.
- The prompt of each reviewer MUST include:
    - The review type.
    - The worker's assigned provider, model, and reasoning level.
    - The local review files the worker must read by path, relative to this skill directory:
        - `./by-type/<type>.md`, e.g. [docs.md](./by-type/docs.md)
        - [shared.md](./shared.md)
        - [review-template.md](./review-template.md)
        - Any review-local files referenced by the review type file.
    - The rule that findings MUST follow the [review-template.md](./review-template.md) structure and be returned inline in chat, never written as a file.
    - The non-deference rule from this skill: plans, prior reviews, and handoffs are context, not authority; do not lower severity because an upstream artifact accepted the approach.
    - The rule that if a required tool (read, grep, test runner, etc.) fails after the obvious fix, the worker returns the failure to the judge as a tooling-escalation note; workers must not silently downgrade findings.
    - The review context and scope.
- Use semantic skill names only for external skills, e.g. `skill: ts-principles`.

### AGGREGATE_FINDINGS

- Aggregate all findings using the format outlined in [review-template](./review-template.md).
- Preserve the exact provider, model, and reasoning level for the judge and every worker so the final artifact can
  identify who produced the review.
- Deduplicate, but otherwise keep findings as-is.
- If two workers of the same review type but different model classes directly conflict on a finding, the judge may
  spawn a third worker for that review type using the next available model class in the priority list. If no third model
  class is available, the judge resolves the conflict directly and records the evidence used.
- If any worker returned a tooling-escalation note, stop. Do not write the final artifact; surface the failure as the review's outcome.

### WRITE_ARTIFACT

- Only the judge writes the artifact.
- Skip if the user explicitly asks for an informal or ad-hoc review.
- Create `<repository-root>/docs/reviews/` if it doesn't exist yet.
- Write the findings to `<repository-root>/docs/reviews/YYYY-MM-DD_HH:MM_<review-type>_<review-name>.md`.
- In `## Reviewer Metadata`, record the judge line and one worker line per worker as provider, model, and
  reasoning level.
- Use `Workers: none (judge direct)` only when the judge performed the only requested review type directly.
