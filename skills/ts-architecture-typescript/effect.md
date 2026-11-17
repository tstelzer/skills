# Effect v4

## Use the v4 handbook

- Check the application's installed `effect` version.
- Read the relevant topics in skill: ts-effect-v4.
- Read its service rules before writing or reviewing services.
- Keep API details in that handbook.
- Use Effect Schema to parse data at boundaries.
- Use Effect logging for application logs.
- Use Effect services for IO and runtime inputs such as time, randomness, and settings.
- Keep native API calls in the service that owns the integration.

## Keep dependencies and resources explicit

- Use `Context.Service` for dependencies that Effect owns.
- Build those services with Layers.
- Keep pure domain functions separate from Effect services.
- Assemble the application's Layer in the entrypoint.
- Keep required services visible in the types until the entrypoint supplies them.
- Put service construction in `make`.
- Define `layerNoDeps` as `Layer.effect(this, this.make)`.
- Use `layer` to provide the service's dependencies.
- When no dependencies need wiring, name the construction Layer `layer`.
- Load each part of the application's typed settings during startup.
- Read settings through `Config` or pass them as Layer inputs.
- Keep `process.env` reads out of service code.
- Use `Redacted` for secrets.
- Let a scope own each resource from opening to closing.
- Use `Effect.acquireRelease` to tie cleanup to that scope.
- Share a Layer under one enclosing `Effect.provide` or runtime.
- Separate `Effect.provide` calls share only Layers already built by an enclosing call or runtime.
- Build optional dependencies only in the operation or branch that needs them.

## Use one Effect method for Effect-only callers

- Convert Promise calls to Effects where they enter Effect code.
- Use `Effect.promise` when no rejection has a known recovery path.
- Use `Effect.tryPromise` only to expose errors that callers recognize and can handle.
- Return each recognized error unchanged from `catch`.
- Throw every other error from `catch` so it becomes a defect.
- Apply the same rule to `Effect.sync` and `Effect.try` for synchronous calls.
- Give an operation one Effect method when all callers use Effect.

- Avoid a Promise method used only by an Effect wrapper:

```ts
async load(id: OrderId) {
  return this.client.find(id)
}

loadEffect(id: OrderId) {
  return Effect.promise(() => this.load(id))
}
```

- Expose the Effect method directly:

```ts
load = Effect.fn("OrdersRepository.load")((id: OrderId) =>
  Effect.promise(signal => this.client.find(id, { signal })),
)
```

- Pass the cancellation signal when the client supports it.
- Keep a Promise method when Promise callers need that API.

## Run at the application boundary

- Combine operations as Effects.
- Run the whole workflow once at the executable or framework entrypoint.
- Calling a runner inside an Effect starts a separate fiber: a new execution of that Effect.
- That fiber does not inherit the outer fiber's cancellation or context automatically.
- Keep expected failures in the typed error channel until a boundary handles them or maps them to the protocol.
- Report unhandled failures once at that boundary.
- When Effect owns the process, use its platform runtime and scopes for startup and shutdown.
- When another framework owns the process, share a `ManagedRuntime` across its entrypoints.
- Await `runtime.dispose()` during that framework's shutdown.
- Pass each request's cancellation signal to its run.
- Pass each request's metadata to its run.
