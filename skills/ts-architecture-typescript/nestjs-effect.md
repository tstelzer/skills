# NestJS with Effect

- Read the provider rules below.
- If Nest starts the application, read [Nest owns the process](#nest-owns-the-process).
- If an Effect program opens Nest, read [Effect owns the process](#effect-owns-the-process).

## Use Nest injection for Nest services

- Let Nest inject the dependencies of Nest providers.
- Return Effects from provider methods without creating matching Effect services.
- Duplicating Nest providers as Effect services gives each system its own setup and cleanup to manage.

- Avoid registering the same services in both systems:

```text
Nest:   OrdersRepository -> OrdersService
Effect: OrdersRepository -> OrdersRepository.layer -> OrdersService
```

- Return an Effect from the Nest provider:

```ts
@Injectable()
class OrdersService {
  constructor(private readonly orders: OrdersRepository) {}

  place = Effect.fn("OrdersService.place")((input: PlaceOrder) =>
    this.orders.insert(input).pipe(Effect.map(toOrder)),
  )
}
```

- Use an Effect service or Layer when an Effect component needs Effect dependencies or owns scoped resources.
- Adapt only the Nest dependencies that component needs.
- Do not look up arbitrary Nest providers inside the workflow.

## Nest owns the process

### Give Nest one Effect runtime

- Let Nest create providers and manage their shutdown.
- Register one `ManagedRuntime` as a Nest provider per application context.
- Inject that provider where Nest starts Effect work.
- A runtime in each service creates separate scopes and cleanup work.
- Separate runtimes can use different logging and tracing settings.

- Avoid a runtime in each service:

```text
SearchService -> ManagedRuntime(SearchLayer)
OrdersService -> ManagedRuntime(OrdersLayer)
Scheduler    -> ManagedRuntime(SchedulerLayer)
```

- Share one runtime through a Nest provider:

```text
EffectModule -> EffectRunner -> ManagedRuntime(ApplicationLayer)
SearchController -> EffectRunner
OrdersConsumer   -> EffectRunner
Scheduler        -> EffectRunner
```

- Connect Effect to the application's logger, tracing, metrics, and platform services through the application Layer.
- A service that only returns Effects does not need `EffectRunner`.

### Stay in Effect until Nest runs the workflow

- Combine service calls as Effects.
- Run the whole workflow once at a Nest controller, consumer, scheduled job, or lifecycle hook.
- Calling a runner inside an Effect starts a separate fiber.
- That call moves failures out of the typed error channel.
- The new fiber does not inherit the outer fiber's cancellation or context automatically.

- Avoid running part of the workflow inside a service:

```ts
class OrdersRepository {
  insert(input: PlaceOrder) {
    return Effect.promise(signal => this.client.insert(input, { signal }))
  }
}

class OrdersService {
  async place(input: PlaceOrder) {
    const order = await this.runner.runPromise(this.orders.insert(input))
    return this.payments.reserve(order)
  }
}

class OrdersController {
  async place(body: PlaceOrder) {
    const payment = await this.ordersService.place(body)
    return this.runner.runPromise(payment)
  }
}
```

- Pass the whole workflow to the runner at the controller:

```ts
class OrdersRepository {
  insert = Effect.fn("OrdersRepository.insert")((input: PlaceOrder) =>
    Effect.promise(signal => this.client.insert(input, { signal })),
  )
}

class OrdersService {
  place = Effect.fn("OrdersService.place")((input: PlaceOrder) =>
    this.orders.insert(input).pipe(
      Effect.flatMap(order => this.payments.reserve(order)),
    ),
  )
}

class OrdersController {
  place(body: PlaceOrder, signal: AbortSignal) {
    return this.ordersService.place(body).pipe(
      effect => this.runner.runPromise(effect, { signal }),
    )
  }
}
```

- The first service returns a `Promise<Effect>`.
- Its repository call has already run before the controller can pass a cancellation signal or context.

### Map failures where Nest receives the result

- Keep execution in the shared runner.
- Map expected failures at the Nest entrypoint that knows the protocol.
- The runner cannot choose between an HTTP response, a rejected message, or a retried job.
- Report unhandled failures once at that entrypoint.
- Do not log routine business outcomes as errors in the runner.

- Avoid turning every failure into an HTTP 500 in the runner:

```ts
async runAtController(effect: Effect.Effect<unknown, unknown>) {
  try {
    return await this.runtime.runPromise(effect)
  } catch (error) {
    this.logger.error(error)
    throw new InternalServerErrorException()
  }
}
```

- Map the business failure at the controller:

```ts
return this.ordersService.place(body).pipe(
  Effect.catchTag('OutOfStock', () =>
    Effect.fail(new ConflictException('Order item is out of stock')),
  ),
  effect => this.runner.runPromise(effect, { signal }),
)
```

- The controller maps `OutOfStock` to HTTP 409.
- Other failures reach the application's exception filter.

### Share logging and tracing

- Use the same logging and tracing setup for Nest and Effect.
- Forward Effect log levels, messages, annotations, and causes to the Nest logger.
- Start OpenTelemetry before Nest creates clients that it needs to trace.
- Send Effect traces through the application's OpenTelemetry setup.

- Avoid separate logging and tracing paths:

```text
Nest logs -> Pino               Effect logs -> console
Nest spans -> OTel exporter A   Effect spans -> OTel exporter B
```

- Connect both systems to the same outputs:

```text
Effect log level, message, annotations, cause -> Nest/Pino logger
Effect spans and parent context              -> application OTel pipeline
Nest request signal, trace parent, request ID -> one Effect run
```

- Share the runtime across requests.
- Pass each request's cancellation signal to its run.
- Pass the parent trace and request metadata to that run.
- Keep request state out of the shared runtime.

### Close Effect work through Nest

- Enable Nest shutdown handling for long-running processes.
- Close application contexts when their work ends.
- Give background fibers a way to stop.
- Stop work before closing the dependencies it uses.
- Await `runtime.dispose()` during Nest shutdown.
- Runtime disposal interrupts managed fibers before releasing Layer resources.

- Avoid exiting without cleanup:

```text
SIGTERM -> process exits
worker fiber, ManagedRuntime, telemetry exporter: no application shutdown
```

- Close resources in dependency order:

```text
Nest shutdown or app.close()
  -> stop owned worker fibers
  -> dispose ManagedRuntime
  -> flush and stop telemetry
```

## Effect owns the process

### Start Nest adapters on demand

- Start Nest only when an operation needs its providers.
- Build the adapter Layer inside the operation or branch that uses it.
- Returning a cached result or showing CLI help should not start Nest.
- Start Nest at application startup when the application cannot run without it.
- Let an enclosing Effect scope own the Nest application context that Effect creates.
- Use a root module with only the Nest dependencies the operation needs.
- Acquire the context with `Effect.acquireRelease`.
- Release it with `app.close()`.

- Avoid providing an optional Nest Layer around the whole program:

```ts
program.pipe(Effect.provide(nestLayer))
```

- Provide it in the branch that needs Nest:

```ts
const nestLayer = Layer.suspend(() =>
  makeNestApplicationContextLayer(makeReportsModule()),
)

const program = Effect.gen(function* () {
  const cached = yield* readCachedReport
  if (cached !== undefined) return cached
  return yield* buildReport.pipe(Effect.provide(nestLayer))
})
```

- `makeReportsModule` returns the small root module.
- `makeNestApplicationContextLayer` is an application helper that owns the acquire/release pair.
- For repeated calls, get `scope` with `yield* Effect.scope` inside the owning `Effect.scoped`.
- Create one loader with `yield* Effect.cached(Layer.buildWithScope(nestLayer, scope))`.
- Run that loader only when Nest is needed.
- Supply the returned context to each call with `Effect.provideContext`.
- Concurrent callers share startup.
- Closing the owning scope closes Nest.
- `Layer.suspend` delays its factory until the Layer is built.
- Providing that Layer around the whole program still builds it before choosing a branch.
- Static imports load their modules before the program chooses a branch.
- To delay loading a module too, call `import()` inside a deferred Effect.
