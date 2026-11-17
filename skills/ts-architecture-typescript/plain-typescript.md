# Plain TypeScript

## Assemble the executable

Pass dependencies through function arguments or constructors. Use Promises and async iterables for asynchronous work.
Keep startup and cleanup in the entrypoint. Use `try` / `finally` to close resources when the work finishes or fails.

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

## Parse configuration at startup

Load dotenv and read `process.env` only inside an executable's entry function. Read the environment once and pass it
to each capability's parser.

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

Use `randomUUID` from `node:crypto` for UUID generation in Node applications.
