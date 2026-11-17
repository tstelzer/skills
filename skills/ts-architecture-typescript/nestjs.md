# NestJS

## Let Nest assemble its providers

- Keep services and repositories as Nest providers.
- Inject their dependencies through constructors.
- Keep pure domain functions separate from Nest providers.
- Group providers by domain.
- Export only the providers another module needs.
- Give each executable a root module with only the dependencies it needs.
- Do not open client connections or start work in Nest module declarations.
- Pass typed settings from the entrypoint to the module or provider factory that needs them.
- When Nest starts the application, load dotenv in the bootstrap function.
- Read `process.env` once in that function.
- Keep environment reads out of providers and decorators.

## Keep the protocol at the controller

- Parse requests into application values.
- Call one application operation.
- Map its result to the protocol's response.
- Keep protocol schemas, decorators, and framework request objects at the Nest boundary.
- Convert required observables at that boundary.
- Use Promises and async iterables inside code that does not use Effect.

## Let Nest close what it owns

- Create stateful clients in the providers or provider factories that own them.
- Use Nest lifecycle hooks for startup and cleanup.
- Enable Nest shutdown handling for long-running processes.
- Await `app.close()` for standalone application contexts.
- Stop background work before closing the dependencies it uses.
