---
name: ts-project-context
description: Shared project context for exploration, planning, and review.
---

# Project Context

## Role

Project Context stores project facts, limits, and past decisions that help judges choose between reasonable options
in later tasks. Do not use it as a decision log, backlog, architecture map, or work history.

Judges maintain the record. Give workers only the context their task needs, following the calling skill's rules
for independent work.

## Read

- Read relevant entries before exploring, planning, or ruling on findings.
- Before relying on an entry, check what it covers, whether it applies, and where it came from.
  Follow current user instructions and question entries that conflict with current evidence.
- Use implementation evidence to check facts, not to rewrite requirements.
- Resolve unknowns from available evidence first. Ask concrete questions when
  the answer changes a decision. Missing context proves neither safety nor a defect.
- Gather context as you work. Do not start with a questionnaire just because the record is missing.

## Record

- Before creating, changing, or deleting project context, show the user the exact
  proposed change and name the future decision it could affect. Write only after
  explicit approval. Approval for another artifact or task does not authorize a
  project-context change.
- Keep only project context that could change decisions in later tasks. Do not repeat general principles or facts
  that are easy to find in source. Keep feature decisions in designs and plans, rulings in reviews,
  and work status and coordination in work logs.
- Label facts, requirements, assumptions, accepted decisions, and accepted risks separately.
  For each entry, record the statement, scope, future decision it helps, source, date, and when to revisit it.
- State when an entry applies. Keep current behavior separate from accepted future
  changes; an approved design does not prove that the change has shipped.
- Record why decisions were made and risks accepted. Only the user or an authoritative decision can accept a risk.
  An agent's assumption cannot.
- Delete entries that no longer affect future decisions. When planned work ships, keep only reasons, limits,
  or accepted risks that still guide later work. Never turn the plan into a record of completed work.
  State unresolved assumptions and conflicts. Do not label a proposal as an accepted decision.
- Write short statements that make sense without past chats or temporary artifacts.
  Link to the source for details. Do not copy whole contracts or decision histories.

## Example

**Fact:** Production stops the old application version before starting the new one.
**Helps decide:** Whether migrations and API changes must support mixed application
versions during deployment.
**Source:** Deployment owner, 2026-09-07.
**Revisit:** Before adopting rolling deployments.
