# Collection Types

## What it is
Container schemas for ordered lists, fixed tuples, key-value records, maps, and sets.

## When to use
- The contract is a collection, not a single value
- Keys or item counts matter
- You need constraints like min or max size

## Quick rules
- Use `z.array(Item)` for variable-length sequences.
- Use `z.tuple([...])` for fixed-length positional data.
- Use `z.record(Key, Value)` for object-shaped dictionaries.
- Use `z.partialRecord(...)` when enum-keyed records should allow missing keys.
- Use `z.looseRecord(...)` when non-matching keys should pass through unchanged.
- Use `z.map()` or `z.set()` for real runtime `Map` and `Set` values, not JSON payloads.

## Minimal examples
```ts
import * as z from "zod"

const Tags = z.array(z.string()).min(1)
const Point = z.tuple([z.number(), z.number()])

const Locale = z.enum(["en", "de"])
const Messages = z.record(Locale, z.string())
const OptionalMessages = z.partialRecord(Locale, z.string())
const PhoneFields = z.looseRecord(z.string().regex(/_phone$/), z.e164())

const Scores = z.map(z.string(), z.number())
const UniqueIds = z.set(z.uuid()).min(1)
```

## Common pitfalls
- Using `Map` or `Set` schemas for JSON payloads that only ever contain arrays or objects
- Modeling fixed tuples as arrays and losing positional guarantees
- Forgetting enum-keyed `record` schemas can be exhaustive
- Forgetting that plain `record` rejects keys that fail the key schema, where `looseRecord` is more appropriate
- Using records when the key space is actually a closed object shape

## See also
- `../sections/20-objects-collections.md`
- `object-shape-control.md`
- `special-types.md`
