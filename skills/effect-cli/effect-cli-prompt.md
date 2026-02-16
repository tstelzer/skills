# Prompt Reference

`Prompt<Output>` is an interactive terminal prompt. It extends `Effect<Output, QuitException, Terminal>`.

## Constructors

### Text Input

```ts
Prompt.text({ message: "Enter name:", default: "Alice" })         // string
Prompt.password({ message: "Password:", validate: (v) => ... })   // Redacted
Prompt.hidden({ message: "Secret:" })                              // Redacted
```

### Numeric Input

```ts
Prompt.integer({ message: "Age:", min: 0, max: 150 })             // number
Prompt.float({ message: "Price:", precision: 2 })                  // number
```

### Selection

```ts
Prompt.select({
  message: "Pick color:",
  choices: [
    { title: "Red", value: "#ff0000", description: "Warm color" },
    { title: "Green", value: "#00ff00" },
    { title: "Blue", value: "#0000ff", disabled: true }
  ],
  maxPerPage: 10
})                                                                  // string

Prompt.multiSelect({
  message: "Pick colors:",
  choices: [...],
  min: 1, max: 3,
  selectAll: "All", selectNone: "None", inverseSelection: "Invert"
})                                                                  // Array<string>
```

### Boolean

```ts
Prompt.confirm({
  message: "Are you sure?",
  initial: false,
  placeholder: { defaultConfirm: "(Y/n)", defaultDeny: "(y/N)" },
  label: { confirm: "yes", deny: "no" }
})                                                                  // boolean

Prompt.toggle({
  message: "Enable?",
  initial: false,
  active: "on",
  inactive: "off"
})                                                                  // boolean
```

### Date

```ts
Prompt.date({
  message: "Birth date:",
  dateMask: "YYYY-MM-DD",
  validate: (d) => d < new Date() ? Effect.succeed(d) : Effect.fail("Must be past")
})                                                                  // Date
```

### File Picker

```ts
Prompt.file({
  type: "file",            // "file" | "directory" | "either"
  message: "Choose file",
  startingPath: "./",
  maxPerPage: 10,
  filter: (f) => f.endsWith(".ts")
})                                                                  // string
```

### List

```ts
Prompt.list({ message: "Tags:", delimiter: "," })                  // Array<string>
```

### Immediate

```ts
Prompt.succeed(42)                                                 // Prompt<number>
```

## Combining Prompts

```ts
// Sequence (tuple or struct)
Prompt.all([namePrompt, agePrompt])                // Prompt<[string, number]>
Prompt.all({ name: namePrompt, age: agePrompt })   // Prompt<{ name: string, age: number }>

// Chain
Prompt.text({ message: "Name?" }).pipe(
  Prompt.flatMap((name) =>
    Prompt.confirm({ message: `Is ${name} correct?` })
  )
)

// Transform
Prompt.integer({ message: "Count:" }).pipe(Prompt.map((n) => n * 2))

// Run standalone
Prompt.run(myPrompt)   // Effect<Output, QuitException, Prompt.Environment>
```

## Custom Prompts

```ts
Prompt.custom(
  initialState,
  {
    render: (state, action) => Effect.succeed("ANSI string to display"),
    process: (userInput, state) => Effect.succeed(
      Prompt.Action.Submit({ value: state.result })
      // or: Prompt.Action.NextFrame({ state: newState })
      // or: Prompt.Action.Beep
    ),
    clear: (state, action) => Effect.succeed("ANSI clear sequence")
  }
)
```

## Using Prompts as Option Fallbacks

```ts
Options.text("name").pipe(
  Options.withFallbackPrompt(Prompt.text({ message: "Enter your name:" }))
)

Options.choice("env", ["prod", "staging", "dev"]).pipe(
  Options.withFallbackPrompt(
    Prompt.select({
      message: "Select environment:",
      choices: [
        { title: "Production", value: "prod" },
        { title: "Staging", value: "staging" },
        { title: "Dev", value: "dev" }
      ]
    })
  )
)
```
