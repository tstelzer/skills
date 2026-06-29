# Refinements

## What it is
Custom validation on top of the base schema when built-in methods are not enough.

## When to use
- The rule is domain-specific
- Validation depends on multiple fields or extra checks
- You need to emit custom issues

## Quick rules
- Prefer built-in validators first; refine only for domain logic.
- Use `.refine()` for a simple pass/fail predicate.
- Use `.superRefine()` when you need to add multiple issues or target specific paths.
- Use `.check()` for lower-level issue control when needed.
- Refinement functions should report failure, not throw.
- If refinement is async, parse with async APIs.

## Minimal examples
```ts
import * as z from "zod"

const Password = z.string().min(12).refine((value) => /\d/.test(value), {
  error: "Password must include a digit",
})
```

```ts
const Signup = z.object({
  password: z.string().min(12),
  confirmPassword: z.string(),
}).superRefine((value, ctx) => {
  if (value.password !== value.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match",
    })
  }
})
```

## Common pitfalls
- Duplicating checks that built-in methods already express better
- Attaching cross-field validation to individual fields instead of the enclosing object
- Throwing inside refinement logic instead of reporting issues
- Forgetting to use async parse APIs for async refinement work

## See also
- `../sections/30-composition.md`
- `error-customization.md`
- `error-formatting.md`
