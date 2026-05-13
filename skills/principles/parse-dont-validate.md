# parse, don't validate

## reasoning

Validation asks whether a value looks acceptable. Parsing turns an unknown value
into a known value, or refuses to produce one.

That difference matters. A boolean validator usually leaves the original
value behind, still broad and still easy to misuse after the check. A parser
should return a smaller type that the rest of the program can trust.

Do this at boundaries: HTTP payloads, CLI args, env, config, database rows,
queue messages, events, files, local storage, model output, and third-party API
responses. A boundary is any place where TypeScript did not create the value.

After the boundary, stop acting scared. Do not keep re-checking the same fields
inside every function. If the value was parsed into a domain type, write normal
code against that domain type. If a later function still needs `unknown`, casts,
or defensive checks, the parse boundary is probably in the wrong place or the
parsed type is too weak.

Parsing should also translate shape. External names, wire formats, nullable
fields, stringly typed numbers, and permissive legacy shapes should not leak
far into the domain. Parse them once, then deal with the domain model.

Parsing should preserve invariants. If a value has variants, parse it into
variants. Prefer discriminated unions over broad objects with many optional
fields. Optional-property shapes force every consumer to rediscover which
combinations are legal.

## examples

### boolean checks are not enough

Weak:

```ts
function isCreateUserInput(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "email" in value &&
    "name" in value
  )
}

if (!isCreateUserInput(request.body)) {
  return Response.json({ code: "invalid-body" }, { status: 400 })
}

const user = await createUser(request.body as CreateUserInput)
```

The check did not produce a trusted value. The cast is doing the real work.

Stronger:

```ts
const result = CreateUserInput.safeParse(request.body)

if (!result.success) {
  return Response.json({ code: "invalid-body" }, { status: 400 })
}

const command = result.data
const user = await createUser(command)
```

The parser turns `unknown` into `CreateUserInput`. The rest of the code should
not need to care where it came from.

### parse at the edge

Weak:

```ts
async function createUser(input: unknown): Promise<User> {
  const result = CreateUserInput.safeParse(input)

  if (!result.success) {
    throw new InvalidUserInput()
  }

  return insertUser(result.data)
}
```

This pushes boundary work into the domain operation.

Stronger:

```ts
const result = CreateUserInput.safeParse(request.body)

if (!result.success) {
  return Response.json({ code: "invalid-body" }, { status: 400 })
}

const user = await createUser(result.data)
```

```ts
async function createUser(command: CreateUserInput): Promise<User> {
  return insertUser(command)
}
```

The handler owns HTTP parsing. The domain operation receives a domain value.

### parse into the shape you want

Weak:

```ts
const result = Env.safeParse(process.env)

if (!result.success) {
  throw new InvalidConfig()
}

const port = Number(result.data.PORT)
const logLevel = result.data.LOG_LEVEL ?? "info"
```

This parsed too little. The rest of the program still deals with env shape.

Stronger:

```ts
const Config = z.object({
  PORT: z.coerce.number().int().positive(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
}).transform((env) => ({
  port: env.PORT,
  logLevel: env.LOG_LEVEL,
}))

const config = Config.parse(process.env)
```

The trusted value now has application names and application types.

### parse variants into discriminated unions

Weak:

```ts
const Payment = z.object({
  type: z.enum(["card", "bank-transfer"]),
  cardToken: z.string().optional(),
  iban: z.string().optional(),
})
```

This accepts states the domain does not want: a card payment without a card
token, a bank transfer without an IBAN, or a payment with both.

Stronger:

```ts
const CardPayment = z.object({
  type: z.literal("card"),
  cardToken: z.string(),
})

const BankTransferPayment = z.object({
  type: z.literal("bank-transfer"),
  iban: z.string(),
})

const Payment = z.discriminatedUnion("type", [
  CardPayment,
  BankTransferPayment,
])
```

After parsing, each branch has the fields it needs.

```ts
function describePayment(payment: z.output<typeof Payment>): string {
  switch (payment.type) {
    case "card":
      return `card:${payment.cardToken}`
    case "bank-transfer":
      return `bank:${payment.iban}`
  }
}
```

The switch narrows the value. No defensive field checks and no impossible
combinations.

### database rows are boundaries too

Weak:

```ts
const row = await db.user.findById(id)

return {
  id: row.id,
  email: row.email,
  createdAt: new Date(row.created_at),
}
```

Stronger:

```ts
const UserRow = z.object({
  id: z.uuid(),
  email: z.email(),
  created_at: z.iso.datetime(),
})

const row = UserRow.parse(await db.user.findById(id))

return {
  id: row.id,
  email: row.email,
  createdAt: new Date(row.created_at),
}
```

Database clients, migrations, and hand-written queries can drift. Parse the row
before mapping it into the domain.

### Effect schema at boundaries

```ts
class CreateUserCommand extends Schema.Class<CreateUserCommand>(
  "CreateUserCommand",
)({
  email: Schema.String,
  name: Schema.String,
}) {}

const decodeCreateUserCommand =
  Schema.decodeUnknownEither(CreateUserCommand)

const result = decodeCreateUserCommand(request.body)
```

The same principle applies: decode unknown input once, then pass the decoded
domain value inward.

### do not keep re-checking parsed values

Weak:

```ts
function sendWelcomeEmail(user: User): Promise<void> {
  if (!user.email || !user.email.includes("@")) {
    throw new InvalidEmail()
  }

  return email.send(user.email, "Welcome")
}
```

Stronger:

```ts
function sendWelcomeEmail(user: User): Promise<void> {
  return email.send(user.email, "Welcome")
}
```

If `User` can exist with an invalid email, fix `User` or the parser that creates
it. Do not make every consumer defend itself from the same broken shape.
