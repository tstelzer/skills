---
name: ts-principles
description: Core engineering principles. Use as a guiding reference for designing, planning and reviewing.
---

## Principles

Read each short form first. Follow every detail-reading requirement whose trigger applies.

### shape code by domain

- Name nouns and verbs precisely.
- Use one internal term for one domain concept.
- Prefer domain language over technical mechanism.
- Structure by domain: `users`, `machines`, `orders` over `components`, `controllers`, `repositories`, `routes`.
- Include mechanism only to mark a real concern boundary (HTTP, persistence, external contract), e.g. `UserRepository` (code), `user.repository.ts` (file). Do not split one concept across `.types.ts` / `.schema.ts` / `.constants.ts` files; keep them in `user.ts`.
- Avoid generic names in broad scopes: `data`, `entity`, `item`, `manager`, `helper`.
- Check existing naming before introducing new terms.
- Translate external names, legacy names, UI labels, and synonyms at boundaries.
- Use abbreviations when they improve local readability.
- Avoid kitchen-sink `utils`. Put extractable library-esque code in `lib`. Co-locate everything else with its domain.

You must read [details](shape-code-by-domain.md) when the work designs, changes, or reviews naming, file placement,
module structure, or feature structure.

### keep boundaries sharp

- Disambiguate concerns across modules.
- Avoid leaking implementation details across boundaries.
- Map external concepts into internal concepts at the edge.
- Prefer explicit dependencies over ambient coupling.
- If two modules change together often, reconsider the boundary.
- Cross data and protocol boundaries with data, not behavior.

You must read [details](keep-boundaries-sharp.md) when the work designs, changes, or reviews dependencies, interfaces,
adapters, integrations, or module boundaries.

### parse, don’t validate

- Parse unknown values at every boundary: IO, HTTP, DB, config, queues, env.
- Prefer type safety over casts and defensive programming.
- Use one schema library consistently.
- Put coercion, extraction, normalization, and domain transforms in the boundary schema when they belong to the type.
- Do not add one-off `parse*` utilities after the boundary. Merge that logic into the schema when possible.
- Treat `parse*` or `validate*` calls inside trusted code as a smell.
- After parsing, rely on types instead of re-checking everywhere.
- Parsing should produce a smaller, trusted type.
- Prefer discriminated unions over optional-property variants.

You must read [details](parse-dont-validate.md) when the work designs, changes, or reviews a boundary that accepts
unknown input.

### privilege is earned

- Treat caller-controlled input, identity, origin, and external systems as untrusted.
- Authenticate identity before using it.
- Authorize every action against the target resource.
- Deny ambiguous access by default.
- Grant the least authority needed for the operation.
- Keep secrets out of source, logs, errors, telemetry, URLs, and clients.
- Return only data the caller is allowed to know.
- Constrain filesystem, network, browser, and third-party capabilities.
- Treat attacker-triggered resource exhaustion as a security bug.

You must read [details](privilege-is-earned.md) when the work designs, changes, or reviews authentication,
authorization, secrets, sensitive data, or dangerous capabilities.

### handle it, or die

- Expected failures are named domain errors, carried by the Effect error channel, `Result`, etc.
- Unexpected defects are bugs. Let them explode.
- Map library errors into domain errors and domain errors into protocol errors at their boundaries.
- Preserve the original cause and useful structured context when mapping an error.
- Forward safe cause messages and context up to the reader's trust boundary.
- Do not reduce a human-facing error to a type, tag, or generic summary.
- Include a corrective action only when it is known to apply.
- Format human-facing errors for their interface.
- Avoid catch-log-rethrow.
- Log unhandled errors exactly once, at the boundary.
- Do not continue after corrupted invariants.
- Do not encode programmer bugs as recoverable business errors.

You must read [details](handle-it-or-die.md) when the work designs, changes, or reviews error types, error messages,
error mapping, error presentation, recovery, catching, or logging.

### avoid hasty abstractions

- Write for the present, not the past or an imagined future.
- Duplicate until a clear pattern repeats.
- Abstract only proven repetition.
- Configuration is an abstraction; only promote what genuinely varies.
- Inline values that are not shared and unlikely to change.
- Keep one-use code inline unless extraction improves the caller and the body.
- Do not extract tiny object builders or pass-through wrappers just to name them.

You must read [details](avoid-hasty-abstractions.md) when the work designs, changes, or reviews abstractions,
extraction, duplication, shared code, helpers, or configuration.

### performance is not optional

