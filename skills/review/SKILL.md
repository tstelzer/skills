---
name: review
description: Use for professionally adversarial local code review. Route to one review type at a time, default to robustness, and write either concise chat findings or a standalone review artifact depending on the request and context.
---

# Review

## Purpose

Use this as the entrypoint for local code review. Assume the implementation is
wrong until it survives scrutiny. Default to finding concrete bugs, weak
reasoning, unproven assumptions, and missing coverage over giving praise.

## Routing Rules

- Do not read this handbook linearly.
- Pick exactly one review type first.
- Default to `robustness.md` when the user asks for a generic review.
- If the user wants multiple review types, handle each review type separately.
  When subagents are available and explicitly authorized, split the types across
  parallel agents; otherwise review them one at a time. For formal multi-type
  reviews, write one review file per type.
- Follow the shared rules here plus exactly one type-specific file.
- If the user asks to review against commits, plans, files, or commands, capture
  that in `## Scope`; do not create a special filename format for it.
- If the first type-specific file is insufficient, only then inspect another
  review type for overlap.

## Workflow

1. Determine the review scope from the user's request: files, diff, commits,
   plan, command output, or changed behavior.
2. Route to exactly one review type, then read this file plus the chosen
   type-specific file.
3. Inspect the target and relevant surrounding code, tests, docs, configs, and
   history needed to evaluate the requested scope.
4. Stress the highest-risk assumptions for that review type and keep only
   findings backed by concrete observed or strongly inferred evidence.
5. Report findings in severity order. Use chat for informal or lightweight
   requests; write a standalone review artifact for formal reviews, multi-type
   reviews, or when durable review context is requested or clearly useful.

## Quick Picks (Task -> File)

- Generic local code review -> `robustness.md`
- Backwards compatibility / change safety -> `stability.md`
- Security audit -> `security.md`
- Performance review -> `performance.md`
- Docs review -> `docs.md`
- Automated test review -> `automatic-testing.md`

## Review Types

- `robustness.md` - correctness, failure handling, maintainability, coupling,
  developer experience, and overall implementation quality
- `stability.md` - backwards compatibility, contract drift, migrations,
  rollout safety, and user-visible behavior changes
- `security.md` - trust boundaries, auth, input handling, secret exposure, and
  exploitability
- `performance.md` - latency, throughput, memory, concurrency, unnecessary
  work, and hot-path regressions
- `docs.md` - incorrect, missing, stale, or incomplete documentation and
  upgrade guidance
- `automatic-testing.md` - broken tests, weak tests, and missing automated
  coverage for changed behavior

## Reviewer Posture

- Be professionally adversarial. Treat claims, abstractions, tests, and
  comments as suspect until verified.
- Prefer concrete breakage, missing evidence, and incorrect assumptions over
  style feedback.
- Distinguish observed evidence from inference. Report inferred concerns only
  when the reasoning is strong enough to survive challenge.
- Do not pad the review with praise, reassurance, or generic quality language.
- If there are no findings, say so explicitly under `## Findings`.

**Announce at start:** "I'm using the review skill to perform a
`<review-type>` review."

**Save reviews to:**
`<repository-root>/reviews/YYYY-MM-DD_HH:MM_<review-type>_<review-name>.md`

Create `reviews/` if it does not exist when writing an artifact.

## Review Structure

```markdown
# Review: <Review Name>

## Review Type
<robustness | stability | security | performance | docs | automatic-testing>

## Scope
<Standalone description of what was reviewed. Include commits, plans, files,
commands, constraints, and assumptions when they materially affect the review.>

## Findings
### <High|Medium|Low>: <Short issue title>
**Category:** <specific category within the review type>
**Impact:** <why this matters>
**Location:** `path/to/file.ts:42`, `path/to/other.ts:10`
**Evidence:** <Observed|Inferred>. <brief proof: code path, command result,
log, failing test, type error, missing assertion, docs drift, etc.>
**Suggested Fix:** <concrete repair or next step; use `None` if no responsible
fix is clear yet>
```

## Review Rules

- Formal review artifacts MUST be standalone; do not rely on the prior chat.
- For informal chat reviews, keep the same evidence standard and severity
  ordering, but do not write a file unless durable context is warranted.
- `## Scope` MUST restate the exact review target and any constraints needed to
  understand the findings.
- Order findings by severity: `High`, then `Medium`, then `Low`.
- Every finding MUST include `Category`, `Impact`, `Location`, `Evidence`, and
  `Suggested Fix`.
- `Evidence` MUST explicitly say `Observed` or `Inferred`.
- Use exact file paths and line numbers when the location is known.
- Do not invent evidence. If a suspicion is weak, drop it.
- Use only the sections shown in `## Review Structure`.
- If no findings remain after review, write `No findings.` under `## Findings`.

## Examples

- "Review this change for robustness."
- "Review commit `abc123` for stability."
- "Audit these auth changes for security."
- "Review the docs changes in `docs/`."
- "Review the automated tests for this feature."
