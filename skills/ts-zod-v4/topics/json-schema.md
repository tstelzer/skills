# JSON Schema

## What it is
Conversion in both directions between Zod schemas and JSON Schema.

## When to use
- Another tool needs JSON Schema instead of executable Zod schemas
- Existing JSON Schema must be parsed by Zod
- You want schema export for forms, docs, or interop

## Quick rules
- Use `z.toJSONSchema(schema)` for default export.
- Export uses the schema output side by default. Use `io: "input"` when the consumer needs the input side.
- Choose `target` when the consumer requires Draft 4, Draft 7, Draft 2020-12, or OpenAPI 3.0.
- Unrepresentable schemas such as transforms, dates, maps, and sets throw by default. Use `unrepresentable` only when
  replacing or dropping them is deliberate.
- Recursive schemas become `$ref` by default. Use `cycles: "throw"` when references are not acceptable.
- Use `z.fromJSONSchema()` for ingestion, but treat it as experimental and not as a lossless inverse.
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
const ImportedUser = z.fromJSONSchema({
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    email: { type: "string", format: "email" },
  },
  required: ["id", "email"],
  additionalProperties: false,
})
```

```ts
const Port = z.string()
  .regex(z.regexes.integer)
  .pipe(z.coerce.number().int())

const inputSchema = z.toJSONSchema(Port, { io: "input" })
const outputSchema = z.toJSONSchema(Port, { io: "output" })
```

## Common pitfalls
- Expecting JSON Schema output to preserve transforms, codecs, or procedural refinements
- Forgetting that input and output views may diverge after coercion or transforms
- Assuming `z.fromJSONSchema()` supports every keyword or recreates the original Zod schema
- Silently converting unrepresentable schemas to `{}` and weakening the exported contract
- Using JSON Schema export as a reason to avoid Zod-native modeling where runtime validation is still needed

## See also
- `../sections/60-json-schema-metadata.md`
- `metadata-registries.md`
- `codecs.md`
