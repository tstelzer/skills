# Schema Unions and Recursion

## What it is

Use unions for alternatives, stable tags when variants have different
behavior, and `Schema.suspend` for recursive edges.

## Minimal example

```ts
import { Match, Schema } from "effect"

const SearchResult = Schema.Union(
  Schema.TaggedStruct("Found", {
    id: Schema.String,
    title: Schema.NonEmptyString
  }),
  Schema.TaggedStruct("Missing", { id: Schema.String }),
  Schema.TaggedStruct("Failed", { message: Schema.NonEmptyString })
)

type SearchResult = Schema.Schema.Type<typeof SearchResult>

const renderSearchResult = Match.type<SearchResult>().pipe(
  Match.tag("Found", ({ title }) => title),
  Match.tag("Missing", ({ id }) => `Missing: ${id}`),
  Match.tag("Failed", ({ message }) => `Failed: ${message}`),
  Match.exhaustive
)

interface Category {
  readonly name: string
  readonly children: ReadonlyArray<Category>
}

const Category: Schema.Schema<Category> = Schema.Struct({
  name: Schema.NonEmptyString,
  children: Schema.Array(
    Schema.suspend((): Schema.Schema<Category> => Category)
  )
})
```

## Common pitfalls

- Using overlapping untagged members when a discriminator is available
- Forgetting `Schema.suspend` on a recursive edge
- Handling tagged variants without an exhaustive match
- Hiding per-item failures inside a top-level batch success

## See also

- `schema.md`
- `match.md`
- `schema-classes-errors.md`
