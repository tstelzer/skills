# Plain TypeScript

## Assemble the executable

- Pass dependencies through function arguments or constructors.
- Use Promises and async iterables for asynchronous work.
- Keep startup and cleanup in the entrypoint.
- Use `try` / `finally` to close resources when the work finishes or fails.

- Avoid connecting during import:

```ts
// users.repository.ts
export const mongo = await MongoClient.connect(process.env.MONGO_URL!)
export const users = new MongoUserRepository(mongo)

// server.ts
await startServer({ users })
```

- Put startup and cleanup in `main`:

```ts
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

## Parse configuration at startup

- Load dotenv only inside the executable's entry function.
- Read `process.env` once in that function.
- Pass the environment to each settings parser.

- Avoid reading the environment inside services:

```ts
// payments.service.ts
dotenv.config()

class PaymentsService {
  private readonly client = new PaymentsClient({
    apiKey: process.env.PAYMENTS_API_KEY!,
  })
}
```

- Parse settings at startup:

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

- Use `randomUUID` from `node:crypto` to generate UUIDs in Node applications.
