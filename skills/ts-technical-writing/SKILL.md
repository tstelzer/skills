---
name: ts-technical-writing
description: Technical writing reference for docs, plans, reviews, prompts, and user-facing artifacts.
---

# Technical Writing

## How to use

- Always read this file first.
- Use the bullets below as the summary of these rules.
- Read the local detail docs that match what you are writing.
- For software documentation, also read `skill: ts-principles`, especially `integrated documentation`.

## Principles

### write for a reader doing a job

- Name the reader before writing.
- Name what the reader wants to do, decide, fix, or understand. In an error, say what failed and what it acted on.
- Choose detail by the reader's task, not their job title. Technical accuracy alone does not make a fact relevant.
- Include facts that answer the reader's question. In errors, keep cause messages and debugging details safe to show.
- Show only what the reader is allowed to know. Do not expose secrets or restricted internals.
- Give a corrective action only when you know it applies.
- State what the reader must know or have, and what the document excludes, when this prevents wrong expectations.

[Details](audience.md)

### choose the document type before writing

- Tutorial: teach by doing.
- How-to: complete one task.
- Reference: describe facts, contracts, parameters, commands, fields, and errors.
- Explanation: explain context, reasons, tradeoffs, and design.
- Do not mix these types by accident.

[Details](artifact-shape.md)

### put the answer first

- Start with the action, decision, result, or summary.
- Put background after the thing the reader came for.
- Use headings that say what is inside the section.
- Make the first paragraph useful on its own.

[Details](structure.md)

### write plain, concise prose

- Use common words when they carry the same meaning.
- Prefer active voice.
- Say what acts and what it does. Use ordinary words around technical names.
- Aim for a quick read before a low word count.
- Split a sentence when it carries several decisions, causes, or conditions.
- Include an exact technical term when the reader needs to recognize or use it. Preserve its spelling.
- Keep conditions and consequences the reader needs. Cut abstract labels that only repeat the behavior.
- Use the reader's words for workflow steps.
- Define an unfamiliar term on first use when code or context does not make it clear.
- Cut filler, hedges, empty introductions, and repeated setup.
- Keep one idea per paragraph.

[Details](prose.md)

### prefer examples over abstractions

- Show the command, code, config, input, output, error, or decision.
- In errors, show what failed, what it acted on, the cause safe to share, and any known corrective action.
- Make copyable examples correct.
- Put examples near the rule they prove.
- Use realistic values, not fake secret-shaped strings.

[Details](examples.md)

### make content scannable

- Use bullets for items at the same level.
- Use numbered lists for ordered steps.
- Use tables for structured comparison.
- Give list items the same sentence structure.
- Start procedure steps with commands.

[Details](structure.md)

### remove llm-isms

- Cut hype, fake helpfulness, and empty transitions.
- Replace vague quality claims with proven behavior useful to the reader.
- Delete sentences that praise the design, announce an explanation, or restate a fact in broader terms.
- Use contrasts when the reader could reasonably choose either option.
  List needed facts; do not pad lists to look complete.
- Do not end with boilerplate invitations when the answer is done.
- Apply feedback to the writing. Do not recount it in the document.
- Remove exclusions for actions the reader has no reason to take.

[Details](llm-isms.md)

### treat docs as contracts

- Keep docs next to what readers use.
- Explain reasons and limits that affect the reader's task. Put detailed contracts where readers look them up.
- Do not repeat what names, types, schemas, and tests already say.
- Update docs with behavior.
- Delete stale docs.

[Details](maintenance.md)

## Source Material

Sources:

- Diataxis: https://diataxis.fr/
- Google Technical Writing One: https://developers.google.com/tech-writing/one
- Google Developer Documentation Style Guide: https://developers.google.com/style
- Microsoft Writing Style Guide: https://learn.microsoft.com/en-us/style-guide/welcome/
- Digital.gov Plain Language Guide: https://digital.gov/guides/plain-language
- Nielsen Norman Group, How Users Read on the Web: https://www.nngroup.com/articles/how-users-read-on-the-web/
- Write the Docs, Style Guides: https://www.writethedocs.org/guide/writing/style-guides/
