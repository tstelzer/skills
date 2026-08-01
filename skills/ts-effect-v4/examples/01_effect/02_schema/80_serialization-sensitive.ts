/**
 * @title Serialization and sensitive values
 *
 * Derive external representations from the domain schema. Preserve opaque
 * values exactly unless their boundary contract defines normalization.
 */
import { Schema } from "effect"

export const AuditEntry = Schema.Struct({
  id: Schema.String,
  occurredAt: Schema.Date,
  labels: Schema.Array(Schema.String)
})

// A canonical JSON codec converts values such as Date into JSON-safe forms.
export const AuditEntryJson = Schema.toCodecJson(AuditEntry)

// Parse a JSON string, then validate the parsed value with AuditEntryJson.
export const AuditEntryFromJsonString = Schema.fromJsonString(AuditEntryJson)

export const SearchParams = Schema.fromURLSearchParams(
  Schema.toCodecStringTree(
    Schema.Struct({
      page: Schema.Int,
      query: Schema.String
    })
  )
)

export const UploadForm = Schema.fromFormData(
  Schema.Struct({
    title: Schema.String,
    attachment: Schema.instanceOf(File)
  })
)

export const Utf8FromBase64 = Schema.StringFromBase64
export const BytesFromHex = Schema.Uint8ArrayFromHex
export const encodeAuditEntryXml = Schema.toEncoderXml(AuditEntry)

// RedactedFromValue accepts a raw value at the boundary and wraps the decoded
// value. Redacted expects the input to be redacted already.
export const ApiKey = Schema.RedactedFromValue(Schema.NonEmptyString, {
  label: "ApiKey",
  disallowEncode: true
})

export const ExistingApiKey = Schema.Redacted(Schema.NonEmptyString, {
  label: "ApiKey",
  disallowJsonEncode: true
})

export const decodeApiKey = Schema.decodeUnknownEffect(ApiKey)
