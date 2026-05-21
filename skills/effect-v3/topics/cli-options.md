# CLI Options

## What it is
`Options<A>` represents named CLI flags like `--verbose` and `--depth 5`.

## When to use
- Parse named flags and typed values for commands
- Add defaults, validation, environment fallbacks, and prompt fallbacks

## When not to use
- Positional arguments (use `Args`)

## Minimal examples
```ts
import { Config, Effect, Schema } from "effect"
import { Options, Prompt } from "@effect/cli"

const port = Options.integer("port").pipe(
  Options.withDefault(3000),
  Options.withFallbackConfig(Config.integer("PORT"))
)

const name = Options.text("name").pipe(
  Options.withAlias("n"),
  Options.withSchema(Schema.NonEmptyString),
  Options.withFallbackPrompt(Prompt.text({ message: "Enter name:" }))
)
```

## Constructors

| Constructor | CLI syntax | Output type |
|---|---|---|
| `Options.boolean("verbose")` | `--verbose` | `boolean` |
| `Options.boolean("v", { ifPresent: true })` | `-v` | `boolean` |
| `Options.boolean("v", { negationNames: ["silent", "s"] })` | `--silent` / `-s` sets false | `boolean` |
| `Options.text("name")` | `--name foo` | `string` |
| `Options.integer("depth")` | `--depth 5` | `number` |
| `Options.float("amount")` | `--amount 3.14` | `number` |
| `Options.date("when")` | `--when 2024-01-01` | `Date` |
| `Options.redacted("token")` | `--token abc` | `Redacted` |
| `Options.choice("fmt", ["json", "yaml", "csv"])` | `--fmt json` | `"json" \| "yaml" \| "csv"` |
| `Options.choiceWithValue("a", [["dog", Dog()], ["cat", Cat()]])` | `--a dog` | `Dog \| Cat` |
| `Options.file("config")` | `--config ./f.json` | `string` |
| `Options.directory("output")` | `--output ./dist` | `string` |
| `Options.fileText("input")` | reads file as text | `[path, string]` |
| `Options.fileSchema("config", MySchema)` | parse + validate | `Schema.Type<S>` |
| `Options.keyValueMap("c")` | `-c k=v -c k2=v2` | `HashMap<string,string>` |
| `Options.none` | no option | `void` |

## Common combinators

```ts
Options.text("firstName").pipe(Options.withAlias("f"))
Options.text("name").pipe(Options.withDescription("Your full name"))
Options.text("name").pipe(Options.withPseudoName("NAME"))

Options.integer("depth").pipe(Options.optional)
Options.integer("depth").pipe(Options.withDefault(10))

Options.text("tag").pipe(Options.repeated)
Options.text("tag").pipe(Options.atLeast(1))
Options.text("tag").pipe(Options.atMost(3))
Options.text("tag").pipe(Options.between(1, 3))

Options.orElse(optA, optB)
Options.orElseEither(optA, optB)
Options.all([opt1, opt2, opt3])
Options.all({ name: nameOpt, age: ageOpt })
```

## Common pitfalls
- Parsing config manually in handlers instead of `withFallbackConfig`
- Missing `withAlias` for high-frequency flags

## See also
- `../sections/20-cli.md`
- `cli-args.md`
- `cli-prompt.md`
