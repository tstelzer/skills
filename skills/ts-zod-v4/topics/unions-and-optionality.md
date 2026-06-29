# Unions and Optionality

## What it is
APIs for alternative shapes and absent values: unions, discriminated unions, intersections, optional, nullable, and nullish.

## When to use
- A field or payload may take one of several valid forms
- The difference between missing and `null` matters
- You need tagged variants with clear parse behavior

## Quick rules
- Use `.optional()` for `undefined` or omitted values.
- Use `.nullable()` for explicit `null`.
- Use `.nullish()` for `undefined | null`.
- Prefer `z.discriminatedUnion(tag, [...])` when a stable tag field exists.
- Prefer object composition or spread over intersections when combining object shapes.

## Minimal examples
```ts
import * as z from "zod"

const Filter = z.object({
  query: z.string().optional(),
  cursor: z.string().nullable(),
  locale: z.string().nullish(),
})

const JsonValue = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
])
```

```ts
const Cat = z.object({ kind: z.literal("cat"), lives: z.number().int() })
const Dog = z.object({ kind: z.literal("dog"), breed: z.string() })
const Pet = z.discriminatedUnion("kind", [Cat, Dog])
```

## Common pitfalls
- Treating missing values and explicit `null` as interchangeable
- Using a large plain union when a discriminator exists
- Building object merges with intersections and then expecting object helper methods afterward
- Forgetting that union error output can be noisy without a clear discriminant

## See also
- `../sections/30-composition.md`
- `recursive-schemas.md`
- `refinements.md`
