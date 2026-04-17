# Robustness Review

Use this for overall implementation quality when the user does not ask for a
more specific review type.

## Focus

- Correctness under normal and edge-case behavior
- Failure handling, retries, cleanup, and fallback behavior
- Data validation and invariants
- Hidden coupling, leaky abstractions, and unclear ownership
- Maintainability, readability, and change risk
- Operational hazards that are not primarily performance or security issues
- Developer experience traps such as brittle APIs, surprising defaults, or
  hard-to-debug control flow

## Workflow

1. Read the change, then identify the claims it appears to make about behavior.
2. Stress the weakest assumptions first: unhappy paths, zero/empty cases,
   partial failure, invalid input, ordering, retries, cleanup, and lifecycle.
3. Check whether the structure makes future changes more dangerous than they
   need to be.
4. Prefer findings that show incorrect behavior, missing guards, hidden
   complexity, or long-term maintenance traps.

## Category Hints

- `correctness`
- `error-handling`
- `validation`
- `data-integrity`
- `maintainability`
- `coupling`
- `operability`
- `developer-experience`

## Do Not Drift Into

- `stability.md` for backwards compatibility and change safety
- `security.md` for exploitability and trust boundaries
- `performance.md` for latency or throughput issues unless the quality problem
  clearly depends on them
