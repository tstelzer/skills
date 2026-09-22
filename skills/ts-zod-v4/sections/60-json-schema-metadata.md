# JSON Schema and Metadata

## What it is
User-facing Zod features for schema export and attached metadata: registries, `meta`, `describe`, and JSON Schema
conversion.

## When to use
- You want machine-readable schema output for other tools
- You need reusable metadata like titles, examples, or documentation fields
- You are bridging Zod to form builders, OpenAPI helpers, or schema registries

## Quick rules
- Use `.meta(...)` to attach metadata through `z.globalRegistry`.
- Use `.describe(...)` as a short description helper.
- Use `z.registry<Meta>()` when metadata must be queried or managed outside the global registry.
- Use `.register(registry, meta)` when a schema should be added to a custom registry inline.
- Use `z.toJSONSchema()` for supported schemas. Unrepresentable schemas throw by default.
- Use `io: "input"` when a consumer needs the input side instead of the default output side.
- Use `z.fromJSONSchema()` to ingest JSON Schema only when its experimental status is acceptable.

## Minimal examples
```ts
import * as z from "zod"

const User = z.object({
  id: z.uuid(),
  email: z.email(),
}).meta({
  id: "User",
  title: "User",
  description: "Application user",
})

const jsonSchema = z.toJSONSchema(User)
```

```ts
const UserFromJsonSchema = z.fromJSONSchema({
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
  },
  required: ["id"],
})
```

```ts
const Product = z.object({
  sku: z.string(),
}).describe("Product payload")
```

## Common pitfalls
- Assuming every Zod schema can round-trip to JSON Schema
- Treating metadata as inline mutable schema state instead of registry-backed annotations
- Expecting JSON Schema output to preserve transforms or executable refinements
- Treating experimental `z.fromJSONSchema()` as a stable, lossless round trip
- Duplicating metadata conventions instead of using a shared registry policy

## See also
- `../topics/json-schema.md`
- `../topics/metadata-registries.md`
- `40-transforms-codecs.md`
