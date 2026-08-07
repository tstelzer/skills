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
- Keep codecs pure and symmetric where possible.

## Minimal examples
```ts
import * as z from "zod"

const IsoDateCodec = z.codec(
  z.iso.datetime(),
  z.date(),
  {
    decode: (value) => new Date(value),
    encode: (value) => value.toISOString(),
  }
)

const createdAt = z.decode(IsoDateCodec, "2026-03-20T12:00:00.000Z")
const wireValue = z.encode(IsoDateCodec, new Date())
```

## Useful codecs
Copy these patterns into the application and keep the input and output schemas narrow.

```ts
const jsonCodec = <T extends z.core.$ZodType>(schema: T) =>
  z.codec(z.string(), schema, {
    decode: (jsonString, ctx) => {
      try {
        return JSON.parse(jsonString)
      } catch (error) {
        ctx.issues.push({
          code: "invalid_format",
          format: "json",
          input: jsonString,
          message: error instanceof Error ? error.message : "Invalid JSON",
        })
        return z.NEVER
      }
    },
    encode: (value) => JSON.stringify(value),
  })

const UserJson = jsonCodec(z.object({ name: z.string(), age: z.number() }))
const user = UserJson.decode('{"name":"Alice","age":30}')
const json = UserJson.encode({ name: "Bob", age: 25 })
```

```ts
const StringToInt = z.codec(z.string().regex(z.regexes.integer), z.int(), {
  decode: (value) => Number.parseInt(value, 10),
  encode: (value) => value.toString(),
})

const EpochSecondsToDate = z.codec(z.int().min(0), z.date(), {
  decode: (value) => new Date(value * 1000),
  encode: (value) => Math.floor(value.getTime() / 1000),
})
```

```ts
const Utf8ToBytes = z.codec(z.string(), z.instanceof(Uint8Array), {
  decode: (value) => new TextEncoder().encode(value),
  encode: (value) => new TextDecoder().decode(value),
})
```

## Common pitfalls
- Using one-way transforms when code also needs serialization back to the wire format
- Making `decode` and `encode` disagree about the contract
- Mixing side effects into codec functions
- Assuming JSON Schema export can represent codec behavior

## See also
- `../sections/40-transforms-codecs.md`
- `json-schema.md`
- `string-formats.md`
