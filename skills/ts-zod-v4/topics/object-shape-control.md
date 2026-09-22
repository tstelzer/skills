# Object Shape Control

## What it is
Object-specific helpers for unknown-key handling and schema derivation.

## When to use
- You need a same-contract projection from one object schema
- Unknown keys must be stripped, rejected, preserved, or validated
- You need to derive subsets without duplicating object definitions

## Quick rules
- Plain `z.object()` strips unknown keys.
- Object shapes may declare `unique symbol` keys. Undeclared symbol keys are ignored by every unknown-key policy.
- `z.strictObject()` rejects unknown keys.
- `z.looseObject()` preserves unknown keys.
- `catchall(schema)` validates unknown keys against `schema`.
- Use `pick`, `omit`, `partial`, and `required` only for variants of the same contract.
- Use `.exactPartial()` to make required fields omittable without also accepting explicit `undefined`. Fields that
  were already optional stay optional.
- Use `z.deepPartial()` when every nested object in the same contract should become partial.
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
const UserPatch = UserResponse.exactPartial()
const DeepUserPatch = z.deepPartial(UserResponse)

const Bag = z.object({ id: z.string() }).catchall(z.string())

const Tag = Symbol("tag")
const Tagged = z.object({ name: z.string(), [Tag]: z.number() })
```

## Common pitfalls
- Assuming `z.object()` preserves extras; it strips them
- Assuming `strictObject` rejects undeclared symbol keys; Zod ignores them
- Chaining `.extend()` repeatedly on large schemas instead of spreading or deriving more directly
- Extending a refined schema unsafely when `safeExtend()` is available
- Deriving independent boundary contracts from one schema because their current fields happen to match
- Using `.partial()` for a patch without checking whether an empty patch is valid
- Using `.partial()` when `exactOptionalPropertyTypes` semantics require explicit `undefined` to fail
- Forgetting that `z.deepPartial()` turns a discriminated union into a plain union
- Calling `.partial()`, `.exactPartial()`, or `z.deepPartial()` on an object with its own refinement; use
  `safeExtend()` or redesign the derivation

## See also
- `../sections/20-objects-collections.md`
- `collection-types.md`
- `unions-and-optionality.md`
