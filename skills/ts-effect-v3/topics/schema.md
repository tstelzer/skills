# Schema

## What it is

`Schema<A, I, R>` describes a decoded domain type `A`, an encoded boundary type
`I`, and the Effect requirements `R` needed to parse it.

Use Schema for untrusted boundaries and domain values that need decoding,
encoding, validation, or generated tooling. Keep trusted internal-only shapes
as plain TypeScript types.

## Route by task

- `schema-basics.md`: decoded and encoded types, decoding, and encoding
- `schema-primitives.md`: primitives, structs, tuples, records, and templates
- `schema-deriving.md`: derive related schemas without copying fields
- `schema-optional-defaults.md`: absence, `undefined`, `null`, `Option`, defaults
- `schema-unions-recursion.md`: unions, discriminators, matching, recursion
- `schema-validation.md`: filters, brands, effectful checks, constructors
- `schema-transformations.md`: transformations, composition, key remapping
- `schema-context.md`: service-backed parsing and visible requirements
- `schema-classes-errors.md`: classes, tagged models, errors, requests
- `schema-serialization.md`: JSON, binary encodings, redacted values
- `schema-tooling-errors.md`: error formatting, metadata, generated tooling

## Boundary rules

- Keep `Schema.Schema.Type<S>` and `Schema.Schema.Encoded<S>` distinct.
- Use `decodeUnknown*` for untrusted input. Use `decode*` only for input already
  typed as the encoded representation.
- Use Effect-returning parsers inside Effect workflows. Use throwing parsers
  only where throwing is the boundary contract.
- Build parser functions once and reuse them.
- Decide excess-key behavior. Struct decoders discard unexpected keys by
  default. Set `onExcessProperty` when the contract requires rejection or
  preservation.
- Preserve missing, empty, malformed, and partial states when callers respond
  differently.
- Do not normalize secrets, tokens, signatures, or arbitrary output without an
  explicit contract. `Redacted` prevents disclosure. It does not authorize
  changing the value.
- Keep parsing requirements in the schema type until the application boundary
  provides them.

## Coverage boundary

These files cover application-facing Schema APIs. For Schema AST extensions,
custom declarations, or package-specific integrations, inspect the reference
repository only when the task requires that extension point.

## See also

- `../sections/00-foundations.md`
- `../sections/30-http-server.md`
- `request-resolver.md`
- `sql-resolver-schema.md`
