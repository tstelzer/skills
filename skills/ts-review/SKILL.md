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
  - Before ruling on findings, read `ts-technical-writing/SKILL.md`, `ts-technical-writing/audience.md`,
    `ts-technical-writing/prose.md`, and `ts-technical-writing/structure.md`.
  - For `technical-writing` reviews, read every linked technical-writing detail document before reviewing.

## Role

Review is a judge.

It sets scope, assigns workers, reads context, rules on findings, sets final severity, and writes artifacts.
Workers try to find defects and report them. The judge challenges both the reviewed work and the workers' claims.
Investigate missing or conflicting evidence. Do not repeat inspection that was sound.

## Authority And Evidence

The caller may name a request, plan, design, decision, or scope as the requirements to review against.
Apply principles within those requirements. Do not use them to add product or architecture work.

Prior reviews and handoffs do not prove the current work is correct. Revisit accepted decisions when current evidence
shows their assumptions no longer hold.

The judge uses skill: ts-project-context to load and maintain shared context.
Keep the record and prior rulings with the judge. Do not pass them to workers.

## Sub-Agent Selection

Choose sub-agent workers as follows.

- Choose the first available entry for the worker role.
- If the agent tool cannot set provider, model line, and reasoning separately, choose the closest available model.
  Record what actually ran.
- Do not spawn two workers of the same review type on the same provider and
  model line. Two releases of `sol` are one model class, not two.

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

1. DETERMINE_TYPE
2. DETERMINE_SCOPE
3. SPAWN_REVIEW_WORKERS
4. ADJUDICATE_FINDINGS
5. WRITE_ARTIFACT

### DETERMINE_TYPE

- Choose the most useful review types from the user's request and your judgment.
- Available review types:
    - `automatic-testing` - broken tests, weak tests, and missing automated coverage for changed behavior
    - `technical-writing` - incorrect, missing, stale, unsafe, or unclear technical writing, examples, docs,
      upgrade guidance, or instructions readers must follow
    - `performance` - latency, throughput, memory, concurrency, unnecessary work, and hot-path regressions
    - `robustness` - correctness, failure handling, maintainability, coupling, developer experience, and overall
      implementation quality
    - `security` - trust boundaries, auth, input handling, secret exposure, and exploitability
    - `stability` - backwards compatibility, changed interface promises, migrations, deployment safety,
      and user-visible behavior changes
- If the user asks for a docs review, select `technical-writing`.
- Unless explicitly requested, include at least:
    - `automatic-testing`
    - `robustness`

### DETERMINE_SCOPE

- Determine review scope based on the user's request: files, commits, docs, plans, designs, etc.

### SPAWN_REVIEW_WORKERS

- Workers own one review type only.
- Workers must not spawn other workers, widen scope, or combine findings from other workers.
- Workers must not write files unless the review type file explicitly allows direct edits.
- `technical-writing` is the only review type that may directly edit files.
- When direct edits are enabled for `technical-writing`, dispatch only one worker for that review type. The worker owns
  the writing pass.
- When the judge performs a `technical-writing` review directly, the judge may make the same direct edits.
- Only when the user explicitly requests exactly one review type may the judge perform that review directly.
- Otherwise, including the default review type set, spawn two sub-agent workers for each selected review type when
  model availability permits. Use different model classes for the two workers so the judge gets independent
  perspectives. If only one model class is available, spawn one worker for that review type. The `technical-writing`
  direct-edit rule takes priority over this worker-count rule.
- Choose workers from the `Review Worker` list in `Sub-Agent Selection`.
- A model class is one provider and model-line pair from the priority list.
- Workers report findings and direct-edit notes to the judge.
- Each reviewer prompt must include:
    - The review type.
    - The worker's assigned provider, model line, and reasoning level.
    - The local review files the worker must read by path, relative to this skill directory:
        - `./by-type/<type>.md`, e.g. [technical-writing.md](./by-type/technical-writing.md)
        - [shared.md](./shared.md)
        - [review-template.md](./review-template.md)
        - Any review-local files referenced by the review type file.
    - For `technical-writing`, the required semantic skill `skill: ts-technical-writing`, including every linked
      local detail document.
    - The rule that findings must follow the [review-template.md](./review-template.md) structure and be returned
      inline in chat, never written as a file.
    - For `technical-writing`, the direct-edit policy from [technical-writing.md](./by-type/technical-writing.md).
      Direct edits must be reported inline with changed paths and a short purpose.
    - For every other review type, the rule that the worker is read-only and must not write files.
    - Base findings on the assigned inspection. State what must be true for the failure to occur.
      Separate evidence from assumptions. Leave rulings to the judge; do not read `docs/project-context.md`
      or prior rulings.
    - The rule that if a required tool (read, grep, test runner, etc.) fails after the obvious fix, the worker returns
      the failure to the judge as a tooling-escalation note. Workers must not silently weaken findings.
    - What to review, its scope, the requirements it must meet, and inputs needed for inspection.
- Use semantic skill names only for external skills, e.g. `skill: ts-principles`.

### ADJUDICATE_FINDINGS

- Rule on every finding using [review-template](./review-template.md), including findings from a direct judge review.
- Check how the failure occurs, whether its conditions apply, what happens, and which requirement or accepted risk
  matters. Use current evidence and recorded context. Missing context proves neither safety nor a defect.
- Inspect available evidence first. Ask the user a concrete question when an unclear fact, requirement, assumption,
  or accepted risk could change the ruling or severity. Continue independent work while awaiting the answer;
  wait for the answer before making the affected ruling. Save answers useful to later tasks in project context.
- Preserve every worker finding and its source, proposed severity, evidence, and conclusion. Clarify wording without
  changing the claim. Put corrections and disagreements in the ruling; never delete a finding to express rejection.
- Rule `upheld`, `rejected`, `deferred`, `resolved`, or `duplicate`. Explain each ruling with evidence and context;
  name missing information for deferrals and the retained finding ID for duplicates. Preserve direct-edit reports.
- Set final severity for upheld findings from what happens when the relevant conditions apply.
  Explain changes from the proposed severity. Severity hints guide judgment; they do not automatically block a change.
- Assign each finding a document-wide ID: `F001`, `F002`, and so on. Preserve prior IDs in follow-up reviews and give
  new findings the next unused ID. Keep duplicates visible with their own IDs and source attribution.
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
- Base the result on rulings and final severity. State unresolved decisions. A review with deferred findings is not
  clean. Include the context behind rulings so the artifact stands alone.
- In `## Reviewer Metadata`, record the judge line and one worker line per worker as provider, model line, and
  reasoning level.
- Use `Workers: none (judge direct)` only when the judge performed the only requested review type directly.
