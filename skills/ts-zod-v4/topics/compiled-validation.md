# Validation and Compilation

## What it is
APIs for checking validity without parsed data or errors, and for compiling hot schemas into faster validators.

## When to use
- You only need a boolean answer
- A stable schema runs often enough for parse speed to matter
- You need to enable compilation for an application

## Quick rules
- Use `.validate(input)` when you need only `true` or `false`; use `.validateAsync(input)` for async schemas.
- Use `safeParse` when you need parsed output or validation issues.
- Treat `validate` as a type guard on the schema input. It does not return transformed output.
- Call `z.compile()` on the final schema. Methods such as `.refine()`, `.extend()`, and `.optional()` return a new,
  uncompiled schema.
- Compile measured hot paths. Complex objects, tuples, arrays, and unions benefit more than scalar schemas.
- Expect little improvement for invalid input. Compiled parsing falls back to the standard parser to build issues.
- Import `zod/compile` before schema modules to enable lazy global compilation in an application. Do not use that
  side-effect import in a library.
- Compilation uses `new Function` and adds compiler code to the bundle. Keep it out of CSP or no-eval environments.
- Use `z.withParser()` only to install a trusted external parser in an environment that cannot run `new Function`.
- Async operations, recursive schemas, `z.xor()`, coercion, and checks with custom `when` logic are not compiled.
  Unsupported schemas fall back to the standard parser unless `z.compile(schema, { strict: true })` is used.
- Encoding and async parsing always use the standard parser.

## Minimal examples
```ts
import * as z from "zod"

const Player = z.object({
  username: z.string(),
  xp: z.number(),
})

if (Player.validate(input)) {
  input.username
}

const CompiledPlayer = z.compile(Player)
const player = CompiledPlayer.parse(input)
```

```ts
import "zod/compile"
import { Player } from "./player.js"

Player.parse(input)
```

The side-effect import must run before the module that defines `Player`.

## Common pitfalls
- Replacing `safeParse` with `validate` when the caller needs transformed output or issues
- Compiling an intermediate schema and then deriving the schema that is actually parsed
- Enabling global compilation in a library
- Assuming unsupported schemas throw without `strict: true`
- Paying the bundle and startup cost without measuring a hot parse path
- Enabling compilation where Content Security Policy blocks dynamic code generation
- Returning an input object unchanged from `z.withParser()` when the schema would strip or transform it
- Relying on a refinement or transform to run once; invalid compiled parsing may run it again during error fallback

## See also
- `../sections/00-basics.md`
- `../sections/50-errors.md`
- `codecs.md`
