---
name: ts-architecture-nestjs-effect
description: Use this guidance when integrating Nest and Effect.
---

## Give Nest one Effect runtime when Nest owns the process

Nest creates providers and defines their shutdown lifecycle. A runtime inside each service gives each Layer its own
scope and finalizers. Logging and tracing can diverge across those runtimes. Register one `ManagedRuntime` as a Nest
provider per application context. Inject that provider where Nest starts Effect work.

Bad:

```text
SearchService -> ManagedRuntime(SearchLayer)
OrdersService -> ManagedRuntime(OrdersLayer)
Scheduler    -> ManagedRuntime(SchedulerLayer)
```

Good:

```text
EffectModule -> EffectRunner -> ManagedRuntime(ApplicationLayer)
SearchController -> EffectRunner
OrdersConsumer   -> EffectRunner
Scheduler        -> EffectRunner
```

The application Layer connects Effect to the logger, tracing, metrics, and platform services used by that Nest
application. A service that only returns Effects does not need `EffectRunner`.

## Start Nest adapters on demand

Defer Nest startup when only some operations need its providers. Build the adapter Layer inside the operation or
workflow branch that uses it. For example, returning cached results or showing CLI help should not start Nest.
Start Nest eagerly when its availability is a startup requirement.

When Effect creates the Nest application context, let an enclosing Effect scope own its lifetime. Use a small root
module containing only the needed Nest dependencies. Acquire the context with `Effect.acquireRelease` and release
it with `app.close()`.

Bad:

```ts
program.pipe(Effect.provide(nestLayer))
```

Good:

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

Here, `makeReportsModule` returns the small root module. `makeNestApplicationContextLayer` is an application helper
that owns the acquire/release pair above.

For repeated calls, get `scope` with `yield* Effect.scope` inside the owning `Effect.scoped`.
Create one loader with `yield* Effect.cached(Layer.buildWithScope(nestLayer, scope))`. Run that loader only when
Nest is needed and provide its resulting context to each call. Concurrent callers share startup.
Closing the owning scope closes Nest.

`Layer.suspend` delays the factory until the Layer is built. Providing it around the whole program still builds
it before choosing a branch. Static imports still run eagerly; use `import()` inside a deferred Effect when loading
the JavaScript module must also wait.

## Use Nest injection for Nest services

Mirroring every Nest provider as an Effect service creates two dependency graphs for the same application. Each graph
then needs its own wiring and lifecycle. Keep Nest services and repositories as Nest providers. Their methods may
return Effects without becoming `Context.Service` classes.

Bad:

```text
Nest:   OrdersRepository -> OrdersService
Effect: OrdersRepositoryTag -> OrdersRepositoryLayer -> OrdersServiceTag
```

Good:

```ts
@Injectable()
class OrdersService {
  constructor(private readonly orders: OrdersRepository) {}

  place(input: PlaceOrder) {
    return this.orders.insert(input).pipe(Effect.map(toOrder))
  }
}
```

Use an Effect service or Layer when an Effect-owned component needs that service graph or owns scoped resources. Adapt
only the Nest dependencies that component needs. Do not look up arbitrary Nest providers inside its workflow.

## Use one Effect method for Effect-only callers

A Promise method plus an Effect wrapper gives one operation two APIs. If all callers use the wrapper, the Promise
method has no independent purpose. It also makes it easy to lose cancellation and typed failures at the wrapper.
Adapt a Promise-based client at the I/O edge and expose one Effect method.

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

Pass the cancellation signal when the client supports it. Keep a Promise method when Promise callers actually need
that API; do not create it as an intermediate step for Effect callers.

## Stay in Effect until Nest runs the workflow

Running an inner Effect starts a new root fiber. Its failure leaves the typed error channel, and the outer fiber no
longer supplies cancellation or context automatically. Compose service calls as Effects and run the completed workflow
once at a Nest controller, consumer, scheduled job, or lifecycle hook.

Bad:

```ts
class OrdersRepository {
  insert(input: PlaceOrder) {
    return Effect.tryPromise(signal => this.client.insert(input, { signal }))
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

Good:

```ts
class OrdersRepository {
  insert(input: PlaceOrder) {
    return Effect.tryPromise(signal => this.client.insert(input, { signal }))
  }
}

class OrdersService {
  place(input: PlaceOrder) {
    return this.orders.insert(input).pipe(
      Effect.flatMap(order => this.payments.reserve(order)),
    )
  }
}

class OrdersController {
  place(body: PlaceOrder, signal: AbortSignal) {
    return this.ordersService.place(body).pipe(
      effect => this.runner.runPromise(effect, { signal }),
    )
  }
}
```

The bad service returns a `Promise<Effect>`. The controller cannot pass its signal or fiber context to the
repository run because that run already happened inside the service.

## Map failures where Nest receives the result

The shared runner cannot know whether a typed failure means HTTP 404, a rejected message, or a retried job. Keep
execution in the runner. Map expected failures at the Nest entrypoint that knows the protocol. Report unhandled
failures once there; logging every failure in the runner also logs routine business outcomes as errors.

Bad:

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

Good:

```ts
return this.ordersService.place(body).pipe(
  Effect.catchTag('OutOfStock', () =>
    Effect.fail(new ConflictException('Order item is out of stock')),
  ),
  effect => this.runner.runPromise(effect, { signal }),
)
```

The controller maps `OutOfStock` to HTTP 409. Other failures reach the application's exception filter.

## Share observability, pass request context per run

Separate loggers and telemetry exporters split one request across different records. A logger bridge that forwards
only the message drops Effect annotations and causes. Start the application's OpenTelemetry instrumentation before
Nest creates instrumented clients. Connect Effect to that telemetry pipeline and the Nest logger.

Bad:

```text
Nest logs -> Pino               Effect logs -> console
Nest spans -> OTel exporter A   Effect spans -> OTel exporter B
```

Good:

```text
Effect log level, message, annotations, cause -> Nest/Pino logger
Effect spans and parent context              -> application OTel pipeline
Nest request signal, trace parent, request ID -> one Effect run
```

The runtime is shared across requests. Supply cancellation, trace parent, and request metadata for each run rather
than storing request state in that runtime.

## Close Effect work through Nest

A Nest-owned runtime is only useful if Nest closes it. Long-running fibers and telemetry exporters need an ordered
shutdown so work stops before its dependencies disappear. Enable Nest shutdown handling for long-running processes,
close application contexts when they finish, and give owned fibers a stop path.

Bad:

```text
SIGTERM -> process exits
worker fiber, ManagedRuntime, telemetry exporter: no application shutdown
```

Good:

```text
Nest shutdown or app.close()
  -> stop owned worker fibers
  -> dispose ManagedRuntime
  -> flush and stop telemetry
```
