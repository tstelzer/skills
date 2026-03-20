# Objects and Collections

## What it is
Schemas for structured data: objects, arrays, tuples, records, maps, and sets, including unknown-key policy and object derivation helpers.

## When to use
- You are validating JSON-like payloads or nested app state
- You need schema reuse with `pick`, `omit`, `partial`, or `required`
- You need container validation beyond plain objects

## Quick rules
- Use `z.object()` for most object schemas.
- Use `z.strictObject()` when unknown keys should fail.
- Use `z.looseObject()` when unknown keys should be preserved.
- Use `catchall()` when extra keys are allowed but must match a schema.
- Prefer object composition helpers over duplicating shapes by hand.

## Minimal examples
```ts
import * as z from "zod"

const User = z.object({
  id: z.uuid(),
  email: z.email(),
  tags: z.array(z.string()),
})

const StrictUser = z.strictObject({
  id: z.uuid(),
  email: z.email(),
})

const Settings = z.record(z.string(), z.string())
const Point = z.tuple([z.number(), z.number()])
const Ids = z.set(z.uuid())
const Cache = z.map(z.string(), z.number())
```

## Common pitfalls
- Assuming plain `z.object()` rejects unknown keys; by default it strips them
- Using intersections to merge object shapes when object helpers are clearer
- Forgetting that enum-keyed records can be exhaustive and may need `z.partialRecord(...)`
- Repeating the same shape in separate request, patch, and response schemas instead of deriving variants

## See also
- `../topics/object-shape-control.md`
- `../topics/collection-types.md`
- `../topics/special-types.md`
- `30-composition.md`
