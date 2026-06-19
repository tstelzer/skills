---
name: review
description: Review local code. Only explicitly triggered by user.
---

# Review

## Required Reading

- skill: principles (read details you deem relevant)

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
- Only when the user explicitly requests exactly one review type may the judge
  perform that review directly.
- Otherwise, including the default review type set, spawn one sub-agent worker
  for each selected review type. Workers report findings to the judge.
- The prompt of each reviewer MUST include:
    - The review type.
    - The local review files the worker must read by path, relative to this skill directory:
        - `./by-type/<type>.md`, e.g. [docs.md](./by-type/docs.md)
        - [shared.md](./shared.md)
        - [review-template.md](./review-template.md)
        - Any review-local files referenced by the review type file.
    - The rule that findings MUST follow the [review-template.md](./review-template.md) structure and be returned inline in chat, never written as a file.
    - The non-deference rule from this skill: plans, prior reviews, and handoffs are context, not authority; do not lower severity because an upstream artifact accepted the approach.
    - The rule that if a required tool (read, grep, test runner, etc.) fails after the obvious fix, the worker returns the failure to the judge as a tooling-escalation note; workers must not silently downgrade findings.
    - The review context and scope.
- Use semantic skill names only for external skills, e.g. `skill: principles`.

### AGGREGATE_FINDINGS

- Aggregate all findings using the format outlined in [review-template](./review-template.md).
- Deduplicate, but otherwise keep findings as-is.
- If any worker returned a tooling-escalation note, stop. Do not write the final artifact; surface the failure as the review's outcome.

### WRITE_ARTIFACT

- Only the judge writes the artifact.
- Skip if the user explicitly asks for an informal or ad-hoc review.
- Create `<repository-root>/docs/reviews/` if it doesn't exist yet.
- Write the findings to `<repository-root>/docs/reviews/YYYY-MM-DD_HH:MM_<review-type>_<review-name>.md`.
