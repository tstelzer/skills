# Codecs

## What it is
Bidirectional schemas that decode one representation into another and can encode back again.

## When to use
- You need runtime parsing and reverse serialization
- Input and output types differ in both directions
- One-way transforms are not enough

## Quick rules
- Use `z.codec(inputSchema, outputSchema, { decode, encode })`.
- Use `.parse()` or `z.decode(...)` for input-to-output conversion.
- Use `z.encode(...)` for output-to-input conversion.
- Do not throw from `decode` or `encode`. Report conversion errors through the codec context.
- Narrow both schemas so every successful value is representable in the opposite direction.
- Make round trips exact, or name and document the canonical representation when normalization is intentional.

## Minimal examples
```ts
import * as z from "zod"

const YesNo = z.codec(z.enum(["yes", "no"]), z.boolean(), {
  decode: (value) => value === "yes",
  encode: (value) => value ? "yes" : "no",
})

const enabled = z.decode(YesNo, "yes")
const wireValue = z.encode(YesNo, false)
```

## Useful codecs
Copy these patterns into the application and keep the input and output schemas narrow.

```ts
const User = z.object({ name: z.string(), age: z.number() })

const UserJson = z.codec(z.string(), User, {
  decode: (jsonString, ctx) => {
    try {
      return JSON.parse(jsonString)
    } catch {
      ctx.issues.push({
        code: "invalid_format",
        format: "json",
        input: jsonString,
        message: "Invalid JSON",
      })
      return z.NEVER
    }
  },
  encode: (value) => JSON.stringify(value),
})

const user = UserJson.decode('{"name":"Alice","age":30}')
const json = UserJson.encode({ name: "Bob", age: 25 })
```

```ts
const CanonicalIntString = z.string()
  .regex(/^(?:0|-[1-9]\d*|[1-9]\d*)$/)
  .refine((value) => Number.isSafeInteger(Number(value)), {
    error: "Integer is outside the safe range",
  })

const StringToInt = z.codec(CanonicalIntString, z.int(), {
  decode: (value) => Number(value),
  encode: (value) => value.toString(),
})

const EpochMillisToDate = z.codec(
  z.int().min(0).max(8_640_000_000_000_000),
  z.date().min(new Date(0)).max(new Date(8_640_000_000_000_000)),
  {
    decode: (value) => new Date(value),
    encode: (value) => value.getTime(),
  }
)
```

```ts
const Base64ToBytes = z.codec(z.base64(), z.instanceof(Uint8Array), {
  decode: (value) => z.util.base64ToUint8Array(value),
  encode: (value) => z.util.uint8ArrayToBase64(value),
})
```

## Common pitfalls
- Using one-way transforms when code also needs serialization back to the wire format
- Making a generic JSON codec accept schemas whose output `JSON.stringify` cannot encode
- Accepting values on either side that the opposite codec function cannot represent
- Hiding precision loss or normalization instead of declaring a canonical representation
- Making `decode` and `encode` disagree about the contract
- Mixing side effects into codec functions
- Assuming JSON Schema export can represent codec behavior

## See also
- `../sections/40-transforms-codecs.md`
- `json-schema.md`
- `string-formats.md`
