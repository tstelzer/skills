# Review Technical Writing

Check whether readers can use the docs to complete their task correctly and safely.

## Review target

Look for the shortest correct document that helps the reader do their task safely.

## Required skills

From skill: ts-technical-writing, read `ts-technical-writing/SKILL.md` and every detail document it links to.

Read these detail pages from skill: ts-principles:

- `integrated documentation`
- `evolve contracts deliberately`
- `keep boundaries sharp`

## What to check

- Docs affected by changes to behavior, interface promises, commands, settings, APIs, or ways of running the system.
- README files, docs pages, comments, generated docs, examples, upgrade and migration notes, and help for fixing
  problems.
- Plans, designs, handoffs, prompts, and workflow documents that a reader must act on.
- Public API reference, command-line help, OpenAPI, generated schema docs, settings docs, and docs for exported types.
- Instructions for setup, upgrades, deployment, returning to a previous version, debugging, and daily operation.
- Old docs that should be deleted, archived, or linked from a better place.
- Missing docs where the reader would expect to find them.
- Wording, structure, examples, lists, and headings that could mislead or slow the reader. Include empty or inflated
  wording that hides useful information.

## Outside this review

- Personal style choices that do not affect the reader's task.
- Small formatting issues unless they change meaning or make instructions unsafe.
- Reorganizing docs beyond what the reviewed change needs.
- General test quality, except tests that run examples from the docs.
- Product or marketing copy, unless it describes technical behavior.

## Direct edits

Edit writing when the source makes the correction clear and no product, architecture, security, or code decision
is needed.

You may edit:

- docs, prompts, workflow documents, comments, examples, and instructions
- wording, headings, lists, outdated or repeated text, missing background, and empty or inflated language
- wrong commands, code examples, or claims when the code or user's request makes the correction clear

Do not edit:

- code behavior, tests, migrations, schemas, generated files, dependency files, or settings
- the workflow's choice of next step, decisions on findings, or status lines owned by the router or judge
- plans or designs; use skill: ts-plan or skill: ts-design-document for those changes

If your edit fixes the whole problem, report it under `## Direct Edits`. Do not also report it as an open finding.
If a risk or decision remains, leave that part unchanged and return a finding.

## Steps

1. List the readers, what they need to do, and the docs they use.
2. List changes to behavior, interface promises, commands, and steps for running the system.
3. Find the docs a reader would use for those tasks.
4. Compare descriptions of current behavior with the code. Check plans and designs against the agreed requirements.
5. Look for missing docs about new behavior, changes that break old usage, migrations, daily operation, features
   being phased out, or mistakes the reader needs to avoid.
6. Check that examples still work and are safe to run.
7. Check whether copied docs disagree with the source they describe.
8. Check whether headings, lists, and explanations help the reader do their task.
9. Look for wording that hides limits, claims too much, or adds steps that serve no purpose.
10. For each instruction that forbids an action, ask what it stops. Remove it when the code, requirements, and
    document give the reader no reason to take that action.
11. Keep only problems that could mislead, block, slow, or harm a reader.
12. Make the writing edits allowed above.
13. Return your edits and remaining findings using [review-template.md](../review-template.md).

## Severity examples

Use these examples to help judge how serious the actual problem is.

- `critical`: a published command, settings example, or upgrade step would break the reader's system if followed.
- `high`: wrong or missing instructions for changed behavior, or an example that no longer compiles or runs.
- `low`: wording, structure, or outdated text that slows the reader without changing the technical result.

## Category examples

- `incorrect-content`
- `missing-docs`
- `audience`
- `instructions`
- `prose`
- `structure`
- `api-reference`
- `examples`
- `commands`
- `config-docs`
- `upgrade-guidance`
- `migration-guidance`
- `operations-docs`
- `troubleshooting`
- `deprecation`
- `duplicate-source`
- `stale-content`
- `generated-docs`
