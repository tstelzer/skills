# CLI Args

## What it is
`Args<A>` represents positional (unnamed) CLI arguments.

## When to use
- Parse required or optional positional values (`<repo>`, `<path>`)
- Validate and transform positional values with schemas/effects

## When not to use
- Named flags (use `Options`)

## Minimal examples
```ts
import { Args } from "@effect/cli"
import { Schema } from "effect"

const repo = Args.text({ name: "repo" })
const depth = Args.text({ name: "depth" }).pipe(
  Args.withSchema(Schema.NumberFromString)
)
```

## Constructors

| Constructor | Output type |
|---|---|
| `Args.text({ name: "repo" })` | `string` |
| `Args.integer({ name: "x" })` | `number` |
| `Args.float({ name: "amount" })` | `number` |
| `Args.boolean()` | `boolean` |
| `Args.date()` | `Date` |
| `Args.path()` | `string` |
| `Args.file()` | `string` |
| `Args.file({ exists: "yes" })` | `string` |
| `Args.directory()` | `string` |
| `Args.fileText()` | `[path, string]` |
| `Args.fileSchema(MySchema)` | `Schema.Type<S>` |
| `Args.redacted()` | `Redacted` |
| `Args.choice([["dog", Dog()], ["cat", Cat()]])` | `Dog \| Cat` |
| `Args.none` | `void` |

## Common combinators

```ts
Args.text({ name: "dir" }).pipe(Args.optional)
Args.text({ name: "dir" }).pipe(Args.withDefault("/"))

Args.text({ name: "file" }).pipe(Args.repeated)
Args.text({ name: "file" }).pipe(Args.atLeast(1))
Args.text({ name: "file" }).pipe(Args.atMost(5))
Args.text({ name: "file" }).pipe(Args.between(1, 5))

Args.text({ name: "n" }).pipe(Args.map(Number))
Args.text({ name: "j" }).pipe(Args.mapTryCatch(JSON.parse, (e) => HelpDoc.p("Invalid JSON")))
Args.text({ name: "n" }).pipe(Args.mapEffect(...))

Args.text({ name: "repo" }).pipe(Args.withFallbackConfig(Config.string("REPOSITORY")))
Args.text({ name: "repo" }).pipe(Args.withDescription("The repository URL"))

Args.all([args1, args2])
Args.all({ x: xArg, y: yArg })
```

## Common pitfalls
- Putting optional args before required args in UX design
- Using args for values that are clearer as named options

## See also
- `../sections/20-cli.md`
- `cli-options.md`
- `cli-prompt.md`
