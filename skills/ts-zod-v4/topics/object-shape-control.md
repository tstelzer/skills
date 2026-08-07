# Object Shape Control

## What it is
Object-specific helpers for unknown-key handling and schema derivation.

## When to use
- You need a same-contract projection from one object schema
- Unknown keys must be stripped, rejected, preserved, or validated
- You need to derive subsets without duplicating object definitions

## Quick rules
- Plain `z.object()` strips unknown keys.
- `z.strictObject()` rejects unknown keys.
- `z.looseObject()` preserves unknown keys.
- `catchall(schema)` validates unknown keys against `schema`.
- Use `pick`, `omit`, `partial`, and `required` only for variants of the same contract.
- Define request, domain, persistence, and response contracts independently and map between them.
- Prefer `safeExtend()` when extending schemas that already include refinements.

## Minimal examples
```ts
import * as z from "zod"

const CreateUserRequest = z.strictObject({
  email: z.email(),
  name: z.string().min(1),
})

const UpdateUserRequest = z.strictObject({
  email: z.email().optional(),
  name: z.string().min(1).optional(),
}).refine((value) => value.email !== undefined || value.name !== undefined, {
  error: "Provide at least one field to update",
})

const UserResponse = z.strictObject({
  id: z.uuid(),
  name: z.string(),
})

const UserSummaryResponse = UserResponse.pick({ id: true })

const Bag = z.object({ id: z.string() }).catchall(z.string())
```

## Common pitfalls
- Assuming `z.object()` preserves extras; it strips them
- Chaining `.extend()` repeatedly on large schemas instead of spreading or deriving more directly
- Extending a refined schema unsafely when `safeExtend()` is available
- Deriving independent boundary contracts from one schema because their current fields happen to match
- Using `.partial()` for a patch without checking whether an empty patch is valid

## See also
- `../sections/20-objects-collections.md`
- `collection-types.md`
- `unions-and-optionality.md`
