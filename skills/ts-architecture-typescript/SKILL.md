---
name: ts-architecture-typescript
description: >-
  TypeScript application and package architecture. Use when scaffolding an application or package, adding a domain or
  feature, changing module boundaries, or adding infrastructure.
---

# TypeScript architecture

## Workspace and package boundaries

Create a workspace only for something deployed separately or code shared by multiple workspaces.
A service, frontend, mobile app, or CLI can be deployed separately. Keep domains and features in their workspace.

Weak:

```text
workspaces/
  users/
  orders/
  payments/
```

Stronger when one application owns all three domains:

```text
workspaces/api/src/
  users/
  orders/
  payments/
```

Create an internal `core`, `lib`, or `domain` workspace when multiple
workspaces share that code. Keep it private. Publish an npm package only when
other repositories need the code or you intend to release it as open source.

## Executables

Give each executable one entrypoint. Assemble the application there: load runtime inputs, create adapters,
connect resources, start the process, and close resources. This is the composition root.

Keep imports free of side effects. Importing a module must not connect to a database, start a server,
register process handlers, or run a command.

Weak:

```ts
// users.repository.ts
export const mongo = await MongoClient.connect(process.env.MONGO_URL!)
export const users = new MongoUserRepository(mongo)

// server.ts
await startServer({ users })
```

Stronger:

```ts
// app.ts
export const makeApp = ({ users }: Dependencies) => ({
  start: () => startServer({ users }),
})

// main.ts
export const main = async () => {
  const mongoConfig = parseMongoConfig(process.env)
  const mongo = new MongoClient(mongoConfig.url)
  await mongo.connect()

  try {
    const users = new MongoUserRepository(mongo)
    const app = makeApp({ users })
    await app.start()
  } finally {
    await mongo.close()
  }
}
```

Use a separate entrypoint for each independently run API, worker, CLI, or
scheduled task. Set up only the resources that executable needs.

For a CLI with multiple subcommands, give each subcommand its own module. Put its arguments, command setup,
and CLI coordination there. Keep business and storage logic outside it. The entrypoint loads configuration,
assembles the command tree, creates shared dependencies, runs the command, and closes resources.

```text
src/
  cli.ts
  cli/
    pull.command.ts
    push.command.ts
    status.command.ts
```

## File roles

Choose the most specific role that fits the behavior.

| Role                    | Owns                                                                            |
| ----------------------- | ------------------------------------------------------------------------------- |
| Concept module          | Domain types, schemas, rules that must hold, constructors, and pure functions    |
| Top-level function      | Stateless logic that makes its caller clearer, kept with its domain             |
| Service                 | Work that coordinates dependencies or manages its own lifecycle                |
| Repository              | Storage operations and translation between stored and application values       |
| Adapter                 | A stateful client and the domain operations it supports                         |
| Controller or handler   | Protocol input, request context, one application operation, and protocol output |
| DTO                     | Protocol schemas, wire types, and translation to or from domain values          |
| Configuration module    | One capability's environment parser and typed settings                          |
| Framework-specific file | Framework setup such as Nest modules, providers, decorators, or Effect layers  |
| Composition root        | Runtime inputs, object creation, startup, and shutdown                          |

Do not create one file for every function. Keep a small function beside its
domain types or the workflow that uses it.

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

Put a workflow in the service responsible for it. Add a service only when the work needs a separate owner.
Call a dependency directly when that call does the whole job.

Weak:

```ts
class UserService {
  findById(id: UserId) {
    return this.users.findById(id)
  }
}
```

Stronger:

```ts
const handleShowUser = async (
  request: ShowUserRequest,
  users: UserRepository,
): Promise<ShowUserResponse> => {
  const id = UserId.parse(request.params.id)
  const user = await users.findById(id)
  return user === null ? { status: 404 } : { status: 200, body: user }
}

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

Always put a constructed, stateful client behind an application adapter. The adapter accesses the client,
translates its data, and exposes domain operations rather than the vendor API.
Create and close the client in the adapter or composition root. Pure, stateless client modules may be used directly.

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

A controller, handler, or consumer translates between the protocol and application. It parses input, sets up request
context, calls one application operation, and translates the result back. Keep business rules and storage outside it.

## Configuration and secrets

- Load dotenv and read `process.env` only inside an executable's entry
  function.
- Read the environment once at the entrypoint. Do not use it as global application configuration.
- Let each capability define a parser that extracts only its own settings. Call those parsers in the composition root
  and pass their typed results to the code that needs them.
- Do not create or inject one config object containing unrelated settings.
- Convert environment names to application names during parsing.
- Wrap secrets in a redacted type. Reveal them only at the final client or
  process boundary.
- Keep secret values out of committed configuration, errors, logs, and
  serialized objects.

Weak:

```ts
// payments.service.ts
dotenv.config()

class PaymentsService {
  private readonly client = new PaymentsClient({
    apiKey: process.env.PAYMENTS_API_KEY!,
  })
}
```

Stronger:

```ts
// payments.config.ts
const PaymentsEnv = z
  .object({
    PAYMENTS_URL: z.url(),
    PAYMENTS_API_KEY: z.string().min(1),
  })
  .transform((env) => ({
    baseUrl: new URL(env.PAYMENTS_URL),
    apiKey: Secret.make(env.PAYMENTS_API_KEY),
  }))

export const parsePaymentsConfig = (env: unknown) =>
  PaymentsEnv.parse(env)

export type PaymentsConfig = z.output<typeof PaymentsEnv>

// payments.adapter.ts
export class PaymentsAdapter implements Payments {
  private readonly client: PaymentsClient

  constructor(config: PaymentsConfig) {
    this.client = new PaymentsClient({
      baseUrl: config.baseUrl,
      apiKey: Secret.value(config.apiKey),
    })
  }
}

// main.ts
export const main = async () => {
  dotenv.config()
  const env = process.env

  const payments = new PaymentsAdapter(parsePaymentsConfig(env))
  const users = new MongoUserRepository(parseMongoConfig(env))

  await startApp({ payments, users })
}
```

## Library selection

Prefer focused libraries, platform APIs, and official clients. Put stateful
clients behind adapters even when the client is the preferred low-level
library.

| Avoid                                                        | Prefer                                      |
| ------------------------------------------------------------ | ------------------------------------------- |
| Joi, Yup, `class-validator`/`class-transformer`, Superstruct  | Zod or Effect Schema                        |
| Global config libraries and super-config services            | Capability-owned schema parsers             |
| Winston or `console` for application logging                 | Pino or Effect logging                      |
| Lodash for basic array, object, string, or numeric operations | Built-in JavaScript APIs                    |
| ORMs and ODMs such as Mongoose                               | Official database clients or query builders |
| The `uuid` package when Node provides UUID generation         | `randomUUID` from `node:crypto`              |
| RxJS                                                         | Promises, async iterables, or explicit APIs |
| Moment                                                       | date-fns or Day.js                          |

Do not add a wrapper around a pure utility solely to hide the library. Import
`date-fns` functions where the domain logic uses them. Adapt RxJS at a framework
boundary when the framework requires it; do not spread observables through the
application. Deliberate CLI output to stdout or stderr is not application
logging.
