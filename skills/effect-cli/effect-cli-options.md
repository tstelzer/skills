# Options Reference

`Options<A>` represents named CLI flags like `--verbose`, `--depth 5`.

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
| `Options.redacted("token")` | `--token abc` | `Redacted` (masked in logs) |
| `Options.choice("fmt", ["json", "yaml", "csv"])` | `--fmt json` | `"json" \| "yaml" \| "csv"` |
| `Options.choiceWithValue("a", [["dog", Dog()], ["cat", Cat()]])` | `--a dog` | `Dog \| Cat` |
| `Options.file("config")` | `--config ./f.json` | `string` (path) |
| `Options.file("config", { exists: "yes" })` | must exist | `string` |
| `Options.directory("output")` | `--output ./dist` | `string` (dir path) |
| `Options.fileContent("input")` | reads file | `[path, Uint8Array]` |
| `Options.fileText("input")` | reads file as text | `[path, string]` |
| `Options.fileParse("config")` | reads + parses json/yaml/ini/toml | `unknown` |
| `Options.fileSchema("config", MySchema)` | reads + parses + validates | `Schema.Type<S>` |
| `Options.keyValueMap("c")` | `-c k=v -c k2=v2` | `HashMap<string,string>` |
| `Options.none` | (no option) | `void` |

## Combinators

### Aliasing and Description

```ts
Options.text("firstName").pipe(Options.withAlias("f"))   // --firstName or -f
Options.text("name").pipe(Options.withDescription("Your full name"))
Options.text("name").pipe(Options.withPseudoName("NAME")) // display name in help
```

### Optionality and Defaults

```ts
Options.integer("depth").pipe(Options.optional)            // Option<number>
Options.integer("depth").pipe(Options.withDefault(10))     // number (10 if absent)
```

### Repetition

```ts
Options.text("tag").pipe(Options.repeated)                 // Array<string>
Options.text("tag").pipe(Options.atLeast(1))               // NonEmptyArray<string>
Options.text("tag").pipe(Options.atMost(3))                // Array<string>
Options.text("tag").pipe(Options.between(1, 3))            // NonEmptyArray<string>
```

### Alternatives (Mutually Exclusive)

```ts
Options.orElse(optA, optB)                                 // A | B (exactly one)
Options.orElseEither(optA, optB)                           // Either<A, B>
```

### Transforms

```ts
Options.text("count").pipe(Options.map(Number))
Options.text("count").pipe(Options.mapTryCatch(Number, (e) => HelpDoc.p("Not a number")))
Options.text("count").pipe(Options.mapEffect(
  (s) => Effect.try({ try: () => Number(s), catch: () => ValidationError.invalidValue(...) })
))
```

### Schema Validation

```ts
Options.text("balance").pipe(Options.withSchema(Schema.BigDecimal))
```

### Fallbacks

```ts
// Environment variable / Config fallback
Options.boolean("verbose").pipe(
  Options.withFallbackConfig(Config.boolean("VERBOSE"))
)
Options.integer("port").pipe(
  Options.withFallbackConfig(Config.integer("PORT"))
)

// Interactive prompt fallback (asks user if not provided)
Options.text("name").pipe(
  Options.withFallbackPrompt(Prompt.text({ message: "Name?" }))
)
```

### Combining

```ts
Options.all([opt1, opt2, opt3])                // Options<[A, B, C]>
Options.all({ name: nameOpt, age: ageOpt })    // Options<{ name: A, age: B }>
```
