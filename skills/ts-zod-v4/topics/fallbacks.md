# Fallbacks

## What it is
Fallback-producing helpers for missing or invalid input: `.default()`, `.prefault()`, and `.catch()`.

## When to use
- Missing input should get a default
- Invalid best-effort input should deliberately degrade to a known fallback
- You need fallback behavior that still passes through transforms or coercion

## Quick rules
- Put a field's fallback on its schema. The schema owns the parsed contract.
- `.default(value)` returns the fallback immediately for `undefined` input.
- `.prefault(value)` feeds the fallback into the schema as input.
- `.catch(value)` returns the fallback after any validation failure. Use it only when all failures may degrade.
- Choose the helper based on when the fallback should apply: before parse, during parse, or after failure.
- Do not use `||`, `??`, or a transform callback to create a field default. They hide the input contract and can give
  different meaning to `""`, `0`, `false`, and `null`.
- If the fallback applies only to `undefined`, use `.default()` or `.prefault()`. Model any broader rule explicitly
  before choosing a fallback helper.

## Minimal examples
```ts
import * as z from "zod"

const PortFromString = z.string()
  .trim()
  .regex(z.regexes.integer)
  .pipe(z.coerce.number().int().min(1).max(65535))

const Port = PortFromString.default(3000)
const ParsedPort = PortFromString.prefault("3000")

// Invalid saved UI preferences may degrade to the product default.
const SavedColorScheme = z.enum(["light", "dark", "system"]).catch("system")
```

```ts
const Slug = z.string().trim().toLowerCase().prefault("Untitled Post")
```

```ts
const Request = z.object({
  foo: z.string().default(""),
})

Request.parse({ foo: input.foo })

// Do not do either of these.
// Request.parse({ foo: input.foo || "" })
// z.object({ foo: z.string().optional() }).transform(({ foo }) => ({ foo: foo || "" }))
```

## Common pitfalls
- Expecting `.default()` to run transforms on the fallback
- Using `.default()` with a value that has not independently satisfied the output contract
- Adding a fallback with `||`, `??`, or `.transform()` instead of declaring it on the field schema
- Using `.catch()` where invalid input should actually surface an error
- Hiding bad upstream data with aggressive fallbacks in places that need observability
- Confusing absent input handling with optional or nullable contract design

## See also
- `../sections/40-transforms-codecs.md`
- `string-formats.md`
- `codecs.md`
