---
name: design-ui
description: Use as the UI design judge before frontend implementation. Produces a design brief for websites, product surfaces, dashboards, app screens, flows, forms, onboarding, empty states, and visual redesigns. Use when the user asks to design, shape, clarify, plan, or define a user-facing interface before code. Not for backend-only work, code review, or implementation.
---

# Design UI

## Required Reading

- skill: principles (read details you deem relevant)

## Role

Design UI is a judge.

It owns UI scope, context loading, visual direction, user workflow, state
coverage, design decisions, and the saved design brief.

Use it before implementation when the work needs a user-facing direction. It
does not write code and does not produce an implementation plan. Hand the brief
to `plan`, `implement`, or a workflow skill when code work should begin.

The judge may do the work directly. Delegate only when a bounded lens can run
independently, such as audience, content model, visual system, accessibility,
responsive behavior, or interaction states. Workers return notes. The judge
writes the brief.

## Workflow

1. DETERMINE_SCOPE
2. LOAD_CONTEXT
3. RESOLVE_REGISTER
4. RESOLVE_BRIEF_INPUTS
5. DRAFT_BRIEF
6. CHECK_GATES
7. WRITE_ARTIFACT

### DETERMINE_SCOPE

- Determine the requested surface, flow, or component.
- Identify whether the user wants chat output or a saved artifact.
- For saved output, name the artifact path:
  `<repository-root>/docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md`.
- Create `docs/designs/` if it does not exist.

### LOAD_CONTEXT

- Read relevant source, screenshots, product docs, design docs, routes,
  components, styles, tokens, `AGENTS.md`, and prior plans or reviews.
- Prefer current project conventions over generic design doctrine.
- Identify existing terminology, UI patterns, component libraries, design
  tokens, layout systems, and accessibility constraints.
- Use semantic skill names for external skills, e.g. `skill: principles`.
- Use paths for local files.

### RESOLVE_REGISTER

Classify the surface:

- `product`: the UI serves a task. Examples: app screens, dashboards, admin
  tools, settings, tables, forms, authenticated surfaces.
- `brand`: the UI creates an impression. Examples: landing pages, marketing
  pages, portfolios, editorial surfaces, campaign pages.

When unclear, infer from the surface in focus. Product favors trust,
consistency, density, predictable controls, and efficient workflows. Brand
favors point of view, pacing, imagery, distinct hierarchy, and memorable visual
direction.

### RESOLVE_BRIEF_INPUTS

Resolve from local context before asking. Ask only questions whose answers
change the brief.

Required inputs:

- Primary user and use context.
- Primary user action or decision.
- Content and data shown or collected.
- Realistic data ranges: empty, typical, large, long text, missing data.
- Key states: default, loading, empty, error, success, disabled, permission.
- Interaction model: entry path, controls, feedback, exits, undo or recovery.
- Visual direction: hierarchy, density, typography, color strategy, imagery.
- Responsive constraints: mobile, tablet, desktop, touch, narrow containers.
- Accessibility constraints: keyboard, focus, contrast, labels, motion.
- Scope: fidelity, breadth, interactivity, and quality bar.
- Anti-goals: directions that would be wrong for this product or audience.

If a reasonable default is clear, assert it and invite correction. Do not turn
obvious decisions into menus.

### DRAFT_BRIEF

Write for a skilled implementer with no prior chat context.

Keep the brief concrete. Name decisions, constraints, and states. Do not include
implementation tasks, CSS snippets, or component code unless the user explicitly
asks for them.

Use compact form when the task is small and well understood. Use the full
template for ambiguous, multi-screen, high-risk, or standalone design work.

### CHECK_GATES

Before finalizing, verify:

- The register is named.
- The primary user action is named.
- Data ranges and edge cases are named.
- Required UI states are named.
- Responsive behavior is covered.
- Accessibility constraints are covered.
- Visual direction is specific enough to guide implementation.
- Open questions contain only unresolved blockers.
- The brief has no implementation task list.
- The brief stands alone without prior chat.

### WRITE_ARTIFACT

- For chat output, present the brief inline and stop.
- For saved output, write the final brief to:
  `<repository-root>/docs/designs/YYYY-MM-DD_HH:MM_<design-name>.md`.
- When revising, rewrite the complete artifact. Do not write a delta.

## Brief Template

```markdown
# UI Design: <Surface Name>

## Summary
<What this surface is, who uses it, and what it must accomplish.>

## Register
<product|brand, with rationale.>

## Primary Action
<The main action, decision, or understanding the UI must support.>

## Users And Context
<User role, frequency, setting, intent, stress level, and prior knowledge.>

## Content And Data
<Content, inputs, outputs, realistic ranges, missing data, long text, and media.>

## Visual Direction
<Hierarchy, density, layout rhythm, typography, color strategy, imagery, and tone.>

## Interaction Model
<Entry path, controls, feedback, transitions, recovery, and exit path.>

## States
<Default, loading, empty, error, success, disabled, permission, and edge cases.>

## Responsive Behavior
<How the surface adapts across viewport, container, and input method.>

## Accessibility
<Keyboard, focus, labels, contrast, reduced motion, screen reader, and zoom needs.>

## Out Of Scope
<What this brief does not cover. Skip if none.>

## Open Questions
<Unresolved blockers only. Skip if none.>
```
