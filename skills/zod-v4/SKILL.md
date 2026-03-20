---
name: zod-v4
description: Canonical handbook for Zod 4 usage in TypeScript and JavaScript. Use when defining Zod schemas, parsing or validating data, shaping objects, composing unions, applying refinements or transforms or codecs, customizing errors, or generating JSON Schema and metadata.
---

# Zod v4 Handbook

## Purpose
Use this as the single source of truth for Zod 4 usage in this repository. Keep lookup cheap: route to one file first, then follow `See also` only if that file is not enough.

## Routing Rules
- Do not read this handbook linearly.
- Pick exactly one target file first.
- Start with a `sections/*.md` file for broad tasks.
- Start with a `topics/*.md` file for narrow API questions.
- Follow `See also` only when the first file is insufficient.
- Ignore release notes, versioning, migration, and library-author internals unless the user explicitly asks for them.

## Quick Picks (Task -> File)
- Define a first schema, parse data, infer types -> `sections/00-basics.md`
- Choose a primitive or literal schema -> `sections/10-primitives.md`
- Validate string formats like email, UUID, URL, ISO datetime -> `topics/string-formats.md`
- Build or reshape object schemas -> `topics/object-shape-control.md`
- Validate arrays, tuples, records, maps, or sets -> `topics/collection-types.md`
- Model variants or optional/null values -> `topics/unions-and-optionality.md`
- Add custom validation rules -> `topics/refinements.md`
- Model recursive trees or graphs -> `topics/recursive-schemas.md`
- Transform input, preprocess, or pipe schemas -> `sections/40-transforms-codecs.md`
- Use defaults, prefaults, or catch fallbacks -> `topics/fallbacks.md`
- Decode and encode between types -> `topics/codecs.md`
- Customize error messages -> `topics/error-customization.md`
- Convert errors into UI-friendly structures -> `topics/error-formatting.md`
- Emit or ingest JSON Schema -> `topics/json-schema.md`
- Attach metadata or use registries -> `topics/metadata-registries.md`
- Validate special runtime values like `File`, class instances, or functions -> `topics/special-types.md`

## By Domain
- Foundations (schemas, parsing, inference, async boundaries) -> `sections/00-basics.md`
- Primitive schemas (strings, numbers, booleans, enums, literals, dates) -> `sections/10-primitives.md`
- Object and collection modeling -> `sections/20-objects-collections.md`
- Composition and validation logic -> `sections/30-composition.md`
- Transforms, preprocess, defaults, codecs -> `sections/40-transforms-codecs.md`
- Errors and reporting -> `sections/50-errors.md`
- Metadata and JSON Schema -> `sections/60-json-schema-metadata.md`

## By Feature
- `parse` / `safeParse` / async parsing -> `sections/00-basics.md`
- `z.input` / `z.output` / `z.infer` -> `sections/00-basics.md`
- String formats -> `topics/string-formats.md`
- `z.object` / `z.strictObject` / `z.looseObject` / `catchall` -> `topics/object-shape-control.md`
- Arrays / tuples / records / maps / sets -> `topics/collection-types.md`
- `optional` / `nullable` / `nullish` / unions -> `topics/unions-and-optionality.md`
- Recursive schemas -> `topics/recursive-schemas.md`
- `refine` / `superRefine` / `check` -> `topics/refinements.md`
- `preprocess` / `transform` / `pipe` -> `sections/40-transforms-codecs.md`
- `default` / `prefault` / `catch` -> `topics/fallbacks.md`
- `z.codec` / `z.decode` / `z.encode` -> `topics/codecs.md`
- Error maps and per-parse customization -> `topics/error-customization.md`
- `z.treeifyError` / `z.flattenError` / `z.prettifyError` -> `topics/error-formatting.md`
- `z.toJSONSchema` / `z.toJSONSchema(schema, { io })` -> `topics/json-schema.md`
- `meta` / `describe` / registries / `z.globalRegistry` -> `topics/metadata-registries.md`
- `instanceof` / `file` / `function` / branded / readonly -> `topics/special-types.md`

## Section Index
- `sections/00-basics.md` - define schemas, parse values, infer input/output types, async parsing
- `sections/10-primitives.md` - primitives, literals, enums, dates, unknown/any/never
- `sections/20-objects-collections.md` - objects, unknown-key policy, arrays, tuples, records, maps, sets
- `sections/30-composition.md` - unions, discriminated unions, intersections, recursion, refinements
- `sections/40-transforms-codecs.md` - preprocess, transforms, pipes, defaults, prefaults, catch, codecs
- `sections/50-errors.md` - error handling, customization, formatting for apps and UIs
- `sections/60-json-schema-metadata.md` - metadata registries and JSON Schema conversion

## Topic Index
- `topics/string-formats.md` - email, URL, UUID, ISO datetime, IPs, hashes, `stringbool`
- `topics/object-shape-control.md` - object derivation and unknown-key handling
- `topics/collection-types.md` - arrays, tuples, records, maps, sets
- `topics/unions-and-optionality.md` - optional, nullable, nullish, unions, discriminated unions, intersections
- `topics/recursive-schemas.md` - self-referential schemas and getter-based recursion
- `topics/refinements.md` - custom validation logic and issue reporting
- `topics/fallbacks.md` - defaults, prefaults, and catch fallbacks
- `topics/codecs.md` - bidirectional decode/encode flows
- `topics/error-customization.md` - schema-level and per-parse error customization
- `topics/error-formatting.md` - tree, flat, and pretty error output
- `topics/json-schema.md` - JSON Schema export and representability limits
- `topics/metadata-registries.md` - metadata storage, lookup, and registries
- `topics/special-types.md` - files, functions, class instances, branded, readonly, custom

## Conventions
- Section files: What it is | When to use | Quick rules | Minimal examples | Common pitfalls | See also
- Topic files: same structure, compact, task-oriented
- Paths are relative to this `SKILL.md`

## When to Use This Handbook
- Implementing API request or response validation
- Defining schema-driven config, form, or env validation
- Reusing one schema for runtime parsing and static typing
- Debugging `ZodError` handling and user-facing messages
- Converting Zod schemas to JSON Schema or attaching metadata

## Package References
- Use `zod` by default.
- Only reach for `zod/mini` or `zod/v4/core` if the user explicitly asks about those packages.
