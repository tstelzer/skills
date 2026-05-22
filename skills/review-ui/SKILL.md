---
name: review-ui
description: Use as the UI review judge for existing user-facing interfaces. Reviews websites, product surfaces, dashboards, app screens, flows, forms, onboarding, empty states, frontend diffs, screenshots, routes, prototypes, and visual redesigns for usability, visual hierarchy, interaction quality, accessibility, responsive behavior, design-system drift, hardening, UX copy, and frontend performance. Not for backend-only review.
---

# Review UI

## Required Reading

- skill: principles (read details you deem relevant)

## Role

Review UI is a judge.

It owns UI review scope, evidence gathering, lens selection, delegation,
finding synthesis, severity normalization, and the saved review artifact.

Use it to find defects in an existing user-facing surface. It does not implement
fixes. It may recommend concrete repairs or hand work to `design-ui`, `plan`,
`implement`, or a workflow skill.

The judge may do the work directly. Delegate only when bounded lenses can run
independently, such as visual hierarchy, interaction and accessibility,
responsive hardening, design-system alignment, UX copy, or frontend
performance. Workers return findings. The judge writes the review.

## Workflow

1. DETERMINE_SCOPE
2. LOAD_CONTEXT
3. GATHER_EVIDENCE
4. SELECT_LENSES
5. RUN_REVIEW
6. AGGREGATE_FINDINGS
7. WRITE_ARTIFACT

### DETERMINE_SCOPE

- Determine the target: source files, route, screenshot, prototype, commit,
  diff, flow, component, or whole surface.
- Identify constraints: browser support, device targets, quality bar, release
  risk, and explicit exclusions.
- For saved output, name the artifact path:
  `<repository-root>/docs/reviews/YYYY-MM-DD_HH:MM_ui_<review-name>.md`.

### LOAD_CONTEXT

- Read relevant source, screenshots, docs, configs, design docs, tokens,
  component libraries, routes, tests, `AGENTS.md`, and prior designs or reviews.
- Identify current product terminology, target users, design system, component
  conventions, layout scale, typography scale, color tokens, interaction
  patterns, and accessibility constraints.
- Use semantic skill names for external skills, e.g. `skill: principles`.
- Use paths for local files.

### GATHER_EVIDENCE

Prefer evidence from the rendered interface when available.

Useful evidence:

- Browser inspection of the live route.
- Screenshots across desktop and mobile viewports.
- Keyboard-only walkthrough.
- Focus, hover, active, disabled, loading, error, and empty states.
- Contrast checks and semantic markup inspection.
- Responsive overflow checks.
- Long text, empty data, large data, permission, and network-error states.
- Source inspection for tokens, component use, CSS, imports, asset handling, and
  frontend performance risks.

If rendered evidence is unavailable, continue from source and state the limit in
the review.

### SELECT_LENSES

Choose the smallest useful set. Default to the first four unless the scope says
otherwise.

- `visual-hierarchy`: layout, spacing, alignment, density, rhythm, typography,
  color, imagery, and whether the surface looks intentional.
- `interaction-accessibility`: controls, states, focus, keyboard, semantics,
  labels, forms, error recovery, motion, and screen reader affordances.
- `responsive-hardening`: mobile, tablet, narrow containers, touch targets,
  overflow, long text, i18n, empty data, large data, and slow networks.
- `design-system`: token use, shared components, drift, one-off styling,
  pattern mismatch, and naming consistency.
- `ux-copy`: labels, buttons, empty states, errors, confirmations, help text,
  jargon, redundancy, and translation readiness.
- `frontend-performance`: layout shift, heavy assets, image sizing, expensive
  animation, unnecessary rendering, bundle risk, and interaction latency.

### RUN_REVIEW

For each lens:

- State the counterfactual standard: the minimal UI that would satisfy the
  claim.
- Start from the hypothesis that the surface has defects.
- Report only issues with evidence and user impact.
- Distinguish observed evidence from inference.
- Keep findings concrete. Name the element, state, route, file, or interaction.

### AGGREGATE_FINDINGS

- Deduplicate findings across lenses.
- Normalize severity.
- Preserve disagreements or evidence gaps as open risks.
- Do not pad with generic praise.
- If there are no findings, say so explicitly and name any evidence limits.

Severities:

- `critical`: blocks the primary task, creates a severe accessibility failure,
  causes data loss, or makes the surface unusable for a required user group.
- `high`: significantly slows, confuses, excludes, or misleads users; likely
  release blocker.
- `low`: real defect or rough edge with a workaround; should fix, but not
  merge-blocking.

### WRITE_ARTIFACT

- Skip if the user explicitly asks for an informal review.
- Create `docs/reviews/` if it does not exist.
- Write the final review to:
  `<repository-root>/docs/reviews/YYYY-MM-DD_HH:MM_ui_<review-name>.md`.
- The chat response should lead with findings. Summaries are secondary.

## Review Template

```markdown
# UI Review: <Review Name>

## Scope
<Standalone description of target, files, routes, commits, viewports,
constraints, and evidence gathered.>

## Findings
<Order by severity: critical, high, low.>

### <critical|high|low>: <short issue title>
**Category:** <review lens>
**Impact:** <how this affects users or release quality>
**Location:** `<path-or-route>:<line-if-known>` or `<screen/state/element>`
**Evidence:** <Observed|Inferred>. <brief proof from rendered UI, source, command, or walkthrough>
**Suggested Fix:** <concrete repair or next step>

## Evidence Limits
<What could not be inspected or verified. Skip if none.>

## Open Risks
<Material concerns that need more evidence. Skip if none.>
```
