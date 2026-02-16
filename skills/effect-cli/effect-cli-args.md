# Args Reference

`Args<A>` represents positional (unnamed) CLI arguments.

## Constructors

| Constructor | Output type |
|---|---|
| `Args.text({ name: "repo" })` | `string` |
| `Args.integer({ name: "x" })` | `number` |
| `Args.float({ name: "amount" })` | `number` |
| `Args.boolean()` | `boolean` ("true"/"false") |
| `Args.date()` | `Date` (ISO) |
| `Args.path()` | `string` (any path) |
| `Args.file()` | `string` (file path) |
| `Args.file({ exists: "yes" })` | `string` (must exist) |
| `Args.directory()` | `string` (directory path) |
| `Args.fileContent()` | `[path, Uint8Array]` |
| `Args.fileText()` | `[path, string]` |
| `Args.fileParse()` | `unknown` (parsed json/yaml/ini/toml) |
| `Args.fileSchema(MySchema)` | `Schema.Type<S>` |
| `Args.redacted()` | `Redacted` |
| `Args.choice([["dog", Dog()], ["cat", Cat()]])` | `Dog \| Cat` |
| `Args.none` | `void` (no args) |

## Combinators

### Optionality and Defaults

```ts
Args.text({ name: "dir" }).pipe(Args.optional)            // Option<string>
Args.text({ name: "dir" }).pipe(Args.withDefault("/"))     // string ("/" if absent)
```

### Repetition

```ts
Args.text({ name: "file" }).pipe(Args.repeated)            // Array<string>
Args.text({ name: "file" }).pipe(Args.atLeast(1))          // NonEmptyArray<string>
Args.text({ name: "file" }).pipe(Args.atMost(5))           // Array<string>
Args.text({ name: "file" }).pipe(Args.between(1, 5))       // NonEmptyArray<string>
```

### Transforms

```ts
Args.text({ name: "n" }).pipe(Args.map(Number))
Args.text({ name: "j" }).pipe(Args.mapTryCatch(JSON.parse, (e) => HelpDoc.p("Invalid JSON")))
Args.text({ name: "n" }).pipe(Args.mapEffect(...))
```

### Schema Validation

```ts
Args.text({ name: "n" }).pipe(Args.withSchema(Schema.NumberFromString))
```

### Fallbacks

```ts
Args.text({ name: "repo" }).pipe(Args.withFallbackConfig(Config.string("REPOSITORY")))
```

### Description

```ts
Args.text({ name: "repo" }).pipe(Args.withDescription("The repository URL"))
```

### Combining

```ts
Args.all([args1, args2])                // Args<[A, B]>
Args.all({ x: xArg, y: yArg })         // Args<{ x: A, y: B }>
```
