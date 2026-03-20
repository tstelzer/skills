# Metadata and Registries

## What it is
Ways to attach stable annotations to schemas and retrieve them later through registries.

## When to use
- Schemas need titles, descriptions, IDs, or examples
- Tooling needs to look up metadata independently of parsing
- Several schemas must share a metadata policy

## Quick rules
- Use `z.registry<Meta>()` to define a typed custom registry.
- Use `.register(registry, meta)` to add a schema to a custom registry inline.
- Use `.meta(...)` to add JSON-Schema-friendly metadata via `z.globalRegistry`.
- Use `.describe(text)` as a shorthand for description metadata.
- Use `z.globalRegistry` only when a shared global registry is actually desirable.
- Prefer stable, tool-facing metadata over request-specific runtime state.

## Minimal examples
```ts
import * as z from "zod"

const docsRegistry = z.registry<{ title: string; description: string }>()

const User = z.object({
  id: z.uuid(),
  email: z.email(),
}).register(docsRegistry, {
  title: "User",
  description: "Application user",
})
```

```ts
const Product = z.object({
  sku: z.string(),
}).meta({
  id: "Product",
  title: "Product",
  description: "Product payload",
})
```

## Common pitfalls
- Treating metadata as mutable runtime state
- Mixing incompatible metadata conventions across teams or packages
- Forgetting that JSON Schema export can pull metadata from the global registry
- Putting transport-specific behavior into metadata instead of code

## See also
- `../sections/60-json-schema-metadata.md`
- `json-schema.md`
