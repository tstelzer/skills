---
name: ts-principles
description: Core engineering principles. Use as a guiding reference for designing, planning and reviewing.
---

## Principles

Read each summary first. Read the linked details whenever the stated condition applies.

### shape code by domain

- Name things and actions precisely.
- Use one internal term for one domain concept.
- Prefer names from the domain over names for how the code works.
- Structure by domain: `users`, `machines`, `orders` over `components`, `controllers`, `repositories`, `routes`.
- Use a PascalCase filename only when a matching type, interface, or class owns the file. Keep that owner's schemas,
  constructors, errors, and operations with it.
- When no declaration owns the code, group it under the nearest real domain owner. Do not invent `Stuff.ts` for
  `doStuff` and `doOtherStuff`.
- Split out a technical role only for a separate responsibility such as HTTP, storage, or an external contract.
- Prefer a few cohesive files. Use a one-function file only when no broader grouping is clearer.
- Keep one concept together instead of splitting it across `.types.ts`, `.schema.ts`, `.constants.ts`, or `.errors.ts`.
- Avoid generic names in broad scopes: `data`, `entity`, `item`, `manager`, `helper`.
- Check existing naming before introducing new terms.
- Translate external names, legacy names, UI labels, and synonyms at boundaries.
- Use abbreviations when they improve local readability.
- Avoid mixed-purpose `utils`. Put code that could be a separate library in `lib`. Keep other code with its domain.

You must read [details](shape-code-by-domain.md) when the work designs, changes, or reviews naming, file placement,
module structure, or feature structure.

### keep boundaries sharp

- Extend the module that owns the responsibility. Add a boundary only for a responsibility that does not fit an
  existing owner.
- Keep implementation details inside the module that needs them.
- Map external concepts into internal concepts at the edge.
- Prefer explicit dependencies over hidden shared state or connections.
- If two modules change together often, reconsider the boundary.
- Pass plain data across data and protocol boundaries. Keep behavior on its own side.

You must read [details](keep-boundaries-sharp.md) when the work designs, changes, or reviews dependencies, interfaces,
adapters, integrations, or module boundaries.

### parse, don’t validate

- Parse unknown values at every boundary: IO, HTTP, DB, config, queues, env.
- Prefer type safety over casts and defensive programming.
- Use one schema library consistently.
- Put coercion, field extraction, normalization, and conversion to domain values in the boundary schema
  when they belong to the type.
- Do not add one-off `parse*` utilities after the boundary. Merge that logic into the schema when possible.
- Question `parse*` or `validate*` calls inside trusted code.
- After parsing, rely on types instead of re-checking everywhere.
- Parsing should produce a smaller, trusted type.
- Prefer discriminated unions for variants over one type with many optional fields.

You must read [details](parse-dont-validate.md) when the work designs, changes, or reviews a boundary that accepts
unknown input.

### privilege is earned

- Do not trust input, identity, or origin controlled by callers, or external systems.
- Authenticate identity before using it.
- Authorize every action against the target resource.
- Deny access when permission is unclear.
- Grant only the permissions the operation needs.
- Keep secrets out of source, logs, errors, telemetry, URLs, and clients.
- Return only data the caller is allowed to know.
- Limit access to the filesystem, network, browser, and third-party services.
- Treat attacker-triggered resource exhaustion as a security bug.

You must read [details](privilege-is-earned.md) when the work designs, changes, or reviews authentication,
authorization, secrets, sensitive data, or dangerous capabilities.

### handle it, or die

- Represent expected failures as named domain errors in the Effect error channel, `Result`, or similar types.
- Let unexpected bugs fail loudly.
- Map library errors into domain errors and domain errors into protocol errors at their boundaries.
- Preserve the original cause and useful structured context when mapping an error.
- Pass cause messages and context to readers only as far as they are allowed to see them.
- Do not reduce a human-facing error to a type, tag, or generic summary.
- Include a corrective action only when it is known to apply.
- Format human-facing errors for their interface.
- Avoid catch-log-rethrow.
- Log unhandled errors exactly once, at the boundary.
- Stop when a rule the program relies on no longer holds.
- Do not encode programmer bugs as recoverable business errors.

You must read [details](handle-it-or-die.md) when the work designs, changes, or reviews error types, error messages,
error mapping, error presentation, recovery, catching, or logging.

### avoid hasty abstractions

- Write for current needs.
- Duplicate until a clear pattern repeats.
- Share code only after repetition shows what belongs together.
- Make a value configurable only when it actually varies.
- Inline values that are not shared and unlikely to change.
- Keep one-use code inline unless moving it to a function makes both the caller and the body clearer.
- Do not extract tiny object builders or pass-through wrappers just to name them.

You must read [details](avoid-hasty-abstractions.md) when the work designs, changes, or reviews abstractions,
extraction, duplication, shared code, helpers, or configuration.

