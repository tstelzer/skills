# Config

## What it is
`Config` provides typed configuration from environment variables, files, and
CLI input.

## When to use
- Env vars, config files, CLI fallbacks
- Typed config with validation

## When not to use
- Hardcoded values (when config is needed)

## Minimal examples
```ts
import { Config, Effect } from "effect"

const config = Config.all({
  port: Config.integer("PORT").pipe(Config.withDefault(3000)),
  host: Config.string("HOST").pipe(Config.withDefault("localhost"))
})
```

## Common pitfalls
- Parsing config in handlers instead of using `withFallbackConfig` on CLI options

## See also
- `../sections/20-cli.md`
- `../sections/00-foundations.md`
