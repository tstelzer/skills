# Error Formatting

## What it is
Helpers that reshape `ZodError` into structures better suited for forms, nested UIs, and logs.

## When to use
- UI code needs field-level error structures
- CLI or server logs need readable output
- Nested data requires a tree view instead of a flat issue list

## Quick rules
- Use `z.treeifyError(error)` for nested object and array UIs.
- Use `z.flattenError(error)` for simple forms.
- Use `z.prettifyError(error)` for logs or terminal output.
- Keep raw `issues` available when programmatic consumers need exact metadata.

## Minimal examples
```ts
import * as z from "zod"

const Form = z.object({
  email: z.email(),
  profile: z.object({
    age: z.number().int(),
  }),
})

const result = Form.safeParse(data)
if (!result.success) {
  const tree = z.treeifyError(result.error)
  const flat = z.flattenError(result.error)
  const pretty = z.prettifyError(result.error)
}
```

## Common pitfalls
- Reconstructing field errors by hand from `issues` when a formatter already matches the use case
- Using flattened errors for deeply nested UI trees
- Throwing away raw issue paths before higher-level code has inspected them

## See also
- `../sections/50-errors.md`
- `error-customization.md`
