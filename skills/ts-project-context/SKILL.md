---
name: ts-project-context
description: Shared project context for exploration, planning, and review.
---

# Project Context

## Role

Project Context stores project-specific facts, constraints, and precedents that
help judges choose between plausible options in later tasks. It is not a
decision log, backlog, architecture inventory, or work history.

Judges own the record. Give workers only context needed for their assigned task,
following the invoking skill's independence rules.

## Read

- Read relevant entries before exploring, planning, or ruling on findings.
- Check scope, applicability, and source before relying on an entry. Follow
  current user instructions and challenge entries contradicted by current evidence.
- Use implementation evidence to check facts, not to rewrite requirements.
- Resolve unknowns from available evidence first. Ask concrete questions when
  the answer changes a decision. Missing context proves neither safety nor a defect.
- Let context emerge from work. A missing record does not require an upfront questionnaire.

## Record

- Before creating, changing, or deleting project context, show the user the exact
  proposed change and name the future decision it could affect. Write only after
  explicit approval. Approval for another artifact or task does not authorize a
  project-context change.
- Retain only project-specific context that could change decisions beyond the
  active task. Do not restate general principles or facts that are cheap to
  recover from source. Keep feature-specific decisions in designs and plans,
  rulings in reviews, and coordination or completion state in work logs.
- Label facts, requirements, assumptions, accepted decisions, and accepted risks
  distinctly. Record each entry's statement, scope, future decision it helps,
  source, date, and condition for reconsideration.
- State when an entry applies. Keep current behavior separate from accepted future
  changes; an approved design does not prove that the change has shipped.
- Record the reason for decisions and accepted risks. Risk acceptance requires
  the user or an authoritative decision; an agent's assumption cannot accept a risk.
- Delete entries that no longer affect future decisions. When planned work ships,
  retain only a durable reason, constraint, or accepted risk that still guides
  later work. Never rewrite the plan as a completed-work record. Keep unresolved
  assumptions and contradictions explicit. Do not promote a proposal into an
  accepted decision.
- Write a short statement that stands alone without past chats or disposable artifacts.
  Link to existing owners for detail; do not copy whole contracts or decision histories.

## Example

**Fact:** Production stops the old application version before starting the new one.
**Helps decide:** Whether migrations and API changes must support mixed application
versions during deployment.
**Source:** Deployment owner, 2026-09-07.
**Revisit:** Before adopting rolling deployments.
