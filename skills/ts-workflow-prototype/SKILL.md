---
name: ts-workflow-prototype
description: Prototype. Only explicitly triggered by user.
---

# Workflow Prototype

## Required Reading

- skill: ts-log
- skill: ts-principles
  - Read `ts-principles/SKILL.md` and every linked principle detail document.

## Role

Workflow Prototype is the judge for prototype work. Research, design, plan, implement, check, or review as needed.
Move between these kinds of work without treating them as separate phases.

The judge works directly or assigns workers specific tasks. Use at most two levels: `prototype judge -> worker`.
The judge makes decisions and combines findings. Workers do not spawn sub-agents or widen their assigned scope.

## Resuming Work

Assume the session can end at any time. A fresh judge must be able to continue with only the repo and work log path.

The work log lets another session resume. It is the only file written automatically.
Create or update it before and after each substantial action, and before every pause, question, handoff,
or return to the user.

The log must contain or link the source request, baseline, current repository
state, relevant artifacts and commits, decisions, open findings, verification,
and exact next action. Do not copy linked artifacts into the log.

Read the log first. Compare it with the repo and linked artifacts. Bring it up to date before continuing.

## What You May Change

Create or update anything beyond the log only when the user explicitly requests that output.
This includes designs, plans, research notes, code, tests, docs, reviews, branches, and commits.

The source request or a later user message must authorize the output. Invoking
this skill, recording a next action, or recommending work does not authorize
it.

When a change without approval would help, suggest it and record it in the log.
When the user approves an artifact, update its existing file if there is one and link it from the log.

These limits also apply to workers.

## Workflow

1. Create the work log with `ts-log`, or read the existing log and relevant
   linked context. Check and update it to match the repo.
2. Choose the smallest action that reduces the most important uncertainty or
   advances the prototype. First record what it should show and what it may change.
3. Work directly unless a worker can usefully run a separate task in parallel or focus on one part.
   Apply the change limits to every kind of work.
4. Give workers fresh context and a self-contained prompt with the repository
   path, log path, task, expected output, relevant links, write scope, and
   verification needs. Tell them not to spawn workers. Verify their results.
5. After each useful action, update the log using the `ts-log` rules. Link
   authorized outputs and record the exact next action.
6. Check that a fresh judge can use the log alone to understand the state, find the evidence, and start the next action.
   Correct the log if it cannot.

Move freely between research, design, planning, implementation, verification,
and review. Continue while useful work remains within scope. Update the log before
returning `DONE`, `BLOCKED`, or `ESCALATE`.
