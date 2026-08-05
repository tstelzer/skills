# Schema Serialization and Sensitive Values

## What it is

Describe JSON strings, binary encodings, dates, and redacted values from the
same domain contract. Preserve opaque values exactly.

## Minimal example

```ts
import { Schema } from "effect"

const AuditEntry = Schema.Struct({
  id: Schema.String,
  occurredAt: Schema.DateFromString,
  labels: Schema.Array(Schema.String)
})

const AuditEntryFromJsonString = Schema.parseJson(AuditEntry)
const BytesFromHex = Schema.Uint8ArrayFromHex

const ApiKey = Schema.Redacted(Schema.NonEmptyString)
const decodeApiKey = Schema.decodeUnknown(ApiKey)
```

`Schema.Redacted(value)` accepts the raw encoded value and wraps the decoded
value. `Schema.RedactedFromSelf(value)` expects an existing `Redacted` value on
both sides.

## Common pitfalls

- Calling `trim()` or changing case on a secret, token, signature, or command
  output without an explicit contract
- Logging or serializing a redacted value by unwrapping it casually
- Parsing JSON first and validating the result in a separate ad hoc step
- Confusing `Redacted` with `RedactedFromSelf`

## See also

- `schema.md`
- `schema-transformations.md`
- `platform-ndjson.md`
