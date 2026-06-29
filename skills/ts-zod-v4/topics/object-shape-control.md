# Object Shape Control

## What it is
Object-specific helpers for unknown-key handling and schema derivation.

## When to use
- You need patch, create, and response variants from one base object
- Unknown keys must be stripped, rejected, preserved, or validated
- You need to derive subsets without duplicating object definitions

## Quick rules
- Plain `z.object()` strips unknown keys.
- `z.strictObject()` rejects unknown keys.
- `z.looseObject()` preserves unknown keys.
- `catchall(schema)` validates unknown keys against `schema`.
- Use `pick`, `omit`, `partial`, and `required` to derive variants.
- Prefer `safeExtend()` when extending schemas that already include refinements.

## Minimal examples
```ts
import * as z from "zod"

const User = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string().min(1),
})

const CreateUser = User.omit({ id: true })
const UpdateUser = CreateUser.partial()
const PublicUser = User.pick({ id: true, name: true })

const StrictUser = z.strictObject({
  id: z.uuid(),
  email: z.email(),
})

const Bag = z.object({ id: z.string() }).catchall(z.string())
```

## Common pitfalls
- Assuming `z.object()` preserves extras; it strips them
- Chaining `.extend()` repeatedly on large schemas instead of spreading or deriving more directly
- Extending a refined schema unsafely when `safeExtend()` is available
- Rewriting nearly identical object shapes by hand instead of deriving them

## See also
- `../sections/20-objects-collections.md`
- `collection-types.md`
- `unions-and-optionality.md`
