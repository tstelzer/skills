# Basics

## What it is
Core Zod workflow: define a schema, parse untrusted input, and derive static types from the same schema.

## When to use
- You need runtime validation for external or untrusted data
- You want TypeScript types derived from the validation contract
- You need a first entry point before choosing more specific APIs

## Quick rules
- Prefer one schema as the source of truth for both validation and typing.
- Use `parse()` when failure should throw.
- Use `safeParse()` when failure is part of normal control flow.
- Use `parseAsync()` or `safeParseAsync()` if any nested refinement or transform is async.
- Use `z.input<typeof Schema>` for pre-parse type, `z.output<typeof Schema>` for post-parse type.

## Minimal examples
```ts
import * as z from "zod"

const User = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  age: z.number().int().nonnegative().optional(),
})

type UserInput = z.input<typeof User>
type User = z.output<typeof User>

const parsed = User.parse(data)

const result = User.safeParse(data)
if (!result.success) {
  console.error(result.error.issues)
}
```

```ts
const TrimmedInt = z.preprocess((value) => {
  if (typeof value === "string") return Number(value.trim())
  return value
}, z.number().int())

type Before = z.input<typeof TrimmedInt>
type After = z.output<typeof TrimmedInt>
```

## Common pitfalls
- Using `z.infer` when input and output types differ after transforms or coercion
- Calling sync parse APIs on schemas with async refinements or transforms
- Parsing trusted in-process values repeatedly instead of validating once at the boundary
- Treating `.optional()` as the same thing as `.nullable()` or `.nullish()`

## See also
- `10-primitives.md`
- `20-objects-collections.md`
- `30-composition.md`
- `40-transforms-codecs.md`
- `50-errors.md`
