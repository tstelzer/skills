# Special Types

## What it is
Less-common but user-facing schemas and utilities for runtime-specific values and specialized contracts.

## When to use
- You need to validate browser `File` values
- A value must be an instance of a runtime class
- You need branded or readonly outputs
- A function contract or custom runtime predicate is part of the boundary

## Quick rules
- Use `z.file()` for browser `File` objects and file constraints.
- Use `z.instanceof(Class)` when runtime class identity matters.
- Use `z.property(key, schema)` to validate a property on an existing runtime value.
- Use `z.json()` when any JSON-encodable value is allowed.
- Use `z.custom()` for types Zod does not model directly.
- Use branded schemas to mark validated domain values in TypeScript.
- Use readonly wrappers when parsed output should be treated immutably.
- Treat `z.function()` as a function-validation utility, not a normal Zod schema.
- Prefer ordinary object schemas over `instanceof` when structural validation is enough.

## Minimal examples
```ts
import * as z from "zod"

const Avatar = z.file().max(2_000_000).mime(["image/png", "image/jpeg"])
const ErrorLike = z.instanceof(Error)
const SecureUrl = z.instanceof(URL).check(
  z.property("protocol", z.literal("https:"))
)
const JsonPayload = z.json()
const OrderId = z.uuid().brand<"OrderId">()
const ReadonlyUser = z.object({
  id: z.uuid(),
  email: z.email(),
}).readonly()
```

```ts
const Handler = z.function({
  input: [z.string()],
  output: z.number(),
})

const trimAndMeasure = Handler.implement((value) => value.trim().length)
```

## Common pitfalls
- Using `instanceof` where plain object validation would be more portable
- Expecting `z.file()` to work in environments without the corresponding runtime type
- Treating brands as runtime guarantees; they are TypeScript-only markers on validated values
- Treating `z.function()` as a general app architecture tool instead of a boundary check

## See also
- `../sections/20-objects-collections.md`
- `../sections/40-transforms-codecs.md`
- `json-schema.md`
