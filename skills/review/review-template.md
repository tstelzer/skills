# Review: <Review Name>

## Review Type
<review type>

## Reviewer Metadata
Judge: provider `<provider>`, model `<model>`, reasoning `<level>`
Workers:
- `<review-type>`: provider `<provider>`, model `<model>`, reasoning `<level>`
- `<review-type>`: provider `<provider>`, model `<model>`, reasoning `<level>`

## Scope
<Standalone description of what was reviewed. Include commits, plans, files,
commands, constraints, and assumptions when they change the review.
MUST restate the exact review target and any constraints needed to
  understand the findings.>

## Findings
<Order these by priority (critical>high>low)>
### <critical|high|low>: <short issue title>
**Category:** <specific category within the review type>
**Impact:** <why this matters>
**Location:** `path/to/file.ts:42`, `path/to/other.ts:10`
**Evidence:** <Observed|Inferred>. <brief redacted proof: code path, command
result with secrets removed, failing test, type error, missing assertion, docs
drift, etc.>
**Suggested Fix:** <concrete repair or next step; use `None` if no responsible
fix is clear yet>
