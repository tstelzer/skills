# Primitives

## What it is
Primitive and scalar schemas: strings, numbers, booleans, bigints, dates, enums, literals, plus permissive or impossible schemas like `unknown`, `any`, and `never`.

## When to use
- You are validating leaf values
- You need string or number constraints before composing larger object schemas
- You need fixed value sets through literals or enums

## Quick rules
- Prefer the narrowest schema that matches the contract.
- Use dedicated top-level string format helpers like `z.email()` and `z.uuid()` for standard formats.
- Use `z.enum([...])` for closed sets of string values.
- Use `optional`, `nullable`, and `nullish` deliberately; they mean different wire contracts.
- Use `z.coerce.*` only when accepting loosely typed input at a boundary.

## Minimal examples
```ts
import * as z from "zod"

const Name = z.string().min(1).max(100)
const Age = z.number().int().min(0)
const Enabled = z.boolean()
const CreatedAt = z.date()
const Status = z.enum(["draft", "published", "archived"])
const Mode = z.literal("admin")

const LooseAge = z.coerce.number().int().min(0)
```

```ts
const MaybeName = z.string().optional()
const NullableName = z.string().nullable()
const NullishName = z.string().nullish()
```

## Common pitfalls
- Using `z.coerce.*` deep inside business logic instead of at the input boundary
- Modeling enums with broad strings when the value set is known
- Forgetting that `z.date()` expects a `Date` instance, not an ISO string
- Choosing `optional()` when the contract actually allows explicit `null`

## See also
- `../topics/string-formats.md`
- `../topics/unions-and-optionality.md`
- `../topics/fallbacks.md`
- `00-basics.md`
