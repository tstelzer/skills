---
name: ts-technical-writing
description: Technical writing reference for docs, plans, reviews, prompts, and user-facing artifacts.
---

# Technical Writing

## How to use

- Always read this file first.
- Treat the bullets below as the canonical short form.
- Read the local detail docs that match the artifact.
- For software documentation, also read `skill: ts-principles`, especially `integrated documentation`.

## Principles

### write for a reader doing a job

- Name the reader before writing.
- Name what the reader wants to do, decide, fix, or understand.
- Include only what helps that reader complete the job.
- State assumed knowledge, prerequisites, and non-scope when they prevent wrong expectations.

[Details](audience.md)

### choose the artifact shape before writing

- Tutorial: teach by doing.
- How-to: complete one task.
- Reference: describe facts, contracts, parameters, commands, fields, and errors.
- Explanation: explain context, reasons, tradeoffs, and design.
- Do not mix shapes by accident.

[Details](artifact-shape.md)

### put the answer first

- Start with the action, decision, result, or summary.
- Put background after the thing the reader came for.
- Use headings that say what is inside the section.
- Use the first paragraph as the fastest useful path through the artifact.

[Details](structure.md)

### write plain, compact prose

- Use common words when they carry the same meaning.
- Prefer active voice.
- Prefer strong verbs over noun phrases.
- Cut filler, hedges, throat-clearing, and repeated setup.
- Keep one idea per paragraph.

[Details](prose.md)

### prefer examples over abstractions

- Show the command, code, config, input, output, error, or decision.
- Make copyable examples correct.
- Put examples near the rule they prove.
- Use realistic values, not fake secret-shaped strings.

[Details](examples.md)

### make content scannable

- Use bullets for sets of peers.
- Use numbered lists for ordered steps.
- Use tables for structured comparison.
- Keep list items parallel.
- Start procedure steps with imperative verbs.

[Details](structure.md)

### remove llm-isms

- Remove generic hype, fake helpfulness, and empty transition phrases.
- Do not say a task is simple, easy, seamless, powerful, robust, or crucial unless the claim is concrete and proven.
- Do not explain that you are explaining.
- Do not end with boilerplate invitations when the answer is done.

[Details](llm-isms.md)

### treat docs as contracts

- Keep docs next to the surface readers use.
- Document why, constraints, invariants, failure modes, and contracts.
- Do not repeat what names, types, schemas, and tests already say.
- Update docs with behavior.
- Delete stale docs.

[Details](maintenance.md)

## Source Material

This skill distills:

- Diataxis: https://diataxis.fr/
- Google Technical Writing One: https://developers.google.com/tech-writing/one
- Google Developer Documentation Style Guide: https://developers.google.com/style
- Microsoft Writing Style Guide: https://learn.microsoft.com/en-us/style-guide/welcome/
- Digital.gov Plain Language Guide: https://digital.gov/guides/plain-language
- Nielsen Norman Group, How Users Read on the Web: https://www.nngroup.com/articles/how-users-read-on-the-web/
- Write the Docs, Style Guides: https://www.writethedocs.org/guide/writing/style-guides/
