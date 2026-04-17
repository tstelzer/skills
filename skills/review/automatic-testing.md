# Automatic Testing Review

Use this for automated test quality and coverage. Review both the tests that
exist and the tests that should exist but do not.

## Focus

- Missing automated coverage for changed behavior
- Tests that assert the wrong thing or almost nothing
- Brittle tests coupled to implementation details
- Over-mocked tests that hide real regressions
- Missing failure-path, boundary, or compatibility coverage
- Flaky, slow, or nondeterministic test design that will erode trust

## Workflow

1. Identify the behavior that changed and the regressions that matter most.
2. Check whether automated tests cover success paths, failure paths, and edge
   cases with meaningful assertions.
3. Look for tests that would still pass if the implementation were broken in
   the most likely ways.
4. Prefer findings that explain the regression gap, not just "needs more
   tests."

## Category Hints

- `coverage-gap`
- `assertion-quality`
- `brittleness`
- `over-mocking`
- `failure-path`
- `compatibility-coverage`
- `flakiness`

## Evidence Hints

- Changed behavior with no corresponding test
- Assertions that do not verify the claimed outcome
- Tests that duplicate implementation details instead of behavior
- Missing negative-path or compatibility cases
