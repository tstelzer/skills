# Basics

## What it is
Core Zod workflow: define a schema, parse untrusted input, and derive static types from the same schema.

## When to use
- You need runtime validation for external or untrusted data
- You want TypeScript types derived from the validation contract
- You need a first entry point before choosing more specific APIs

## Quick rules
- Prefer one schema as the source of truth for both validation and typing.
- Compose the complete boundary schema before parsing. Parse once per boundary by default.
- Put missing-field defaults in that schema. Do not supply them at the parse call.
- Treat each real boundary as a new parse site. Do not reparse intermediate values inside one boundary.
- Use `parse()` when failure should throw.
- Use `safeParse()` when failure is part of normal control flow.
- Use `validate()` when you need only a boolean and no parsed output or issues.
- Use `parseAsync()` or `safeParseAsync()` if any nested refinement or transform is async.
- Use `validateAsync()` when an async schema needs only a boolean result.
- Use `z.input<typeof Schema>` for pre-parse type, `z.output<typeof Schema>` for post-parse type.
- Use `z.toZod<T>()(schema)` when an existing static type must exactly equal the schema output type.

## Minimal examples
```ts
import * as z from "zod"

const User = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  age: z.number().int().nonnegative().optional(),
})

type UserInput = z.input<typeof User>
type User = z.output<typeof User>

const result = User.safeParse(data)
if (result.success) {
  const parsed = result.data
} else {
  console.error(result.error.issues)
}

if (User.validate(data)) {
  data.id
}
```

```ts
const TrimmedInt = z.string()
  .trim()
  .regex(z.regexes.integer)
  .pipe(z.coerce.number().int())

type Before = z.input<typeof TrimmedInt>
type After = z.output<typeof TrimmedInt>
```

```ts
type Account = { id: string; enabled: boolean }

const Account = z.toZod<Account>()(
  z.object({
    id: z.uuid(),
    enabled: z.boolean(),
  })
)
```

## One parse per boundary
Compose wire validation, normalization, transformation, and output validation into one schema before calling `parse`.

```ts
const CreateUserWire = z.strictObject({
  full_name: z.string(),
  age: z.string().regex(z.regexes.integer),
})

const CreateUserCommand = z.strictObject({
  name: z.string().min(1),
  age: z.int().nonnegative(),
})

const CreateUserBoundary = CreateUserWire
  .transform((value) => ({
    name: value.full_name.trim(),
    age: Number(value.age),
  }))
  .pipe(CreateUserCommand)

const command = CreateUserBoundary.parse(request.body)
```

Do not weaken a domain schema or introduce a dependency between unrelated modules to achieve one parse call. If
composition would do either, keep the extra parse in the adapter and document why.

## Common pitfalls
- Using `z.infer` when input and output types differ after transforms or coercion
- Calling sync parse APIs on schemas with async refinements or transforms
- Using `validate()` when the caller needs transformed output or validation issues
- Parsing trusted in-process values repeatedly instead of validating once at the boundary
- Parsing an intermediate value with another schema instead of composing the schemas before the boundary parse
- Coercing `unknown` directly when the boundary accepts a narrower wire type
- Treating `.optional()` as the same thing as `.nullable()` or `.nullish()`
- Using `satisfies z.ZodType<T>` when exact agreement with an existing type is required

## See also
- `10-primitives.md`
- `20-objects-collections.md`
- `30-composition.md`
- `40-transforms-codecs.md`
- `50-errors.md`
- `../topics/compiled-validation.md`
