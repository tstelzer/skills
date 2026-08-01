# Things the AI still gets wrong when using the Effect v4 skill

Audience: maintainers of the `ts-effect-v4` skill.

The AI generally knows Effect v4 syntax and APIs. The remaining problems come
from applying Effect inconsistently across a complete change: platform access,
dependency injection, error mapping, resource cleanup, boundary semantics, and
tests. The skill should teach these as implementation and review defaults, not
only as isolated API examples.

## It bypasses Effect capabilities without checking for an existing service

The AI reaches for `node:fs/promises`, `node:os`, `Date.now()`,
`node:crypto`, and direct process state inside otherwise Effect-based code and
tests, even when Effect provides `FileSystem`, `Path`, `Clock`, `Crypto`,
configuration, or another injectable capability.

This hides dependencies, makes tests mutate global state, and creates manual
resource management alongside Effect scopes.

The skill should state:

- Check for an Effect capability before using a runtime-global or `node:*` API.
- Inject filesystem, time, randomness, environment, platform state, and other
  observable capabilities when their behavior matters.
- Use `layerNoDeps` for the implementation with visible requirements, then
  provide `NodeServices.layer` at the runtime edge.
- Reach for native Node APIs when they provide required semantics that the
  Effect abstraction does not expose, such as specific open flags. Document
  that reason instead of treating all native APIs as forbidden.

## It leaves ambient dependencies inside services

Using `Context.Service` does not by itself make a service's dependencies
explicit. The AI still reads or mutates `process.env`, time, platform values,
and other globals inside layer construction or tests.

The skill should show that ambient inputs belong in a service requirement,
`Context.Reference`, `Config`, or explicit layer options. Tests should provide
those values without patching process-global state.

## It mistakes observing an error for recovering from it

The AI uses `Effect.catch` to render or log an error and then returns `void`.
This converts a failed workflow into a successful one and forces callers to
handle success values such as `A | undefined` that do not represent domain
state.

The skill should state:

- Use `Effect.tapError` when reporting a failure without handling it.
- Use `Effect.catch`, `catchTag`, or `catchTags` only when the handler returns a
  valid recovery value or a deliberate replacement failure.
- Rendering, logging, and setting exit metadata are observations, not recovery.
- Keep the error channel intact until the application boundary decides the
  process or protocol outcome.

## It maps errors around workflows instead of around failing operations

The AI wraps a large effect in `mapError`, receives a broad error union or
`unknown`, then uses `instanceof` checks to avoid rewrapping errors it recognizes.
It also reconstructs typed platform errors through defensive property checks.

This loses type information and makes the mapping depend on every operation
inside the workflow.

The skill should prefer narrow mappings:

- Map `spawn` errors at `spawner.spawn`.
- Map stream collection errors around the stream operation.
- Map `FileSystem` errors where the filesystem call crosses into the domain.
- Use typed fields such as `PlatformError.reason` instead of widening the error
  to `unknown` and rediscovering its shape.
- Let already-mapped domain errors pass through without a catch-and-rethrow
  branch.
- Do not convert defects into expected domain errors merely to make an error
  type uniform.

## It gives cleanup failures accidental semantics

The AI commonly applies `orDie` to cleanup operations, suppresses every cleanup
failure, or writes catch-cleanup-rethrow pipelines by hand. These choices make
expected filesystem failures into defects or allow cleanup to replace the
original failure accidentally.

The skill should include explicit cleanup policies:

- Use `acquireRelease`, `acquireUseRelease`, `Scope`, and scoped platform
  helpers for resource lifetime.
- Preserve cleanup errors when cleanup is part of the operation's contract.
- Ignore cleanup errors only for a named best-effort path where the original
  result must win.
- Use `onError` for failure-only cleanup instead of catching and manually
  re-emitting the original error.
- Do not catch unrelated errors while probing for an expected condition such
  as `NotFound` or `AlreadyExists`.

## It collapses distinct boundary outcomes

The AI often implements only success versus failure and conflates states that
have different meanings:

