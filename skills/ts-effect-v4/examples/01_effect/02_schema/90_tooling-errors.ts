/**
 * @title Errors, metadata, and generated tooling
 *
 * Keep schema failures structured. Derive documentation, generators,
 * comparison, optics, and patches from the same contract.
 */
import { Effect, Schema, SchemaIssue } from "effect"

export const Product = Schema.Struct({
  id: Schema.String.annotate({
    description: "Stable product identifier"
  }),
  name: Schema.NonEmptyString.annotateKey({
    messageMissingKey: "Product name is required"
  }),
  price: Schema.Finite.check(
    Schema.isGreaterThanOrEqualTo(0)
  )
}).annotate({
  identifier: "Product",
  title: "Product",
  description: "A product returned by the catalog API"
})

export const decodeProduct = (input: unknown) =>
  Schema.decodeUnknownEffect(Product)(input, { errors: "all" }).pipe(
    Effect.mapError((error) =>
      SchemaIssue.makeFormatterStandardSchemaV1()(error.issue)
    )
  )

// Standard Schema integrates with consumers that implement Standard Schema V1.
export const ProductStandardSchema = Schema.toStandardSchemaV1(Product)

// JSON Schema generation is best effort. Transformations and custom
// declarations need an explicit representable encoding.
export const ProductJsonSchema = Schema.toJsonSchemaDocument(Product)

// Generated values satisfy built-in filters. Add arbitrary annotations for
// custom filters whose constraints cannot be inferred.
export const ProductArbitrary = Schema.toArbitrary(Product)

export const productsEqual = Schema.toEquivalence(Product)
export const ProductIso = Schema.toIso(Product)
export const ProductDiffer = Schema.toDifferJsonPatch(Product)

export const renameProduct = (product: typeof Product.Type, name: string) =>
  ProductIso.key("name").replace(name, product)
