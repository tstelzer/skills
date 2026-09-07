# Review: <Review Name>

## Result
<State whether rulings block the reviewed change and which decisions remain unresolved.>

## Findings
<Workers return finding entries only, omitting judge fields. The judge retains every entry, including rejected findings
and duplicates. Order upheld findings by final severity, then deferred findings, then the remaining rulings.>
### F<NNN>: <defect and affected behavior>
**Source:** <review type, provider, model line, reasoning level; identify judge-direct findings>
**Proposed Severity:** <critical|high|low>
**Location:** `path/to/file.ts:42`, `path/to/other.ts:10`
**Impact:** <concrete consequence for a user, operator, maintainer, or system>
**Prerequisites:** <conditions needed for the failure; distinguish established facts from assumptions>
**Evidence:** <Observed|Inferred>. <brief redacted proof: code path, command
result with secrets removed, failing test, type error, missing assertion, docs
drift, etc.>
**Suggested Fix:** <action and exact target; use `None` if no responsible fix is clear yet>
**Category:** <specific category within the review type; metadata, not the issue title>

**Ruling:** <upheld|rejected|deferred|resolved|duplicate; judge only>
**Ruling Reasoning:** <evidence and applicable context; explain rejection, severity changes, or resolution;
name missing information for deferrals or the retained finding ID for duplicates; judge only>
**Final Severity:** <critical|high|low for upheld findings; None otherwise; judge only>

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
