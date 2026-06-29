# JSON Schema

## What it is
Conversion from Zod schemas to JSON Schema, with options for representing input or output shapes.

## When to use
- Another tool needs JSON Schema instead of executable Zod schemas
- You want schema export for forms, docs, or interop

## Quick rules
- Use `z.toJSONSchema(schema)` for default export.
- Use the `io` option when input and output differ and the consumer needs one side specifically.
- Expect unrepresentable features like transforms or executable refinement behavior to be lost or rejected.
- Treat JSON Schema as a projection of the Zod schema, not a full substitute.

## Minimal examples
```ts
import * as z from "zod"

const User = z.object({
  id: z.uuid(),
  email: z.email(),
})

const schema = z.toJSONSchema(User)
```

```ts
const Port = z.coerce.number().int()

const inputSchema = z.toJSONSchema(Port, { io: "input" })
const outputSchema = z.toJSONSchema(Port, { io: "output" })
```

## Common pitfalls
- Expecting JSON Schema output to preserve transforms, codecs, or procedural refinements
- Forgetting that input and output views may diverge after coercion or transforms
- Using JSON Schema export as a reason to avoid Zod-native modeling where runtime validation is still needed

## See also
- `../sections/60-json-schema-metadata.md`
- `metadata-registries.md`
- `codecs.md`
