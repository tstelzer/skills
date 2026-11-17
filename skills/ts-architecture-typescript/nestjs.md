# NestJS

## Let Nest assemble its providers

Keep services and repositories as Nest providers. Inject their dependencies through constructors.
Keep pure domain functions outside the provider graph.

Group providers by domain. Export only the providers another module needs.
Give each executable a root module containing only the dependencies it needs.
Keep Nest module declarations free of client connections and other startup work.

Pass typed settings from the composition root into each capability's module or provider factory.
For a Nest-owned executable, load dotenv and read `process.env` once in the bootstrap function.
Keep environment reads out of providers and decorators.

## Keep the protocol at the controller

Parse requests into application values, call one application operation, and map its result to the protocol.
Keep protocol schemas, decorators, and framework request objects at the Nest boundary.
Adapt framework-required observables there; use Promises and async iterables inside code that does not use Effect.

## Let Nest close what it owns

Create stateful clients in their owning providers or provider factories. Use Nest lifecycle hooks for startup and
cleanup. Enable Nest shutdown handling for long-running processes. Await `app.close()` for standalone contexts.
Stop owned background work before closing its dependencies.
