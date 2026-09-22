# Unions and Optionality

## What it is
APIs for alternative shapes and absent values: unions, exclusive unions, discriminated unions, intersections,
optional, nullable, and nullish.

## When to use
- A field or payload may take one of several valid forms
- The difference between missing and `null` matters
- You need tagged variants with clear parse behavior

## Quick rules
- Use `.optional()` for `undefined` or omitted values.
- Use `.exactOptional()` for an omitted object key that must reject explicit `undefined`.
- Use `.nullable()` for explicit `null`.
- Use `.nullish()` for `undefined | null`.
- Prefer `z.discriminatedUnion(tag, [...])` when a stable tag field exists.
- Use `z.xor([...])` when exactly one option must match.
- Use `z.getDiscriminatedOption(union, value)` to recover a declared member as its original object schema.
- Prefer object composition or spread over intersections when combining object shapes.

## Minimal examples
```ts
import * as z from "zod"

const Filter = z.object({
  query: z.string().optional(),
  exactQuery: z.string().exactOptional(),
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
const CatSchema = z.getDiscriminatedOption(Pet, "cat")

const Identifier = z.xor([
  z.strictObject({ email: z.email() }),
  z.strictObject({ username: z.string() }),
])
```

## Common pitfalls
- Treating missing values and explicit `null` as interchangeable
- Using `.optional()` when an omitted key must reject explicit `undefined`
- Using a large plain union when a discriminator exists
- Using `z.xor()` with overlapping schemas; it rejects inputs that match more than one option
- Building object merges with intersections and then expecting object helper methods afterward
- Forgetting that union error output can be noisy without a clear discriminant

## See also
- `../sections/30-composition.md`
- `recursive-schemas.md`
- `refinements.md`
