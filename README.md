# Skills

## Maturity

- principles: solid
- zod-v4: solid
- effect-handbook: solid

- discovery: wip
- review: wip
- plan: wip

- create-skill: prototype
- learning: prototype
- log: prototype
- workflow-build: prototype

## Architecture

Use hierarchy for multi-step agent work. Keep it small.

Hierarchy buys ownership, not more agents:

- one layer chooses what runs next
- one layer reconciles work into a decision
- workers do one bounded job
- reference material is loaded by path or skill name, not copied around

```text
router  chooses the workflow shape and sequences judges
judge   owns scope, delegation, synthesis, decisions, and artifacts
worker  owns one bounded task or lens
refs    provide doctrine, examples, templates, and local context
```

Do not add a layer unless it removes ambiguity.

The parent agent can collapse layers. Small task: router, judge, and worker
all in one. Large review: parent acts as judge and spawns workers. Long
lifecycle: a human or script routes between judges.

## Gates And Guidance

Gates are binary. Guidance is interrogative.

A gate checks whether an artifact exists, a status is true, or a quality bar
passed. Guidance gives questions to reason through. The agent owns how to
satisfy the gate.

Use gates for things that must not be skipped:

- required artifacts
- required evidence
- status transitions
- unresolved blockers
- quality bars

Use guidance for judgment:

- what risks to inspect
- what context to load
- which tools to run
- how much depth the task needs
- whether a step is relevant

Do not dress guidance up as gates. Do not let gates drift into vibes.

## Router

The router chooses the next judge. It does not synthesize findings.

Examples:

- run `plan`, then `workflow-build`, then `review`
- run only `review` for a prepared diff
- run one formal review now, then stop

A router can be a human, a shell command, a CI step, or an agent. Most repo
work does not need an autonomous router.

Use status codes only between lifecycle phases, where the next step depends on
the result:

```text
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

Do not force status codes into every worker. Inside one judge, a template or a
structured findings list is usually the better API.

## Judge

The judge turns raw work into one decision.

The judge owns:

- scope
- worker selection
- worker prompts
- aggregation
- deduplication
- severity normalization
- final wording
- artifact writing

The judge may do the work directly when the scope is small, the context is
already loaded, or only one worker type is needed.

The judge must not silently discard worker output. Every material item gets
one of these dispositions:

- finding or fix now
- duplicate
- out of scope
- rejected with evidence
- executable follow-up
- waiver with rationale
- blocked

Worker disagreement is signal. Resolve it, do not average it away.

Good synthesis records:

- agreements: high-confidence conclusions
- divergences: conflicts to investigate or explain
- blind spots: what one worker saw that another missed

Every deferred item needs an executable handle: a roadmap entry, an issue, a
named handoff, or another concrete owner and trigger. "Logged for later" is
not a disposition.

## Worker

A worker owns one bounded task.

Rules:

- read the files named in the prompt
- stay inside the assigned scope
- do not spawn other workers
- do not widen the scope
- do not write the final artifact
- return output in the requested shape

Review workers are adversarial. Start from the hypothesis that the artifact
has defects. Report only issues with evidence.

Fresh context helps adversarial review because it avoids accumulated goodwill.
Use it when independence matters. Skip it when the setup cost exceeds the
benefit.

Before inspecting details, a worker should state its counterfactual standard
for the role:

- coder: the minimal correct implementation
- reviewer: the minimal implementation that would satisfy the claim
- test reviewer: the minimal test set that would catch the likely regression
- QA worker: the minimal observable proof that the user succeeds
- docs worker: the document a confused reader needs to succeed

Then compare the artifact against that standard. Deviations have to justify
themselves.

## Verification

Verification is a ladder. Use the cheapest credible evidence first:

```text
deterministic validators -> tests -> live behavior -> adversarial review -> IV&V
```

Deterministic validators include typecheck, lint, schema checks, and hooks.
Fast and exact inside their domain.

Tests are evidence for what they assert, not proof that the user succeeds.
For behavior with real seams, prefer live checks that exercise the actual
path.

Adversarial review starts from a negative prior and tries to falsify the
claim. IV&V adds an independent second view when the risk justifies the cost.

IV&V rules:

- form your own view first
- ask non-leading questions
- expose the artifact, context, paths, and constraints
- withhold your findings, preferred answer, and candidate verdict
- use one IV&V channel per artifact per gate
- rerun only for a new artifact, new evidence, or a narrowed divergence

Divergence is signal. Investigate it, or state why it does not change the
decision.

## Reference Loading

Two loading mechanisms.

External skills use semantic names:

```text
skill: principles
skill: effect-handbook
skill: zod-v4
```

Files inside the active skill use paths relative to that skill directory:

```text
./by-type/security.md
./shared.md
./review-template.md
```

Do not inline local reference files into worker prompts by default. Give
workers the paths. Prompts stay smaller and references evolve without
rewriting every orchestrator.

Inline only when the worker cannot read files.

## Local Skill Layout

Use a small root skill plus co-located references.

Example:

```text
skills/review/
  SKILL.md                  judge workflow
  shared.md                 shared protocol
  review-template.md        output contract
  by-type/
    automatic-testing.md    worker brief
    robustness.md           worker brief
    security.md             worker brief
