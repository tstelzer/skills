# Transforms and Codecs

## What it is
APIs that change values during parsing or bridge between input and output representations: preprocess, transform, pipe, defaults, prefaults, catch, and codecs.

## When to use
- Input arrives in a loose representation and must become a stricter one
- You need several schema stages in one boundary parse pipeline
- You need bidirectional decode and encode logic

## Quick rules
- Keep `z.preprocess()` callbacks total. Normalize raw input without parsing or throwing.
- Keep `.transform()` callbacks total. Derive a value without parsing, throwing, or reporting validation failure.
- Use `.pipe()` to validate the output of one schema with another schema.
- Compose the full pipeline first, then call `parse` or `safeParse` once at the boundary.
- Use `.default()` for an `undefined` shortcut at the input boundary.
- Use `.prefault()` when the fallback itself should still flow through the schema pipeline.
- Use `.catch()` only when every parse failure may deliberately degrade to one fallback value.
- Do not create field defaults with `||`, `??`, or `.transform()`. Declare them on the field schema with `.default()`
  or `.prefault()`.
- Use `z.codec()` when you need both decode and encode, not just one-way parsing.

## Minimal examples
```ts
import * as z from "zod"

const IntFromString = z.string()
  .trim()
  .regex(z.regexes.integer)
  .pipe(z.coerce.number().int())

const Slug = z.string().trim().toLowerCase().transform((value) => value.replace(/\s+/g, "-"))

const NonEmptySlug = z.string().trim().pipe(z.string().min(1))
```

```ts
const PortFromString = z.string()
  .trim()
  .regex(z.regexes.integer)
  .pipe(z.coerce.number().int().min(1).max(65535))

const Port = PortFromString.default(3000)
const PortWithParsing = PortFromString.prefault("3000")
const SavedColorScheme = z.enum(["light", "dark", "system"]).catch("system")
```

## Common pitfalls
- Using `.default()` when you actually need the fallback to be transformed or validated
- Defaulting a field at the parse call or in `.transform()` instead of its schema
- Calling `parse`, `safeParse`, or another fallible operation inside preprocess or transform code
- Parsing a transformed value again instead of piping the output schema into the boundary pipeline
- Returning invalid output from `.transform()` and assuming later code will catch it
- Using transforms for bidirectional data flow when a codec is the correct abstraction
- Stacking many transforms when a clearer `preprocess -> base schema -> pipe` split is available

## See also
- `../topics/fallbacks.md`
- `../topics/codecs.md`
- `../topics/refinements.md`
- `00-basics.md`
- `50-errors.md`
