---
name: ts-qa
description: Prepare a manual smoke test plan for implemented changes. Only explicitly triggered by user.
---

# QA

## Role

QA is a judge. It chooses test scope and writes a manual test plan in `docs/qa/`.

Do the work directly. Do not spawn workers.
Use read-only repo inspection to understand the change. Leave test execution to the reader.
Do not run app code, tests, builds, linters, browsers, dev servers, jobs, migrations, scripts, or API calls.

## Required Reading

- skill: ts-simple
  - Read and apply this skill whenever QA runs. Use it for the test plan and replies.
- skill: ts-principles
  - Read `ts-principles/SKILL.md` and every linked principle detail document.

## Workflow

1. FIND_CHANGE
2. CHOOSE_SMOKE_TESTS
3. WRITE_PLAN
4. CHECK_PLAN

### FIND_CHANGE

- Find the implemented change from the user's request, commit range, PR, branch, plan, files, or working tree.
- With no supplied scope, use working tree changes. If the working tree is clean, use the latest commit.
- If no implementation can be found, ask for scope. Do not write a generic checklist.
- Read the relevant diffs, source files, tests, docs, and local guidance.
- Use read-only commands such as `git status`, `git diff`, `git show`, `git log`, `rg`, and file reads.
- Find where users reach the changed behavior and what setup they need.
- Check the repo before recording unknowns. Do not invent routes, roles, flags, account states, or UI text.

### CHOOSE_SMOKE_TESTS

- By default, choose only the highest-risk cases. Aim for 1–3 short tests.
- Rank cases by how likely the change is to break them and how much harm a failure would cause.
  Examples: lost data, wrong payments, access to another user's data, or a blocked main workflow.
- Use the smallest set of tests that checks those risks. Put the highest-risk case first.
- Do not require a test for every change, touched file, workflow, or edge case.
- Add broader coverage only when the user asks for it.
- For internal changes, test the closest result a user or operator can see.

### WRITE_PLAN

- Write one complete plan to `<repository-root>/docs/qa/YYYY-MM-DD_HH:MM_<qa-name>.md`.
- Create `docs/qa/` if needed. When revising, rewrite the whole plan.
- State what changed and which risks the smoke test checks. Keep this brief.
- For each case, give the risk, where to test, setup, exact actions, and expected result.
- Use results a person can see and confirm. Keep exact UI labels, routes, commands, API names, and domain terms.
- State unknown setup needs and limits that affect the selected tests.
- Leave out code details the tester does not need.
- Write a plan for tests still to be run. Do not claim tests passed or the change shipped.

### CHECK_PLAN

- The plan stands alone without the chat.
- The default plan contains only the selected smoke tests. Any broader coverage was requested by the user.
- Each case names a concrete risk and includes where, setup, steps, and an expected result.
- Unknown setup needs are clear.
- No test results or notes about this skill appear.
- The prose follows `skill: ts-simple`.

## Manual Test Plan Template

```markdown
# Manual tests: <Feature name>

## Scope

- Source: <working tree, commit range, PR, plan, or files>
- Changed: <brief description of the implemented change>
- Coverage: <selected risks; smoke test by default>

## Setup

<Setup shared by the tests. Skip this section if none.>

## Tests

### 1. <Scenario>

Risk: <what could fail and why it matters>
Where: <screen, route, command, API, or workflow>
Setup: <data, account, flag, permission, or None>

Steps:

1. <manual action>
2. <manual action>

Expected: <result a person can confirm>

## Limits

<Unknown setup or limits that affect these tests. Skip this section if none.>
```