```

The root skill says how to route, delegate, aggregate, and write the artifact.

Worker briefs say what the worker owns:

- required skills
- required local references
- review scope
- out of scope
- workflow
- category hints

Reference files provide threat lists, examples, templates, or doctrine that
would make a worker brief too large.

## Worker Prompt Contract

A judge prompt to a worker should include:

- role or review type
- local files to read by path
- external skills to read by semantic name
- exact scope
- relevant constraints
- output shape

Example:

```text
You are the security review worker.

Read:
- skill: principles
- ./by-type/security.md
- ./shared.md
- ./review-template.md

Scope:
- review the current diff
- focus on changed API routes and config

Return findings using ./review-template.md.
Do not widen scope or write the final artifact.
```

## Artifacts

The judge writes the artifact. Workers produce raw material.

Artifacts should be readable later without the conversation:

- scope
- assumptions
- commands or evidence used
- findings
- blocked areas
- follow-ups

For formal review, write the file by default. Skip the file only when the
user asks for an informal or ad-hoc review.

## When To Delegate

Delegate when at least one is true:

- multiple independent lenses apply
- the work parallelizes naturally
- fresh context improves review quality
- output would pollute the parent context
- the worker role benefits from a narrow prompt
- the parent needs a bounded investigation while it continues other work

Do not delegate when:

- the task is small
- one lens is enough
- all context is already loaded
- the next step is blocked on the result
- the setup cost is larger than the work

Default to direct execution. Add workers when they buy clarity or
independence.

## Review Pattern

The review skill is a judge.

It selects review types, determines scope, optionally spawns workers,
aggregates findings, normalizes severity, and writes the review artifact.

Review type files are worker briefs. They do not know about orchestration,
do not write artifacts, and do not duplicate principles.

Good review type workflow:

```text
1. Build the map this worker needs.
2. Inspect the weakest paths first.
3. Falsify the claim or signal.
4. Keep only concrete issues.
5. Return findings in the shared template.
```

Examples:

- automatic testing builds a behavior-to-signal map
- robustness builds a claim-to-code map
- security maps attacker control to assets, trust boundaries, and sinks

## Design Rules

- Prefer one judge with clear worker briefs over peer agents that coordinate.
- Keep worker output narrow. Let the judge synthesize.
- Keep principles in principle skills. Keep domain catalogs in local references.
- Use local paths for local docs. Use semantic names for external skills.
- Write artifacts at the judge layer.
- Treat templates as APIs.
- Make the base case direct execution, not delegation.
- Remove ceremony that does not change the result.
