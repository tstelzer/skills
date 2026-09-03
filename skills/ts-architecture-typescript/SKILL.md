---
name: ts-architecture-typescript
description: >-
  TypeScript application and package architecture. Use when scaffolding an application or package, adding a domain or
  feature, changing module boundaries, or adding infrastructure.
---

# TypeScript architecture

## Workspace and package boundaries

Create a workspace only for a distinct deployable unit or code shared by
multiple workspaces. A service, frontend, mobile application, or CLI is a
deployable unit. Keep domains and features inside their owning workspace.

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
code must be consumed from other repositories or is deliberately open-sourced.

## Executables

Give each executable one entrypoint. Use it as the composition root: load
runtime inputs, construct adapters, connect resources, start the process, and
close resources.

Keep imports inert. Importing a module must not connect to a database, start a
server, register process handlers, or run a command.

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
scheduled task. Compose only the resources that executable needs.

For a CLI with multiple subcommands, give each subcommand its own module. The
module owns its arguments, command wiring, and CLI-specific boundary
orchestration. Keep business and storage logic outside it. The entrypoint loads
configuration, assembles the command tree, constructs shared dependencies,
runs it, and closes resources.

```text
src/
  cli.ts
  cli/
    pull.command.ts
    push.command.ts
    status.command.ts
```

## File roles

Choose the narrowest role that owns the behavior.

| Role                    | Owns                                                                            |
| ----------------------- | ------------------------------------------------------------------------------- |
| Concept module          | Domain types, schemas, invariants, constructors, and related pure functions     |
| Top-level function      | Named stateless logic that improves its caller, co-located with its domain       |
| Service                 | A workflow that coordinates dependencies, or behavior with owned lifecycle      |
| Repository              | Persistence operations and mapping between stored and application values        |
| Adapter                 | A stateful client and the domain-shaped operations exposed above it              |
| Controller or handler   | Protocol input, request context, one application operation, and protocol output |
| DTO                      | Protocol schemas, wire types, and mapping to or from domain values               |
| Configuration module    | One capability's environment parser and typed configuration slice               |
| Framework-specific file | Framework wiring such as Nest modules, providers, decorators, or Effect layers  |
| Composition root        | Runtime input, construction, startup, and shutdown                              |

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

Use a service when it implements a workflow. Call a dependency directly when
that call is the complete operation.

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

Always put a constructed, stateful client behind an application adapter. The
adapter owns client access and boundary translation, and exposes domain-shaped
operations instead of the vendor API. Construct and close the client inside the
adapter or composition root. Pure, stateless client modules may be used
directly.

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

A controller, handler, or consumer translates its protocol boundary. It parses
input, establishes request context, calls one application operation, and maps
the result back to the protocol. It does not own business rules or storage.

## Configuration and secrets

- Load dotenv and read `process.env` only inside an executable's entry
  function.
- Treat the environment as one boundary read, not as a global application
  configuration.
- Let each capability define a parser that extracts only its configuration
  slice. Invoke those parsers in the composition root and pass typed results
  inward.
- Do not construct or inject a super-config containing unrelated settings.
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
