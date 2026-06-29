---
name: ts-qa
description: Prepare changelog and manual QA artifacts from implemented changes. Only explicitly triggered by user.
---

# QA

## Required Reading

- skill: ts-principles
  - Read `ts-principles/SKILL.md`.
  - Read every linked principle detail document before preparing QA.

## Role

QA is a judge.

It owns scope, context loading, surface selection, changelog writing, QA design,
and artifact writing. It turns an implementation into two compact artifacts:

- `docs/changelog/`: the user-facing changeset
- `docs/qa/`: the manual QA walkthrough for that changeset

Do the work directly. Do not spawn workers; these artifacts need one coherent
product view.

Do not test the product yourself. Do not run app code, tests, browsers, dev
servers, jobs, migrations, scripts, or API calls that exercise behavior. Use
read-only repo inspection to understand the implementation.

## Workflow

1. DETERMINE_SCOPE
2. LOAD_IMPLEMENTATION
3. FIND_USER_SURFACES
4. DRAFT_CHANGELOG
5. DESIGN_MANUAL_QA
6. CHECK_GATES
7. WRITE_ARTIFACTS

### DETERMINE_SCOPE

- Determine the implemented change from the user's request, commit range, PR,
  branch, plan, handoff, files, or working tree.
- If no scope is supplied, use current working tree changes.
- If the working tree is clean and no scope is supplied, use the latest commit.
- If no implementation can be identified, stop and ask for scope. Do not write a
  generic checklist.
- Name the repository root and paired artifact paths:
  - changelog: `<repository-root>/docs/changelog/YYYY-MM-DD_HH:MM_<qa-name>.md`
  - QA: `<repository-root>/docs/qa/YYYY-MM-DD_HH:MM_<qa-name>.md`
- Use the same timestamp and `<qa-name>` for both files.
- Create `docs/changelog/` and `docs/qa/` if they do not exist.

### LOAD_IMPLEMENTATION

- Read the relevant diffs, source files, tests, docs, routes, schemas, and local
  guidance.
- Use read-only commands such as `git status`, `git diff`, `git show`,
  `git log`, `rg`, `fd`, and file reads.
- Do not run project commands that execute product behavior, automated tests,
  builds, linters, dev servers, migrations, scripts, background jobs, browsers,
  or network calls.
- Identify changed behavior, affected entry points, data prerequisites, feature
  flags, permissions, roles, devices, and external dependencies when visible in
  the repo.
- Record unknowns only after repo context cannot answer them. Do not invent
  routes, roles, flags, account states, or expected copy.

### FIND_USER_SURFACES

- Describe the changeset from the user's perspective, not from the file list.
- Assign stable change IDs: `C1`, `C2`, `C3`.
- Prefer concrete product language:
  - Good: `Checkout shows tax before payment confirmation.`
  - Bad: `Refactored checkout total calculation.`
- Map each change to the surface a human can use:
  - screen, route, modal, form, notification, email, report, API, CLI command,
    import/export, admin task, scheduled outcome, or documented workflow
- For internal-only changes, name the nearest user-observable behavior and the
  reason it is the right test surface.
- Separate direct changes from nearby regression surfaces. Do not turn every
  touched file into a test area.

### DRAFT_CHANGELOG

- Write a compact changelog artifact for a human who needs to understand what
  changed.
- Include only user-facing behavior, operator-visible behavior, API behavior,
  CLI behavior, documentation changes, or workflow outcomes.
- Put implementation notes only when they explain a visible behavior boundary
  or a manual QA prerequisite.
- Link to the companion QA artifact by relative path.
- Do not claim the change shipped, passed QA, or reached production.

### DESIGN_MANUAL_QA

- Write a compact walkthrough for a skilled engineer.
- Link to the companion changelog artifact by relative path.
- Order tests by user workflow, then by risk.
- Cover the changed behavior first, then one or two high-risk regressions.
- Prefer 3-7 test cases for a normal change. Add more only when the
  implementation changes distinct user workflows.
- Each test case must include:
  - priority: `P0` for must-run changed behavior, `P1` for likely regression,
    `P2` for optional edge coverage
  - surface: the screen, route, command, API, or workflow under test
  - setup: account state, data, flags, permissions, environment, or `None`
  - steps: exact manual actions
  - expected result: observable result a human can confirm
  - covers: the changeset item or risk the test proves
- Avoid broad smoke tests, full regression suites, and implementation details.
- Do not claim anything passed. The artifact is a plan for manual QA, not a test
  report.

### CHECK_GATES

Before writing the artifacts, verify:

- The changelog and QA artifacts stand alone without prior chat.
- The changelog is written from a user perspective.
- The changelog links to the QA artifact, and the QA artifact links to the
  changelog artifact.
- Every direct user-facing change has at least one `P0` test.
- Every test has surface, setup, steps, expected result, and covers.
- Every `Covers` value references a changelog item ID or named regression risk.
- Unknown prerequisites are explicit.
- No test result, pass/fail claim, or executed command output appears.
- The test list is compact and scoped to the implementation.
- The artifacts have no meta notes about this skill or the authoring process.

### WRITE_ARTIFACTS

- Write the final changelog artifact to
  `<repository-root>/docs/changelog/YYYY-MM-DD_HH:MM_<qa-name>.md`.
- Write the final QA artifact to
  `<repository-root>/docs/qa/YYYY-MM-DD_HH:MM_<qa-name>.md`.
- When revising artifacts, rewrite both complete artifacts. Do not write deltas
  from previous drafts.

## Changelog Artifact Template

```markdown
# Changelog: <Feature Name>

## Scope
- Source: <working tree, commit range, PR, plan, or files>
- Generated: <YYYY-MM-DD HH:MM>
- Product area: <area>
- QA: [Manual QA](../qa/YYYY-MM-DD_HH:MM_<qa-name>.md)

## Changes
- C1: <user-facing change>
- C2: <user-facing change>

## Notes
- <Visible boundary, prerequisite, or limitation; skip section if none>
```

## QA Artifact Template

```markdown
# QA: <Feature Name>

## Scope
- Source: <working tree, commit range, PR, plan, or files>
- Generated: <YYYY-MM-DD HH:MM>
- Product area: <area>
- Changelog: [User-facing changes](../changelog/YYYY-MM-DD_HH:MM_<qa-name>.md)

## Setup
- <Prerequisite needed by multiple tests; skip section if none>

## Test Cases

### QA-1: <scenario>
Priority: P0
Surface: <screen, route, command, API, or workflow>
Setup: <specific data, account, flag, permission, or None>
Covers: C1

Steps:
1. <manual action>
2. <manual action>

Expected:
- <observable result>

## Not Covered
- <Known gap, unavailable prerequisite, or deferred adjacent regression; skip
  section if none>
```
