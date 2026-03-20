# String Formats

## What it is
String-specific validators for common wire formats and text constraints.

## When to use
- You need standard identifiers, URLs, timestamps, hashes, or network strings
- You want semantic string validation without custom regexes

## Quick rules
- Prefer dedicated format schemas like `z.email()` and `z.uuid()` over ad hoc regexes.
- Built-in formats cover common cases like email, UUID, URL, HTTP URL, hostname, emoji, ISO date/time/datetime, IPs, CIDR blocks, JWT, and hashes.
- Use `.trim()`, `.toLowerCase()`, or `.toUpperCase()` only when changing the parsed output is acceptable.
- Use `z.stringbool()` when string input should parse into boolean output.
- Use template literals when a string contract has a composable pattern.

## Minimal examples
```ts
import * as z from "zod"

const Email = z.email()
const UserId = z.uuid()
const Homepage = z.url()
const ApiBase = z.httpUrl()
const CreatedAt = z.iso.datetime()
const IPv4 = z.ipv4()
const Sha256 = z.hash("sha256")
const Enabled = z.stringbool()
```

```ts
const CssLength = z.templateLiteral([z.number(), z.enum(["px", "rem", "%"])])
```

## Common pitfalls
- Treating `z.url()` as a `URL` object parser; it validates strings, it does not construct `URL`
- Using ISO date or datetime validators when you actually need a `Date` instance in output
- Replacing well-known formats with custom regexes that drift from the standard
- Forgetting that `stringbool` changes the output type to `boolean`

## See also
- `../sections/10-primitives.md`
- `codecs.md`
- `fallbacks.md`