- Treat latency and resource use as behavior.
- Model request cost before committing to a shape.
- Name bounds for item count, fan-out, bytes, rows, memory, retries, and concurrency.
- Measure tail latency, saturation, and errors, not only averages.
- Check every blocking resource: CPU, memory, disk, network, pools, locks, queues, and dependencies.
- Treat concurrency as a budget.
- Reject, shed, defer, or degrade before overload fills queues.
- Prefer avoiding work over making work faster.
- Make cache size, freshness, invalidation, and failure mode explicit.
- Avoid accidental quadratic work, chatty IO, unbounded memory, queue growth, and allocation churn.

You must read [details](performance-is-not-optional.md) when the work designs, changes, or reviews scale, latency, IO,
batching, concurrency, caching, or memory use.

### tests are code

- Treat tests like production code.
- Add tests only for behavior, contracts, boundaries, regressions, or stable invariants whose failure matters.
- Do not test constants, type-only wiring, render-only components, pass-through wrappers, or framework plumbing.
- Prefer public behavior, boundaries, and interfaces over internals.
- Prefer plain code and data equality over framework-heavy test machinery.
- Prefer `.test.each` / `.it.each` for repeated data cases.
- Treat tests that restate implementation, duplicate checks, or fail during harmless refactors as defects.
- Avoid complex and long blocks of assertions.
- Prefer parsing test outputs with schemas, or simple, single equality checks.
- Prefer error type or tag checks over error message checks.
- Prefer real code; mock only externals.
- Use integration/E2E tests for real boundary behavior.
- Test counterfactuals.
- Use property-based tests only for durable invariants.

You must read [details](tests-are-code.md) when adding, changing, or reviewing tests.

### integrated documentation

- Document why, context, decisions, constraints, and contracts.
- Put docs where readers look.
- Match the doc shape to the reader's job: tutorial, how-to, reference, or explanation.
- Treat public docs, commands, config snippets, and examples as contracts.
- Prioritize interface docs via `/** ... */`.
- Avoid redundant docs covered by names, types, schemas, or tests.
- Prefer one source of truth and links over duplicated prose.
- Update docs in the same diff as behavior.
- Delete stale docs.

You must read [details](integrated-documentation.md) when adding, changing, or reviewing documentation, comments,
examples, or public contracts.

### fight entropy

- Assume good intent, not good context.
- Avoid perpetuating bad code patterns.
- Leave code cleaner than you found it, but keep changes scoped. Bad or outdated tests in the touched area can be purged.
- Refactor opportunistically when the change already touches the code.

You must read [details](fight-entropy.md) when the work considers cleanup or weak patterns in code already being
changed.

### states are values

- Model impossible states as impossible.
- Name in-flight states (`Pending`, `Settling`, `Retrying`), not only terminal ones.
- Do not store state you can cheaply derive.

You must read [details](states-are-values.md) when the work designs, changes, or reviews state models, variants, flags,
transitions, or derived state.

### choose paradigm by fit

- Use imperative code when it is clearer or when control/performance matters.
- Use FP-style code for most domain/application logic: pure functions, immutable values, composition, and explicit effects.
- Use OO when identity, lifecycle, resource ownership, or encapsulated mutable state is central.
- When extraction is earned, use top-level functions for pure, stateless logic.
- Use methods for behavior that depends on instance state, constructor-injected dependencies, lifecycle, or encapsulation.
- Do not turn a method into a function by passing half the object as parameters.
- Avoid OO at boundaries; exchange plain data.
- Avoid inheritance; prefer composition and small explicit interfaces.
- Do not standardize on one paradigm for all problems.

You must read [details](choose-paradigm-by-fit.md) when the work chooses or reviews functions, classes, mutable state,
FP, OO, or imperative code.

### evolve contracts deliberately

- Treat persistent data, external models, public APIs, events, and queues as long-lived contracts.
- Know which consumers exist before changing a contract.
- Don’t assume backwards compatibility is always required.
- Prefer additive changes when compatibility is required.
- Separate schema changes from behavior changes when risk is high.
- Keep old readers/writers in mind during rolling deploys.
- Delete compatibility code once it is no longer needed.

You must read [details](evolve-contracts-deliberately.md) when the work changes or reviews persistent or external
contracts, migrations, or compatibility.

### design for operation

- Make long-running work cancellable where possible.
- Use timeouts, retries, and backpressure deliberately.
- Emit enough observability to debug failures without reproducing them.
- Prefer actionable logs over noisy logs.

You must read [details](design-for-operation.md) when the work designs, changes, or reviews cancellation, timeouts,
retries, backpressure, or observability.

## Architecture

You must read [TypeScript architecture](architecture/typescript.md) before scaffolding a TypeScript application or
package, adding a domain or feature, changing module boundaries, or adding infrastructure.
