# Review: <Review Name>

## Result
<State whether findings block the reviewed change. Name the most important outcome in one or two sentences.>

## Findings
<Order these by priority (critical>high>low)>
### <critical|high|low>: <defect and affected behavior>
**Location:** `path/to/file.ts:42`, `path/to/other.ts:10`
**Impact:** <concrete consequence for a user, operator, maintainer, or system>
**Evidence:** <Observed|Inferred>. <brief redacted proof: code path, command
result with secrets removed, failing test, type error, missing assertion, docs
drift, etc.>
**Suggested Fix:** <action and exact target; use `None` if no responsible fix is clear yet>
**Category:** <specific category within the review type; metadata, not the issue title>

## Direct Edits
<Use `None` when no direct edits were made. For each edit, include the path and one-line purpose.>

## Scope
<Standalone description of what was reviewed. Include commits, plans, files, commands, constraints, and assumptions
when they change the review. Restate the exact review target and any context needed to understand the findings.>

## Review Type
<review type>

## Reviewer Metadata
Judge: provider `<provider>`, model line `<model-line>`, reasoning `<level>`
Workers:
- `<review-type>`: provider `<provider>`, model line `<model-line>`, reasoning `<level>`
- `<review-type>`: provider `<provider>`, model line `<model-line>`, reasoning `<level>`
