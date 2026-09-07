---
name: ts-project-context
description: Shared project context for exploration, planning, and review.
---

# Project Context

## Role

Project Context is a reference for judges that read and maintain
`<repository-root>/docs/project-context.md` across tasks.

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

- Maintain the record within the active task's write permissions. Create it when
  there is reusable context to retain. Read it before updating and preserve unrelated edits.
- Retain what matters beyond the current task. Keep feature-specific decisions in
  designs and plans, rulings in reviews, and coordination state in work logs.
- Label facts, requirements, assumptions, accepted decisions, and accepted risks
  distinctly. Record each entry's statement, scope, source, date, and condition for reconsideration.
- State when an entry applies. Keep current behavior separate from accepted future
  changes; an approved design does not prove that the change has shipped.
- Record the reason for decisions and accepted risks. Risk acceptance requires
  the user or an authoritative decision; an agent's assumption cannot accept a risk.
- Update stale entries as evidence or decisions change. Keep unresolved assumptions
  and contradictions explicit. Do not promote a proposal into an accepted decision.
- Write a short statement that stands alone without past chats or disposable artifacts.
  Link to existing owners for detail; do not copy whole contracts or decision histories.

## Example

**Fact:** Production stops the old application version before starting the new one.
**Source:** Deployment owner, 2026-09-07.
**Revisit:** Before adopting rolling deployments.

**Accepted decision:** Production will use rolling deployments after the deployment redesign ships.
**Reason:** Avoid deployment downtime. This is not current behavior.
**Source:** Accepted deployment design, 2026-09-07.
**Revisit:** When the redesign ships or its scope changes.
