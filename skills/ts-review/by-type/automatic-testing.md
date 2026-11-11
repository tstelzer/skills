# Review Automatic Testing

Check whether the tests catch failures in the changed behavior.

## Review target

Look for the smallest set of tests that catches the failures this change could cause.
Tests that repeat checks or give false confidence are problems too.

## Required skills

Read these detail pages from skill: ts-principles:

- `tests are code`
- `fight entropy`
- `avoid hasty abstractions`
- `handle it, or die`

## What to check

- Tests for the changed behavior.
- Tests added, changed, removed, skipped, or made outdated by the change.
- Test commands, build jobs, test data, mock services, helpers, and code that runs the tests.
- Changed behavior that could break without a test failing.
- Useful tests that run in the wrong place, command, or environment.
- Bad tests in the changed area. Report them even when removing them would lower the coverage count.

## Outside this review

- Manual testing.
- Coverage targets with no link to changed behavior.

## Steps

1. List the behavior being changed and the tests meant to protect it.
2. Check for missing tests and tests that give false confidence. Check that each test sets up what its name says
   and checks the promised result. A passing test can still test the wrong situation.
3. Look for tests that copy the code's steps, repeat another check, or only check constants or how types are connected.
   Also look for tests that only render a component, call a wrapper, retest a library, or test a helper without
   testing real behavior. Report tests that break during code cleanup even though the behavior stays the same.
4. Recommend deleting a test when it adds no useful check. Recommend rewriting it when it targets a real risk but
   checks the wrong thing. Review workers must not edit test code.
5. For each remaining test, try to describe broken code that would still pass it.
6. Report tests that check the wrong thing, repeat other tests, test old behavior, or break more easily than the
   behavior they protect. A high coverage count, an earlier pass, or no replacement test is not a reason to keep them.
7. Report a missing test only when you can describe a specific way the changed behavior could break.
8. Return findings using [review-template.md](../review-template.md).

## Severity examples

Use these examples to help judge how serious the actual problem is.

- `critical`: changed code handles sign-in, access checks, money, or data correctness with no tests to catch failures.
- `high`: changed behavior has no tests, or its main test checks the wrong thing, copies the code's steps, or
  tests a different situation from the one its name promises.
- `low`: a test misses a possible failure or unusual input, repeats another test, runs slowly, or is a bad test in
  touched code outside the changed behavior.

## Category examples

- `regression-signal`
- `assertion-signal`
- `counterfactual-coverage`
- `failure-path-coverage`
- `contract-coverage`
- `integration-boundary`
- `test-harness`
- `ci-wiring`
- `flakiness`
- `test-maintainability`
- `name-body-alignment`
