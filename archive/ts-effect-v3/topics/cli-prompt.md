# CLI Prompt

## What it is
`Prompt<Output>` is an interactive terminal prompt. It extends `Effect<Output, QuitException, Terminal>`.

## When to use
- Interactive flows for missing config/arguments
- Guided input with validation and constrained choices

## When not to use
- Non-interactive automation-only CLIs

## Minimal examples
```ts
import { Prompt } from "@effect/cli"

const envPrompt = Prompt.select({
  message: "Select environment:",
  choices: [
    { title: "Production", value: "prod" },
    { title: "Staging", value: "staging" },
    { title: "Dev", value: "dev" }
  ]
})
```

## Constructors

```ts
Prompt.text({ message: "Enter name:", default: "Alice" })
Prompt.password({ message: "Password:" })
Prompt.hidden({ message: "Secret:" })

Prompt.integer({ message: "Age:", min: 0, max: 150 })
Prompt.float({ message: "Price:", precision: 2 })

Prompt.confirm({ message: "Are you sure?" })
Prompt.toggle({ message: "Enable?", active: "on", inactive: "off" })
Prompt.date({ message: "Birth date:", dateMask: "YYYY-MM-DD" })

Prompt.select({ message: "Pick:", choices: [...] })
Prompt.multiSelect({ message: "Pick:", choices: [...], min: 1, max: 3 })
Prompt.list({ message: "Tags:", delimiter: "," })
Prompt.file({ type: "file", message: "Choose file", startingPath: "./" })

Prompt.succeed(42)
```

## Composition

```ts
Prompt.all([namePrompt, agePrompt])
Prompt.all({ name: namePrompt, age: agePrompt })

Prompt.text({ message: "Name?" }).pipe(
  Prompt.flatMap((name) => Prompt.confirm({ message: `Is ${name} correct?` }))
)

Prompt.integer({ message: "Count:" }).pipe(Prompt.map((n) => n * 2))
Prompt.run(myPrompt)
```

## Option fallback integration

```ts
Options.text("name").pipe(
  Options.withFallbackPrompt(Prompt.text({ message: "Enter your name:" }))
)
```

## Common pitfalls
- Using prompts in CI/non-interactive contexts
- Prompting when deterministic config/env fallback is available

## See also
- `../sections/20-cli.md`
- `cli-options.md`
- `cli-args.md`
