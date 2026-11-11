# Review: <Review Name>

## Result

<Say whether the work can proceed. Count the findings that need fixes at each severity and name any open decisions.
Follow recorded user decisions. Keep this short; put each problem's summary in its finding.>

## Upheld findings

<List upheld findings that still need action, ordered by final severity: critical, high, low.
Keep every finding, including rejected findings and duplicates. Put the others in the sections below.
Workers return finding entries only. They leave out severity in the title and fields marked for the judge.
Use plain labels without bold markup. Put blank lines between Description, Suggested Fix, and Details.>

### F<NNN>: <what goes wrong, in plain words> [<final severity; upheld findings only>]

Description:
<Start with what goes wrong for the user or system. Explain when and why in short, plain paragraphs.
The reader should understand this without knowing the libraries or following the code line by line.
Keep the facts that limit when the problem can happen or how bad it can be.
Say whether you saw the failure happen or expect it from what you checked. Name any facts you have not checked.>

Suggested Fix:
<Say what to change and where. Explain what the change should make the system do.
Explain any library terms needed to make the fix. Use None when you cannot suggest a safe fix.>

Details:

- Location: `path/to/file.ts:42`, `path/to/other.ts:10`
- Evidence: <Show the code steps, library behavior, test results, and references that support the claim.
  Explain what they show in plain words. Keep the proof here without repeating the description.>
- Source: <reviewer ID and worker finding ID; use judge when the judge found the problem>
- Category: <kind of problem within the review type>
- Proposed severity: <critical|high|low>
- Ruling: <upheld|rejected|deferred|resolved|duplicate; judge only>
- Ruling reason: <Say why you made this decision without repeating the description or evidence.
  Explain changes in severity, why you rejected the claim, or how the problem was fixed.
  For deferred findings, say what answer is missing. For duplicates, give the finding ID to keep. Judge only.>
- User ruling: <Record only decisions the user actually made. Keep them separate from the judge's ruling.>

## Needs a decision

<List deferred findings in the same format, without a final severity. Say what answer each one needs.
List other open review decisions as plain bullets. Leave out this section when none remain.>

## Other findings

<List rejected, resolved, and duplicate findings, and findings the user set aside. Use the same format.
Keep their original rulings and user decisions. Leave out this section when there are no such findings.>

## Direct Edits

<List each changed path and a one-line reason for the edit. Leave out this section when no direct edits were made.>

## Scope

<Say what was reviewed so the report makes sense without the chat. Name the exact files, commits, plans, or other
work checked. Include commands, limits on the review, and facts taken as true when they affect the result.>

## Review Type

<review type>

## Reviewer Metadata

Judge: provider `<provider>`, model line `<model-line>`, reasoning `<level>`

Workers:

- `<reviewer ID>`, type `<review-type>`: provider `<provider>`, model line `<model-line>`, reasoning `<level>`
