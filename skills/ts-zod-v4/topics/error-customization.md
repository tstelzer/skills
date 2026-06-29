# Error Customization

## What it is
How to control validation messages and issue text at schema definition time or per parse call.

## When to use
- Default issue messages are not good enough for the product
- Messages need request or locale context
- A schema should carry reusable human-facing validation text

## Quick rules
- Use the `error` option on schemas and checks for reusable messages.
- Use per-parse customization when context only exists at the call site.
- Keep schema messages stable and product-oriented.
- Prefer discriminated unions and path-aware issues before writing elaborate custom error maps.

## Minimal examples
```ts
import * as z from "zod"

const Username = z.string().min(3, {
  error: "Username must have at least 3 characters",
})

Username.safeParse("ab", {
  error: () => "Request-specific username validation failed",
})
```

## Common pitfalls
- Centralizing all messages globally and losing local intent
- Returning vague generic messages for field-specific problems
- Treating message customization as a substitute for clearer schema design
- Forgetting that parse-time customization should stay close to the boundary where context exists

## See also
- `../sections/50-errors.md`
- `error-formatting.md`
- `refinements.md`
