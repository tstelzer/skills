# Objects and Collections

## What it is
Schemas for structured data: objects, arrays, tuples, records, maps, and sets, including unknown-key policy and object
derivation helpers.

## When to use
- You are validating JSON-like payloads or nested app state
- You need a same-contract variant with `pick`, `omit`, `partial`, or `required`
- You need container validation beyond plain objects

## Quick rules
- Use `z.object()` for most object schemas.
- Use `z.strictObject()` when unknown keys should fail.
- Use `z.looseObject()` when unknown keys should be preserved.
- Use `catchall()` when extra keys are allowed but must match a schema.
- Use object composition helpers when both schemas represent the same contract.
- Use `.exactPartial()` to make required fields omittable without also accepting explicit `undefined`.
- Use `z.deepPartial()` only when every nested object in the same contract should become partial.

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

const ExactPatch = StrictUser.exactPartial()
const DeepPatch = z.deepPartial(User)
```

## Common pitfalls
- Assuming plain `z.object()` rejects unknown keys; by default it strips them
- Using intersections to merge object shapes when object helpers are clearer
- Forgetting that enum-keyed records can be exhaustive and may need `z.partialRecord(...)`
- Deriving request, patch, domain, and response schemas from one base even though they are independent contracts
- Using `.partial()` when explicit `undefined` must be rejected
- Applying `z.deepPartial()` to a model whose nested objects are separate contracts

## See also
- `../topics/object-shape-control.md`
- `../topics/collection-types.md`
- `../topics/special-types.md`
- `30-composition.md`
