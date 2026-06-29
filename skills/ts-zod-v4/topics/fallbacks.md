# Fallbacks

## What it is
Fallback-producing helpers for missing or invalid input: `.default()`, `.prefault()`, and `.catch()`.

## When to use
- Missing input should get a default
- Invalid input should degrade to a known fallback
- You need fallback behavior that still passes through transforms or coercion

## Quick rules
- `.default(value)` returns the fallback immediately for `undefined` input.
- `.prefault(value)` feeds the fallback into the schema as input.
- `.catch(value)` returns the fallback after a validation failure.
- Choose the helper based on when the fallback should apply: before parse, during parse, or after failure.

## Minimal examples
```ts
import * as z from "zod"

const Port = z.coerce.number().int().min(1).max(65535).default(3000)
const ParsedPort = z.coerce.number().int().min(1).max(65535).prefault("3000")
const SafePort = z.coerce.number().int().catch(3000)
```

```ts
const Slug = z.string().trim().toLowerCase().prefault("Untitled Post")
```

## Common pitfalls
- Expecting `.default()` to run transforms on the fallback
- Using `.catch()` where invalid input should actually surface an error
- Hiding bad upstream data with aggressive fallbacks in places that need observability
- Confusing absent input handling with optional or nullable contract design

## See also
- `../sections/40-transforms-codecs.md`
- `string-formats.md`
- `codecs.md`
