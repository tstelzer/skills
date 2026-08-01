/**
 * @title Unions, tagged unions, and recursion
 *
 * Prefer a stable discriminator when variants have different behavior. Use
 * Schema.suspend for recursive edges.
 */
import { Schema } from "effect"

export const SearchResult = Schema.TaggedUnion({
  Found: {
    id: Schema.String,
    title: Schema.NonEmptyString
  },
  Missing: {
    id: Schema.String
  },
  Failed: {
    message: Schema.NonEmptyString
  }
})

export type SearchResult = typeof SearchResult.Type

export const renderSearchResult = SearchResult.match({
  Found: ({ title }) => title,
  Missing: ({ id }) => `Missing: ${id}`,
  Failed: ({ message }) => `Failed: ${message}`
})

export const isTerminalFailure = SearchResult.isAnyOf(["Missing", "Failed"])
export const Found = SearchResult.cases.Found

export interface Category {
  readonly name: string
  readonly children: ReadonlyArray<Category>
}

export const Category: Schema.Codec<Category> = Schema.Struct({
  name: Schema.NonEmptyString,
  children: Schema.Array(
    Schema.suspend((): Schema.Codec<Category> => Category)
  )
})

export interface NumericCategory {
  readonly name: number
  readonly children: ReadonlyArray<NumericCategory>
}

export interface NumericCategoryEncoded {
  readonly name: string
  readonly children: ReadonlyArray<NumericCategoryEncoded>
}

export const NumericCategory: Schema.Codec<NumericCategory, NumericCategoryEncoded> = Schema.Struct({
  name: Schema.FiniteFromString,
  children: Schema.Array(
    Schema.suspend(
      (): Schema.Codec<NumericCategory, NumericCategoryEncoded> => NumericCategory
    )
  )
})
