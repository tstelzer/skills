# Shared TypeScript architecture

## Workspace and package boundaries

- Create a workspace only for a separately deployed program or code shared by several workspaces.
- A service, frontend, mobile app, or CLI can have its own deployment.
- Keep an application's domains and features in its workspace.

- Avoid splitting one application into workspaces by domain:

```text
workspaces/
  users/
  orders/
  payments/
```

- Keep those domains in the application's workspace:

```text
workspaces/api/src/
  users/
  orders/
  payments/
```

- Create an internal `core` or `lib` workspace when several workspaces share the code.
- Keep internal workspaces private.
- Publish an npm package only when other repositories need the code or you plan to release it as open source.

## Executables

- Give each separately run API, worker, CLI, or scheduled task one entrypoint.
- The entrypoint is the composition root: the place that puts the application together.
- Load runtime inputs there.
- Construct dependencies there.
- Connect resources there.
- Start the application there.
- Close resources there.
- Set up only the resources that the executable needs.
- Importing a module must not start work such as connecting to a database or starting a server.
- Do not register process handlers during import.
- Do not run commands during import.
- Give each CLI subcommand its own module.
- Keep its arguments, command setup, and calls to application code in that module.
- Keep business rules and storage code outside command modules.
- Assemble the command tree in the entrypoint.
- Run the selected command from the entrypoint.

```text
src/
  cli.ts
  cli/
    pull.command.ts
    push.command.ts
    status.command.ts
```

## File roles

- Choose the most specific role that describes what the code does.
- A domain module keeps one concept's types, schemas, rules, constructors, and pure functions together.
- A top-level function holds stateless work that makes its caller clearer.
- A service coordinates dependencies or manages its own resources over time.
- A repository owns storage calls and conversion between stored and application values.
- An adapter translates a client's API into application operations.
- A controller or handler owns request parsing, request context, one application call, and the response.
- A DTO defines the data sent over a protocol and how it maps to domain values.
- A config module owns one part of the application's settings parser and typed settings.
- A framework file sets up modules, providers, decorators, or Layers.
- The composition root owns runtime inputs, object creation, startup, and shutdown.
- Do not create one file for every function.
- Keep a small function beside its domain types or the workflow that uses it.

```ts
// invoice.ts
export interface Invoice {
  readonly lines: ReadonlyArray<InvoiceLine>
}

export const invoiceTotal = (invoice: Invoice): Money =>
  invoice.lines.reduce(
    (total, line) => Money.add(total, line.total),
    Money.zero,
  )
```

- Put a workflow in the service responsible for it.
- Add a service only when the work needs a separate owner.
- Call a dependency directly when that call does the whole job.

- Avoid services that only forward calls:

```ts
class UserService {
  findById(id: UserId) {
    return this.users.findById(id)
  }
}
```

- Call the repository directly for a lookup:

```ts
const handleShowUser = async (
  request: ShowUserRequest,
  users: UserRepository,
): Promise<ShowUserResponse> => {
  const id = UserId.parse(request.params.id)
  const user = await users.findById(id)
  return user === null ? { status: 404 } : { status: 200, body: user }
}
```

- Use a service when the workflow needs to coordinate dependencies:

```ts
class RegisterUser {
  constructor(
    private readonly users: UserRepository,
    private readonly mail: WelcomeMail,
  ) {}

  async execute(input: Registration): Promise<User> {
    const user = await this.users.insert(User.create(input))
    await this.mail.sendTo(user)
    return user
  }
}
```

- Keep client details inside the module that owns the integration.
- Add an adapter only when the client's API needs translation.
- Let the owning module or entrypoint manage client setup and cleanup.
- Call a client directly when its API already fits the operation.

```ts
// main.ts
export const makeRegisterUser = (
  mongo: MongoClient,
  welcomeMail: WelcomeMail,
) => {
  const users = new MongoUserRepository(mongo)
  return new RegisterUser(users, welcomeMail)
}

// invoice.ts
import { addDays } from "date-fns"

export const paymentDueAt = (issuedAt: Date) => addDays(issuedAt, 30)
```

- Let controllers, handlers, and consumers translate between the protocol and the application.
- Parse incoming data there.
- Set up request context there.
- Call one application operation.
- Translate the result into the protocol's response.
- Keep business rules and storage code outside these handlers.

## Configuration and secrets

- Load runtime settings in the entrypoint.
- Do not use the environment as global application settings.
- Let each part of the application parse only its own settings.
- Call those parsers in the entrypoint.
- Pass their typed results to the code that needs them.
- Do not combine unrelated settings in one config object.
- Convert environment names to application names while parsing.
- Wrap secrets in a type that hides their value when logged or serialized.
- Reveal secrets only when passing them to the final client or process.
- Keep secret values out of committed config, errors, logs, and serialized objects.

## Library selection

- Prefer libraries with a clear job, platform APIs, and official clients.
- Use Zod or Effect Schema instead of Joi, Yup, `class-validator`, `class-transformer`, or Superstruct.
- Use each part's settings parser instead of a global config library or service.
- Use Pino or Effect logging instead of Winston or `console` for application logs.
- Use built-in JavaScript APIs instead of Lodash for basic array, object, string, or number operations.
- Use official database clients or query builders instead of ORMs or ODMs such as Mongoose.
- Use the runtime's UUID API instead of the `uuid` package when the runtime provides one.
- Use Promises, async iterables, or explicit APIs instead of RxJS.
- Use date-fns or Day.js instead of Moment.
- Do not wrap a pure utility just to hide its library.
- Import `date-fns` functions where the domain code uses them.
- Convert required RxJS observables at the framework boundary.
- Keep observables out of the rest of the application.
- CLI output to stdout or stderr is separate from application logs.