- Missing output and successful-but-empty output.
- Missing data and malformed data.
- Top-level batch success and individual item failures.
- A failed command and a command that ran successfully but returned invalid
  output.

The skill should require boundary adapters to identify the relevant outcome
states before implementation. Missing, empty, malformed, partial, and complete
results should remain distinct when callers respond differently to them.

It should also warn against normalizing opaque output without an explicit
contract. Calling `trim()` on a secret, token, signature, or arbitrary command
output can corrupt valid data. `Redacted` prevents accidental disclosure; it
does not authorize transformation.

## It makes pure transformations effectful and then couples them to output

The AI sometimes makes rendering functions return `Effect<void>` and write to
`Console` directly. This couples formatting to transport and makes the output
harder to compare or reuse.

The skill should emphasize that not every function in an Effect application
needs to return an `Effect`:

- Keep renderers, encoders, comparisons, and other deterministic
  transformations pure when they cannot fail effectfully.
- Return data or text first, then write, send, or log it at the boundary.
- Use `Effect.fn` for effectful behavior, not as a reason to wrap pure data
  reshaping.

## It overproduces Effect-shaped abstractions

The AI creates one-use `Effect.fn` wrappers, copied result types, services, and
tests even when they add no behavior or boundary. For example, it may copy a
loaded configuration into a command-specific result with the same fields and
then add a unit test for that pass-through transformation.

The skill should say that Effect constructs do not make an abstraction earned.
A new service, effectful function, or result type should own behavior, an
invariant, a dependency boundary, or multiple real consumers.

## Its Effect tests are procedural, repetitive, and too optimistic

The AI uses `it.effect` in some places but still manages fixtures with promises,
raw filesystem calls, mutable process state, and manual `try`/`finally`. It also
writes separate tests for repeated cases and spends more coverage on nominal
paths than boundary counterfactuals.

The skill should reinforce:

- Use `it.effect` or `it.live` consistently for Effect workflows.
- Use layers and scoped Effect fixtures for dependencies and resources.
- Use `it.effect.each` for repeated input/output and failure cases.
- Compare complete data values when practical; prefer error tags and structured
  fields over messages or implementation calls.
- Test public behavior rather than pass-through Effect wrappers.
- At external boundaries, cover missing, empty, malformed, partial-failure,
  cleanup, and exact-value-preservation cases when relevant.

## The skill needs a final consistency audit

Examples teach individual APIs, but the AI needs an explicit review step after
implementation. The Effect v4 skill should ask the AI to audit the completed
change for:

- Direct `node:*`, `process.*`, `Date.now()`, and global environment access that
  could use an Effect capability or explicit dependency.
- Manual promise lifecycle code that should be scoped.
- `catch` handlers that only log, render, or return `void`.
- Broad `mapError`, `unknown`, `instanceof`, `catchDefect`, or `orDie` usage that
  hides a narrower failure boundary.
- Conflated missing, empty, malformed, and partial outcomes.
- Transformations of opaque or redacted values.
- Pure transformations unnecessarily coupled to Effect or output.
- One-use Effect wrappers and tests that protect implementation shape.
- Repeated tests that should be table-driven and missing boundary
  counterfactuals.

## Repository evidence

These patterns were identified from follow-up refactors in this repository:

- `bda0c1b`: replaced direct Node filesystem, time, path, and randomness usage
  with Effect capabilities and explicit layer requirements.
- `3b5afa2`: converted promise-based tests and manual temporary-directory
  cleanup to Effect-native tests and scoped resources.
- `9a3d4ec`: preserved command failures after rendering instead of recovering to
  `undefined`.
- `f6fb24b`: removed a pass-through command result and used typed platform
  errors directly.
- `dd93845`: narrowed error mappings, made inherited environment explicit, and
  corrected cleanup and lock-error behavior.
- `90c0442`: separated pure rendering from console writes.
- `effc255`: removed redundant tests and consolidated repeated cases with
  table-driven tests and data equality.
- `224b726`: added missing boundary behavior for partial batch failures,
  malformed output, exact secret preservation, and invalid empty
  configurations.
