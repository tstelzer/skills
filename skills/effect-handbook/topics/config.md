# Config

## What it is
`Config` from `effect`: typed configuration from env, files, CLI. `Config.string`, `Config.integer`, `Config.nested`, `Config.map`.

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
