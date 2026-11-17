# Schema Basics

## What it is

Define runtime contracts, decode unknown input into domain values, and encode
domain values back to their external representation.

## Minimal example

```ts
import { Effect, ParseResult, Schema } from "effect"

class User extends Schema.Class<User>("app/User")({
  id: Schema.Number,
  name: Schema.NonEmptyString,
  role: Schema.Literal("admin", "member")
}) {}

type UserType = Schema.Schema.Type<typeof User>
type UserEncoded = Schema.Schema.Encoded<typeof User>

const decodeUser = Schema.decodeUnknown(User)
const encodeUser = Schema.encode(User)

class InvalidUserPayload extends Schema.TaggedError<InvalidUserPayload>()(
  "InvalidUserPayload",
  { reason: Schema.instanceOf(ParseResult.ParseError) }
) {}

const parseUserPayload = (input: unknown) =>
  decodeUser(input).pipe(
    Effect.mapError((reason) => new InvalidUserPayload({ reason }))
  )
```

Map errors around the decode operation, not around the workflow that consumes
the decoded value.

## Parser choices

- `decodeUnknown`: typed `Effect` for untrusted input
- `decodeUnknownEither` / `decodeUnknownOption`: failure as data
- `decodeUnknownSync`: throws `ParseError`
- `decodeUnknownPromise`: Promise interop at a non-Effect boundary
- `decode`: same choices when input is already `Schema.Encoded<S>`
- `encode`: typed `Effect` from `Schema.Type<S>` to `Schema.Encoded<S>`

## Common pitfalls

- Treating the encoded type as the domain type
- Rebuilding parsers for every item or request
- Mapping a broad workflow error union into one parse error
- Using sync throwing parsers inside an Effect workflow

## See also

- `schema.md`
- `schema-tooling-errors.md`
- `schema-classes-errors.md`
