# Errors

## What it is
How Zod reports validation failure: `ZodError`, issue arrays, error customization, and formatting helpers for logs, APIs, and UIs.

## When to use
- You need structured validation failures instead of thrown exceptions only
- You want user-facing messages or form field errors
- You need to customize messages near the schema or at parse time

## Quick rules
- Prefer `safeParse()` when validation failure is expected or recoverable.
- Use schema-level `error` customization for reusable rules.
- Use per-parse error customization for request-specific context.
- Format errors for the consumer: tree for nested UIs, flatten for forms, pretty for logs and CLIs.

## Minimal examples
```ts
import * as z from "zod"

const Login = z.object({
  email: z.email(),
  password: z.string().min(8),
})

const result = Login.safeParse(data)
if (!result.success) {
  console.error(result.error.issues)
  console.error(z.flattenError(result.error))
}
```

```ts
const Password = z.string().min(12, {
  error: "Password must be at least 12 characters",
})
```

## Common pitfalls
- Throwing parse errors for ordinary request validation flows
- Rebuilding custom error trees manually instead of using Zod's formatters
- Overusing global error customization when schema-local messages are clearer
- Assuming all union errors are easy to read without discriminators

## See also
- `../topics/error-customization.md`
- `../topics/error-formatting.md`
- `30-composition.md`