### performance is not optional

- Treat latency and resource use as behavior.
- Estimate request cost before choosing a design.
- State limits for item count, fan-out, bytes, rows, memory, retries, and concurrency.
- Measure the slowest operations, resource saturation, and errors as well as averages.
- Check every blocking resource: CPU, memory, disk, network, pools, locks, queues, and dependencies.
- Treat concurrency as a budget.
- Before overload fills queues, reject new work, drop work, delay it, or reduce service quality.
- Prefer avoiding work over making work faster.
- State each cache's size limit, freshness rules, invalidation rules, and behavior on failure.
- Avoid accidental quadratic work, many small IO calls, unlimited memory use, growing queues, and repeated allocation.

You must read [details](performance-is-not-optional.md) when the work designs, changes, or reviews scale, latency, IO,
batching, concurrency, caching, or memory use.

### tests are code

- Treat tests like production code.
- Add tests only for behavior, contracts, boundaries, regressions, or lasting rules whose failure matters.
- Do not test constants, logger calls, captured log output, type-only wiring, render-only components, pass-through
  wrappers, or framework plumbing.
- Prefer public behavior, boundaries, and interfaces over internals.
- Prefer plain code and data comparisons over elaborate test framework setup.
- Prefer `.test.each` / `.it.each` for repeated data cases.
- Treat tests as defects when they repeat the implementation, duplicate checks, or fail during harmless refactors.
- Avoid complex and long blocks of assertions.
- Prefer parsing test outputs with schemas, or simple, single equality checks.
- Prefer error type or tag checks over error message checks.
- Prefer real code; mock only externals.
- Use integration/E2E tests for real boundary behavior.
- Test what happens when the conditions for success do not hold.
- Use property-based tests only for rules that must keep holding over time.

You must read [details](tests-are-code.md) when adding, changing, or reviewing tests.

### integrated documentation

- Document why, context, decisions, constraints, and contracts.
- Put docs where readers look.
- Choose the document type for the reader's job: tutorial, how-to, reference, or explanation.
- Treat public docs, commands, config snippets, and examples as contracts.
- Prioritize `/** ... */` docs on interfaces.
- Avoid redundant docs covered by names, types, schemas, or tests.
- Prefer one source of truth with links over copied prose.
- Update docs in the same diff as behavior.
- Delete stale docs.

You must read [details](integrated-documentation.md) when adding, changing, or reviewing documentation, comments,
examples, or public contracts.

### fight entropy

- Assume earlier authors meant well but may have worked with different context.
- Do not repeat bad code patterns.
- Leave code cleaner than you found it, but keep changes scoped.
  Bad or outdated tests in the touched area can be deleted.
- Refactor where useful when the change already touches the code.

You must read [details](fight-entropy.md) when the work considers cleanup or weak patterns in code already being
changed.

### states are values

- Use types that cannot represent impossible states.
- Name states while work is in progress (`Pending`, `Settling`, `Retrying`), as well as final states.
- Do not store state you can cheaply derive.

You must read [details](states-are-values.md) when the work designs, changes, or reviews state models, variants, flags,
transitions, or derived state.

### choose paradigm by fit

- Use imperative code when it is clearer or gives needed control or performance.
- Use functional code for most domain and application logic: pure functions, immutable values, composition,
  and explicit effects.
- Use objects when identity, lifecycle, resource ownership, or private mutable state is central.
- When code deserves its own function, use top-level functions for pure, stateless logic.
- Use methods for behavior that depends on instance state, dependencies passed to the constructor,
  lifecycle, or access to private details.
- Do not turn a method into a function by passing half the object as parameters.
- Avoid OO at boundaries; exchange plain data.
- Avoid inheritance; prefer composition and small explicit interfaces.
- Do not require one programming style for every problem.

You must read [details](choose-paradigm-by-fit.md) when the work chooses or reviews functions, classes, mutable state,
FP, OO, or imperative code.

### evolve contracts deliberately

- Treat stored data, external models, public APIs, events, and queues as contracts that must last across changes.
- Know which consumers exist before changing a contract.
- Do not assume backwards compatibility is always required.
- Prefer adding to a contract when compatibility is required.
- Separate schema changes from behavior changes when risk is high.
- Keep old readers/writers in mind during rolling deploys.
- Delete compatibility code once it is no longer needed.

You must read [details](evolve-contracts-deliberately.md) when the work changes or reviews persistent or external
contracts, migrations, or compatibility.

### design for operation

- Make long-running work cancellable where possible.
- Use timeouts, retries, and backpressure deliberately.
- Record enough information to debug failures without reproducing them.
- Prefer logs that help someone act. Cut noise.

You must read [details](design-for-operation.md) when the work designs, changes, or reviews cancellation, timeouts,
retries, backpressure, or observability.
