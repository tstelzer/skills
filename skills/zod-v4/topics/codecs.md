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

## Common pitfalls
- Using one-way transforms when code also needs serialization back to the wire format
- Making `decode` and `encode` disagree about the contract
- Mixing side effects into codec functions
- Assuming JSON Schema export can represent codec behavior

## See also
- `../sections/40-transforms-codecs.md`
- `json-schema.md`
- `string-formats.md`
