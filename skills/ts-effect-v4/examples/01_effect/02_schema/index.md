## Defining schemas and domain models

Use `Schema` for untrusted boundaries and domain values that need a runtime
contract. Keep trusted internal-only shapes as plain TypeScript types when they
do not need decoding, encoding, validation, or generated tooling.

Decode unknown input once at the boundary. Pass the decoded value inward. Do
not replace a schema with predicates or manual parsing.

### Route by task

- `10_schema-basics.ts`: `Type`, `Encoded`, decoding, encoding, and typed
  boundary errors.
- `20_primitives-composition.ts`: primitives, literals, structs, tuples,
  arrays, records, key handling, and template literals.
- `25_deriving-schemas.ts`: deriving structs, tuples, and unions without
  copying definitions.
- `30_optional-defaults.ts`: missing keys, `undefined`, `null`, `Option`,
  decoding defaults, and constructor defaults.
- `40_unions-recursion.ts`: unions, tagged unions, matching, and recursive
  schemas.
- `50_validation-constructors.ts`: filters, refinements, brands, effectful
  validation, and constructors.
- `60_transformations-codecs.ts`: decoded versus encoded forms,
  transformations, composition, key remapping, and flipping.
- `65_context-middleware.ts`: separate decode and encode requirements,
  service-backed parsing, and deliberate fallbacks.
- `70_classes-errors.ts`: opaque types, classes, tagged classes, native
  classes, and schema-backed errors.
- `80_serialization-sensitive.ts`: JSON, string trees, forms, URL parameters,
  binary encodings, XML, and redacted values.
- `90_tooling-errors.ts`: annotations, error formatting, JSON Schema,
  arbitraries, equivalence, optics, and JSON Patch.

### Boundary rules

- Keep `Type` and `Encoded` distinct. `Type` is the decoded domain value;
  `Encoded` is the external representation.
- Use `decodeUnknown*` for untrusted input. Use `decode*` only when the input is
  already typed as `Encoded`.
- Use Effect-returning parsers inside Effect workflows. Reserve throwing sync
  parsers for boundaries where throwing is the intended contract.
- Reuse parser functions instead of rebuilding them for each request or item.
- Decide excess-key behavior. The default discards unexpected keys; pass
  `onExcessProperty: "error"` or `"preserve"` when the contract requires it.
- Preserve missing, empty, malformed, and partial states when callers respond
  differently. Do not hide those states behind defaults or fallbacks.
- Do not normalize opaque values without a contract. `Redacted` prevents
  disclosure; it does not authorize `trim()`, case folding, or other changes.
- A codec may require different services for decoding and encoding. Keep both
  requirements visible until the boundary provides them.

### Coverage boundary

This section covers the main public application-facing Schema API. It does not
catalog every built-in filter or string encoding because they follow the same
composition patterns shown here. It also omits Schema AST internals, the
15-parameter internal type hierarchy, representation revivers, custom
`declareConstructor` implementations, and framework-specific form and Elysia
integrations. Use those only when the task requires that lower-level extension
point or names that integration.
