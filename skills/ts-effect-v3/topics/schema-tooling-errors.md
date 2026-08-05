# Schema Errors and Tooling

## What it is

Keep parse failures structured. Derive error reports, JSON Schema, generated
values, pretty printers, equivalence, and Standard Schema from one contract.

## Minimal example

```ts
import {
  Arbitrary,
  Either,
  JSONSchema,
  ParseResult,
  Pretty,
  Schema
} from "effect"

const Product = Schema.Struct({
  id: Schema.String.annotations({
    description: "Stable product identifier"
  }),
  name: Schema.NonEmptyString,
  price: Schema.Number.pipe(Schema.nonNegative())
}).annotations({
  identifier: "Product",
  title: "Product",
  description: "A catalog product"
})

const decodeProduct = (input: unknown) =>
  Schema.decodeUnknownEither(Product, { errors: "all" })(input).pipe(
    Either.mapLeft(ParseResult.ArrayFormatter.formatErrorSync)
  )

const ProductJsonSchema = JSONSchema.make(Product)
const ProductArbitrary = Arbitrary.make(Product)
const formatProduct = Pretty.make(Product)
const productsEqual = Schema.equivalence(Product)
const ProductStandardSchema = Schema.standardSchemaV1(Product)
```

JSON Schema and generated values are best effort. Custom declarations and
filters may need annotations that explain their representation and generator.

## Common pitfalls

- Reducing structured parse failures to a message too early
- Omitting identifiers from recursive or externally documented schemas
- Assuming every transformation has a JSON Schema representation
- Writing separate validation, generator, and comparison definitions

## See also

- `schema.md`
- `schema-basics.md`
- `http-swagger.md`
