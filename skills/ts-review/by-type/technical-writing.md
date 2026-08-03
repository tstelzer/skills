# Review Technical Writing

Review whether technical content lets its reader complete the intended task correctly and safely.

## Review Target

The smallest correct document that lets its reader complete the relevant task safely.

## Required Skills

### technical writing

Read:
- `ts-technical-writing/SKILL.md`
- every linked local detail document

### principles

Read details for:
- `integrated documentation`
- `evolve contracts deliberately`
- `keep boundaries sharp`

## Review Scope

- Documentation affected by changed behavior, contracts, commands, config, APIs,
  operations, or workflows.
- README files, docs pages, inline docs, generated docs, comments, examples,
  migration notes, upgrade notes, and troubleshooting docs.
- Plans, designs, handoffs, prompts, and workflow artifacts that a reader must
  act on.
- Public API reference, CLI help, OpenAPI, generated schema docs, config docs,
  and exported type docs.
- Setup, upgrade, deployment, rollback, debugging, and operations instructions.
- Stale docs that should be deleted, archived, or linked elsewhere.
- Docs missing from the location where the reader will look.
- Prose, structure, examples, lists, headings, and llm-isms when they can
  mislead, slow, or block a real reader.

## Out Of Scope

- Prose taste that does not affect the reader's ability to act.
- Formatting nits unless they change meaning or make instructions unsafe.
- Broad doc architecture cleanup unrelated to the reviewed change.
- Test coverage quality except executable examples or doctest-style checks.
- Product copy or marketing polish unless it states technical behavior.

## Direct Edits

Edit writing directly when the source makes the correct wording clear and the change requires no product,
architecture, security, or implementation decision.

Allowed direct edits:

- documentation, plans, designs, prompts, workflow artifacts, comments, examples, and instructions readers must follow
- prose, headings, lists, stale wording, duplicated text, missing local context, and llm-isms
- incorrect commands, snippets, or claims when the implementation or source request makes the repair clear

Do not directly edit:

- code behavior, tests, migrations, schemas, generated files, dependency files, or configuration
- workflow log routing state, finding dispositions, or status lines owned by the router or judge
- plan or design decisions that require a product, security, implementation, or architecture choice

If a direct edit fully resolves the issue, report it under `## Direct Edits` and do not file an open finding. If risk or
decision work remains, leave the file unchanged for that point and return a finding.

## Workflow

1. List the readers, the tasks they need to complete, and the docs they use.
2. Identify changed behavior, changed contracts, changed commands, and changed
   operational steps.
3. Find the docs a reader would use for those tasks.
4. Compare each relevant doc claim, command, sample, config snippet, and API
   description against the implementation.
5. Check missing docs for new behavior, breaking changes, migrations,
   operations, deprecations, or sharp edges.
6. Check whether examples are still valid and safe to run.
7. Check whether duplicated docs drift from the source of truth.
8. Check whether structure, headings, bullets, and prose match the reader's job.
9. Check for llm-isms that hide constraints, overclaim, or add empty ceremony.
10. Check the action prevented by each negative instruction. Delete the instruction when the code, source requirements,
    and artifact give the reader no reason to take that action.
11. Keep only issues that can mislead, block, slow, or harm a real reader.
12. Apply direct writing edits allowed by this brief.
13. Return direct edits and remaining findings in the shared review template.

## Severity Hints

These are anchors. Use judgment when a case sits between levels.

- `critical`: a command, config snippet, or upgrade step in published docs would break a real reader who follows it.
- `high`: incorrect or missing instructions for changed behavior; an example no longer compiles or runs.
- `low`: prose, structure, or stale content that slows a reader without changing the technical outcome.

## Category Hints

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
