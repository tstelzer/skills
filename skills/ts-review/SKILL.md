---
name: ts-review
description: Review local code. Only explicitly triggered by user.
---

# Review

## Role

You lead the review as the judge.

Choose what to review and assign work to other agents, called workers. Check the problems they report, decide how
serious each one is, and write the report. A reported problem is called a finding.

Check the workers' claims as well as the work under review. Look into missing facts or conflicting reports.
Reuse checks that were done well.

When asked to rewrite an existing review, go straight to [Write the report](#write-the-report).
Edit the supplied file in place and use it as your source. Keep its findings, IDs, rulings, user decisions, and
severities. Keep the supporting facts and the limits on what the review established. Do not start workers or
look for new problems.

## Required reading

- skill: ts-simple
  - Use it for all review writing, including titles, descriptions, fixes, and reasons for decisions.
- skill: ts-principles
  - Read `ts-principles/SKILL.md` and every detail document it links to before reviewing.
- skill: ts-technical-writing
  - Use it whenever the judge writes a review report.
  - Before writing or deciding on findings, read `ts-technical-writing/SKILL.md`, `ts-technical-writing/audience.md`,
    `ts-technical-writing/prose.md`, and `ts-technical-writing/structure.md`.
  - For a `technical-writing` review, read every detail document that skill links to.

## Requirements and background

The review request may name a plan, design, decision, or other requirements to check.
Check the work against those requirements. Use the principles within that scope. Do not add new product or
architecture work to the review.

Earlier reviews and handoffs do not prove that the current work is correct. Recheck an accepted decision when new
facts show that it relied on something that is no longer true.

Use skill: ts-project-context to read and update the shared project notes.
Keep those notes and past rulings with the judge. Do not give them to workers.

## Worker models

Use different model classes for workers who review the same type of problem.
A model class is one provider and model line. Two releases of the same model line count as one class.

## Steps

1. Choose review types.
2. Choose what to review.
3. Assign workers.
4. Decide on findings.
5. Write the report.

### Choose review types

- Choose the types that best fit the user's request and the work.
- Available types:
    - `automatic-testing`: broken or weak tests, and changed behavior with no tests to catch failures
    - `technical-writing`: wrong, missing, outdated, unsafe, or unclear docs, examples, and instructions
    - `performance`: response time, how much work the system can handle, memory use, and unnecessary work
    - `robustness`: correct behavior, failure handling, code structure, and ease of use for developers
    - `security`: who can access what, unsafe input, leaked secrets, and ways an attacker could misuse the code
    - `stability`: support for older clients and saved data, safe upgrades, and changes to promised behavior
- For a docs review, choose `technical-writing`.
- Unless the user asks for a different set, include at least `automatic-testing` and `robustness`.

### Choose what to review

- Use the user's request to choose the files, commits, docs, plans, or designs to check.

### Assign workers

- Give each worker one review type. Workers must not start other workers, expand their task, or combine findings
  from other workers.
- Workers report their findings to the judge in chat. They must not write a report file.
- Only `technical-writing` workers may edit files, as allowed by [their guide](./by-type/technical-writing.md).
  Every other worker must leave files unchanged.
- Use one worker for `technical-writing` when that worker may edit files. That worker owns the writing pass.
  The judge may make the same edits when doing that review directly.
- The judge may do a review directly only when the user asks for exactly one review type.
- Otherwise, use two workers for each review type, from different model classes.
  Use one worker when only one model class is available. The one-worker rule for writing edits still applies.
- Each worker's prompt must include:
    - What to review, where to stop, which requirements to check, and the inputs needed for the task.
    - The review type, provider, model line, and reasoning level assigned to the worker.
    - The required writing skill `skill: ts-simple`.
    - These files to read, with paths relative to this skill:
        - `./by-type/<type>.md`, such as [technical-writing.md](./by-type/technical-writing.md)
        - [shared.md](./shared.md)
        - [review-template.md](./review-template.md)
        - Any other files inside this skill that the review type guide links to.
    - For `technical-writing`, `skill: ts-technical-writing` and every detail document it links to.
    - Return findings in chat using [review-template.md](./review-template.md). Do not write a findings file.
    - For `technical-writing`, follow the edit rules in [technical-writing.md](./by-type/technical-writing.md).
      Report each edit in chat with its path and a short reason.
    - For every other type, leave all files unchanged.
    - Report problems from your assigned checks. Say what must be true for each problem to happen.
      Say what you checked and what you are taking as true without checking it. Leave decisions to the judge.
      Do not read `docs/project-context.md` or past rulings.
    - If a required tool still fails after the obvious fix, report the failure to the judge.
      Do not hide the failed check by making a weaker claim.
- Refer to other skills by name, such as `skill: ts-principles`.

### Decide on findings

- Decide on every finding, including ones the judge found. Use [review-template.md](./review-template.md).
- Check how the problem happens, whether those conditions apply, and what the result would be.
  Use the current facts, the requirements, and any risks the user has accepted.
  An unknown fact does not prove that the work is safe or broken.
- Check the available information first. Ask the user a specific question when their answer could change your
  decision or severity. Wait for that answer before deciding on the finding. Continue other work while waiting.
  Save answers that will help later tasks in the project notes.
- Keep every worker finding, who reported it, their proposed severity, their supporting facts, and their claim.
  Make the wording clearer without changing its meaning. Put corrections and disagreements in the ruling.
  Do not delete a finding because you reject it. Keep reports of direct edits too.
- Give each finding one ruling and explain why:
    - `upheld`: the finding is valid
    - `rejected`: the claim does not hold
    - `deferred`: more information or a decision is needed
    - `resolved`: the problem has been fixed
    - `duplicate`: another finding covers the same problem; give that finding's ID
- For a deferred finding, say which information or decision is missing.
- For an upheld finding, set the final severity from what happens when its failure conditions apply.
  Explain any change from the worker's proposed severity. The severity examples help you decide;
  they do not decide whether a change can proceed.
- Give each finding a unique ID within the report: `F001`, `F002`, and so on.
  Keep existing IDs in later reviews and use the next unused ID for each new finding.
  Keep duplicates with their own IDs and sources.
- If two workers of the same review type and different model classes disagree on a finding, the judge may ask a
  third worker from another model class to check it. If no third class is available, check it yourself and record
  which facts settled the disagreement.
- If any worker reports a tool failure that blocked a required check, stop. Report the failure to the user as the
  review's result. Do not write the final report.

### Write the report

- Only the judge writes the report.
- Skip the report file when the user asks for an informal review.
- For a new review, write `<repository-root>/docs/reviews/YYYY-MM-DD_HH:MM_<review-type>_<review-name>.md`.
  Create the directory as needed.
- If the `technical-writing` review changed files, list their paths and the reason for each change under
  `## Direct Edits`.
- Follow [review-template.md](./review-template.md). Put the result and findings before the background and reviewer
  details.
- Base the result on the rulings, final severities, and recorded user decisions. Say what needs fixing and which
  decisions remain open. Do not call the review clear while findings still await a decision.
  Include enough background to explain each ruling without the chat.
- Use short reviewer IDs in findings. Under `## Reviewer Metadata`, list each ID with its review type, provider,
  model line, and reasoning level. Include earlier reviewers whose findings remain in the report.
- Use `Workers: none (judge direct)` only when the judge did the only requested review type directly.
