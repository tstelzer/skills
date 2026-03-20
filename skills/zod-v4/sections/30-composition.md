# Composition

## What it is
Schema composition beyond leaf values: unions, discriminated unions, intersections, optionality wrappers, recursive shapes, and custom refinements.

## When to use
- One value may take several shapes
- A model references itself
- Built-in validators are not enough and you need domain rules

## Quick rules
- Prefer `z.discriminatedUnion()` when variants share a stable tag field.
- Use `.optional()`, `.nullable()`, and `.nullish()` to model wire semantics explicitly.
- Prefer object helpers or shape spread for object composition before reaching for intersections.
- Keep refinements domain-focused; use base schema methods for generic type or shape checks.

## Minimal examples
```ts
import * as z from "zod"

const Success = z.object({ kind: z.literal("ok"), data: z.string() })
const Failure = z.object({ kind: z.literal("error"), message: z.string() })

const Result = z.discriminatedUnion("kind", [Success, Failure])

const Filter = z.object({
  query: z.string().optional(),
  cursor: z.string().nullable(),
})
```

```ts
const Password = z.string().min(12).refine((value) => /\d/.test(value), {
  error: "Password must include a digit",
})
```

## Common pitfalls
- Using a plain union when a discriminator exists and would make errors clearer
- Using intersections to bolt object shapes together and then losing object-specific helpers
- Writing custom refinements for constraints already covered by built-in methods
- Forgetting async parse APIs when a refinement is async

## See also
- `../topics/unions-and-optionality.md`
- `../topics/recursive-schemas.md`
- `../topics/refinements.md`
- `20-objects-collections.md`
- `40-transforms-codecs.md`
