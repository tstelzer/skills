# Transforms and Codecs

## What it is
APIs that change values during parsing or bridge between input and output representations: preprocess, transform, pipe, defaults, prefaults, catch, and codecs.

## When to use
- Input arrives in a loose representation and must become a stricter one
- You need schema composition across multiple parse stages
- You need bidirectional decode and encode logic

## Quick rules
- Use `z.preprocess()` to normalize raw input before validation.
- Use `.transform()` to derive a new output value after validation.
- Use `.pipe()` to validate the output of one schema with another schema.
- Use `.default()` for an `undefined` shortcut at the input boundary.
- Use `.prefault()` when the fallback itself should still flow through the schema pipeline.
- Use `.catch()` when parse failure should return a fallback value.
- Use `z.codec()` when you need both decode and encode, not just one-way parsing.

## Minimal examples
```ts
import * as z from "zod"

const IntFromUnknown = z.preprocess((value) => {
  if (typeof value === "string") return Number(value.trim())
  return value
}, z.number().int())

const Slug = z.string().trim().toLowerCase().transform((value) => value.replace(/\s+/g, "-"))

const NonEmptySlug = z.string().trim().pipe(z.string().min(1))
```

```ts
const Port = z.coerce.number().int().min(1).max(65535).default(3000)
const PortWithParsing = z.coerce.number().int().min(1).max(65535).prefault("3000")
const MaybePort = z.coerce.number().int().catch(3000)
```

## Common pitfalls
- Using `.default()` when you actually need the fallback to be transformed or validated
- Returning invalid output from `.transform()` and assuming later code will catch it
- Using transforms for bidirectional data flow when a codec is the correct abstraction
- Stacking many transforms when a clearer `preprocess -> base schema -> pipe` split is available

## See also
- `../topics/fallbacks.md`
- `../topics/codecs.md`
- `../topics/refinements.md`
- `00-basics.md`
- `50-errors.md`
