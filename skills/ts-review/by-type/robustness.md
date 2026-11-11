# Review Robustness

Check whether the changed code works as intended and handles failures.

## Review target

Look for the simplest code that does the promised job with the inputs and failures it must handle.

## Required skills

Read these detail pages from skill: ts-principles:

- `shape code by domain`
- `keep boundaries sharp`
- `parse, don't validate`
- `handle it, or die`
- `avoid hasty abstractions`
- `integrated documentation`
- `states are values`
- `choose paradigm by fit`
- `fight entropy`
- `design for operation`

## What to check

- Changed behavior and the code that causes it.
- How the code represents business concepts and states, which rules must always hold, and what each part owns.
- Data coming in, going out, or being saved. Include settings and calls to other parts of the system.
- How the code handles failures, starts and stops work, cleans up, retries, and recovers when only some steps succeed.
- Names, structure, and dependencies that make the changed code harder to understand or change.
- Problems running or debugging the system that do not mainly concern speed or security.
- Missing comments that explain unusual rules, interface promises, failure cases, or limits on how to run the code.

## Outside this review

- Support for older versions and safe data migrations.
- Attacks and security checks.
- Speed or resource cost alone.
- Test quality and coverage.
- Broad docs cleanup outside the changed code.

## Steps

1. List what the change promises and the code responsible for each promise.
2. Follow the code for bad input, missing data, failures after earlier steps succeed, and events in the wrong order.
   Check cleanup, retries, cancellation, and starting and stopping work.
3. Check whether data and errors have the form the next part of the system expects.
4. Look for states that should be impossible, hidden links between unrelated parts, and code that makes later
   changes harder.
5. Keep only problems with a specific failure, a trap for someone changing the code, or a problem running it.
6. Return findings using [review-template.md](../review-template.md).

## Severity examples

Use these examples to help judge how serious the actual problem is.

- `critical`: wrong results during normal use, or a broken rule that corrupts the program's state.
- `high`: a failure is handled badly, the code allows a state that should be forbidden, or one part exposes details
  that another part should not depend on.
- `low`: unclear names, small avoidable dependencies, or nearby code that needs cleanup.

## Category examples

- `behavior-correctness`
- `boundary-shape`
- `invariant`
- `state-model`
- `error-model`
- `failure-path`
- `lifecycle`
- `cleanup`
- `coupling`
- `complexity`
- `missing-inline-docs`
- `ownership`
- `operability`
