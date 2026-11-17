# CLI

## What it is
Command/option/arg/prompt patterns built on `@effect/cli`.

## Structure

```text
Command.run(command, { name, version })
├── Command (parent)
│   ├── Options (named flags)
│   ├── Args (positional)
│   └── Command.withSubcommands([...])
```

## Minimal app

```ts
import { Args, Command, Options } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Console, Effect } from "effect"

const greet = Command.make(
  "greet",
  {
    name: Args.text({ name: "name" }),
    loud: Options.boolean("loud").pipe(Options.withAlias("l"))
  },
  ({ name, loud }) => Console.log(loud ? name.toUpperCase() + "!" : `Hello, ${name}!`)
)

const cli = Command.run(greet, { name: "Greeter", version: "1.0.0" })

Effect.suspend(() => cli(process.argv)).pipe(
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain
)
```

## Commands and subcommands

```ts
const git = Command.make("git", {
  verbose: Options.boolean("verbose").pipe(Options.withAlias("v"))
})

const clone = Command.make("clone", { repo: Args.text({ name: "repo" }) }, ({ repo }) =>
  Effect.gen(function* () {
    const { verbose } = yield* git
    yield* Console.log(`Cloning ${repo}, verbose=${verbose}`)
  })
)
```

Subcommand handlers can `yield* parentCommand` to read parent parsed config.

## Built-in options

| Flag | Effect |
|---|---|
| `-h`, `--help` | Print auto-generated help |
| `--version` | Print version |
| `--wizard` | Interactive wizard |
| `--completions bash\|fish\|zsh` | Shell completion scripts |
| `--log-level debug\|info\|warn\|error` | Set log level |

## Config precedence

CLI args > `withFallbackConfig` (env/config file) > `withFallbackPrompt` > `withDefault`

## Common pitfalls
- Parsing config manually in handlers instead of using fallback combinators
- Forgetting parent command access pattern in subcommands

## See also
- `00-foundations.md`
- `../topics/cli-options.md`
- `../topics/cli-args.md`
- `../topics/cli-prompt.md`
