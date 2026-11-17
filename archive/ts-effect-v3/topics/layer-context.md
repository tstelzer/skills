# Layer / Context

## What it is
Use `Context.Tag` for services and `Layer` for dependency graphs. A `Context`
is a runtime service map. A `Layer` builds services.

## When to use
- Typed dependency injection, testable services
- Composing services across modules

## When not to use
- Single-module scripts with no test boundaries

## Minimal examples
```ts
import { Context, Effect, Layer } from "effect"

class MyService extends Context.Tag("MyService")<MyService, { get: () => Effect.Effect<string> }>() {}

const MyServiceLive = Layer.succeed(MyService, { get: () => Effect.succeed("ok") })
```

## Common pitfalls
- Providing services in handlers instead of at layer composition
- Circular layer dependencies
- Calling `Context.GenericTag` without a stable key

## See also
- `../sections/00-foundations.md`
- `../sections/10-core-patterns.md`
