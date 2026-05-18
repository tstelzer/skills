---
name: workflow-build
description: Use when a user asks to implement or fix code with a subagent-dispatched implementation-review loop, shared workflow log, bounded retries, and clear stop conditions.
---

# Workflow Build

## Purpose

Run a fixed router workflow:

```text
(judge-implement -> judge-review){1,n}
```

Use this when the user asks to build, implement, fix, or change code and wants a
review loop. This workflow does not create a plan. If the task needs discovery
or planning first, stop with `STATUS: ESCALATE: planning required`.

This skill is the router. It does not edit, review, or verify code itself. It
dispatches judge passes, reads their status and finding dispositions, and routes
the next pass.

## Driver Contract

- Use the `log` skill to create a shared log under `docs/workflows/`.
- Always dispatch work to subagents.
- Send every judge pass the same log path.
- Dispatch only the fixed skills listed in `## Workflow`. Let each judge choose
  additional task-relevant skills.
- Use the fixed model and effort for each judge pass.
- Decide the next step only from pass status and open finding dispositions.
- Treat judge `STATUS: DONE` as "phase completed and log updated," not
  "workflow accepted."
- Default to at most 3 implementation-review passes unless the user gives
  another limit.
- Stop as soon as review has no open `fix now` findings.
- If subagents are unavailable, stop with
  `STATUS: BLOCKED: subagents unavailable`.

## Workflow

1. Create the workflow log with `log`.
2. Dispatch a judge-implement pass.
3. If implementation returns `BLOCKED` or `ESCALATE`, stop and report it.
4. Dispatch a judge-review pass.
5. If review returns `BLOCKED` or `ESCALATE`, stop and report it.
6. If review has no `fix now` findings, stop with `STATUS: DONE`.
7. If review has `fix now` findings and the pass limit is not reached, run
   implementation again with the same log path and the review findings.
8. If the pass limit is reached with open `fix now` findings, stop with
   `STATUS: BLOCKED: review loop limit reached`.

## Judge-Implement Pass

Model: sonnet high

```text
You are the implementation judge. If this is one bounded change, do the
implementation yourself. Dispatch implementation workers only when the work
separates cleanly across files, domains, or independent tasks. Reconcile worker
results when you delegate, decide finding dispositions, update the log, and
return one status.

Workflow log path: <path>.
Use skills: log, principles
Worker model: sonnet high

Task input:
- On pass 1, implement the user's original request.
- On later passes, fix every open `fix now` finding in the workflow log and the
  latest review handoff.

Implementation contract:
- Read the workflow log.
- Identify the requested behavior, affected files, constraints, and existing
  user changes.
- If review findings were supplied, treat every open `fix now` item as in
  scope unless it is impossible or unsafe. Do not drop findings silently.
- Make the smallest scoped change that satisfies the request or fixes the
  supplied findings.
- Follow existing code patterns unless a principle or local rule requires a
  change.
- Keep unrelated cleanup out of scope.
- Add or update tests when the changed behavior needs proof.
- Run the most relevant checks available in this repo.
- If a required check cannot run, record the command, reason, and risk.
- Return `BLOCKED` if missing input, dependencies, or verification prevent a
  responsible handoff.

Judge synthesis:
- If you dispatched workers and any worker returns `BLOCKED` or `ESCALATE`
  without another worker resolving it, return that status.
- Inspect the resulting diff and verification evidence enough to synthesize
  the handoff. Do not redo delegated worker jobs.

Update the log:
- Status.
- Scope changed.
- Verification run and result.
- Open risks, deviations, or unresolved review findings.
- Handoff for review.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

## Judge-Review Pass

Model: opus high

```text
You are the review judge. Review the current diff against the user's request and
the latest implementation handoff in the workflow log. If this needs one review
type, do the review yourself with the review skill. Dispatch review, test, or QA
workers only when the change needs multiple review types, specialist checks, or
parallel independent scopes. Reconcile worker findings when you delegate,
decide dispositions, update the log, and return one status.

Workflow log path: <path>.
Use skills: review, log, principles
Worker model: sonnet high or opus high (depending on complexity)

Let the review skill own review type selection, evidence standards, and review
output shape. This workflow only adds finding dispositions and log handoff.

Judge synthesis:
- If you dispatched workers, reconcile duplicate, conflicting, or stale worker
  findings.
- Do not run a second full review yourself after receiving worker review output.
  Inspect enough evidence to rule on dispositions.

Dispositions:
- Every finding gets exactly one disposition.
- `fix now`: required for correctness bugs, acceptance failures, broken tests,
  unsafe contract changes, security/data-loss risk, or essential missing
  verification.
- `follow-up`: valid issue outside this workflow scope. Provide an executable
  handle.
- `waiver`: accepted risk. State the reason and evidence.
- Do not discard a finding because it is inconvenient, previously known, or
  outside the implementer's narrative.

Update the log:
- Status.
- Review artifact or concise findings.
- Finding table with disposition and owner/next action. Write the table even
  when there are no findings.
- Verification run and result.
- Handoff for the workflow driver.

Return exactly one status line:
STATUS: DONE
STATUS: BLOCKED: <reason>
STATUS: ESCALATE: <reason>
```

## Stop Conditions

Stop the workflow only when one condition is true:

- `STATUS: DONE`: the latest review pass completed and `## Open Findings` has
  no `fix now` findings.
- `STATUS: BLOCKED: <reason>`: required input, dependency, or verification is
  unavailable.
- `STATUS: ESCALATE: <reason>`: a human decision is needed.
