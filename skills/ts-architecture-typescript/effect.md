# Effect

## Choose the matching API reference

Check the application's installed `effect` version. Read the relevant topics in skill: ts-effect-v3 for `effect@3`,
or skill: ts-effect-v4 for `effect@4`. Keep API details in those handbooks.

Use Effect Schema for boundary parsing and Effect logging for application logs. Use Effect platform services for I/O
and runtime inputs. Keep native APIs at adapters when an Effect service cannot provide the required behavior.

## Keep dependencies and resources explicit

Use Effect services and Layers for dependencies owned by Effect. Keep pure domain functions outside the service graph.
Assemble the application Layer at the composition root. Leave required services visible until that boundary supplies
them. Keep service construction separate from the Layer that wires its dependencies.

Load each capability's typed configuration during startup through Effect's configuration services or explicit Layer
inputs. Keep direct environment reads out of service implementations. Use redacted values for secrets.

Tie resource acquisition and release to an owning scope. Build a Layer once within the lifetime that should share its
resources. Build optional dependencies only in the operation or branch that needs them.

## Use one Effect method for Effect-only callers

A Promise method plus an Effect wrapper gives one operation two APIs. Adapt a Promise-based client at the I/O edge
and expose one Effect method when all callers use Effect.

Bad:

```ts
async load(id: OrderId) {
  return this.client.find(id)
}

loadEffect(id: OrderId) {
  return Effect.tryPromise({
    try: () => this.load(id),
    catch: cause => new RepositoryError({ cause }),
  })
}
```

Good:

```ts
load(id: OrderId) {
  return Effect.tryPromise({
    try: signal => this.client.find(id, { signal }),
    catch: cause => new RepositoryError({ cause }),
  })
}
```

Pass the cancellation signal when the client supports it. Keep a Promise method when Promise callers need that API.

## Run at the application boundary

Compose operations as Effects. Run the completed workflow once at the executable or framework entrypoint.
Running an inner Effect starts a separate root fiber and loses automatic propagation of cancellation and context.
Keep expected failures in the typed error channel until the boundary that handles them or maps them to the protocol.
Report unhandled failures once there.

When Effect owns the process, use its platform runtime and scopes for startup and shutdown.
When another framework owns the process, share a `ManagedRuntime` across its entrypoints and dispose it during that
framework's shutdown. Pass request cancellation and metadata per run.
