# handle it, or die

## reasoning

Failures are not all the same thing.

Expected failures are part of the program. Model them as named domain errors
and carry them through the codebase's fallible return type. The names exist so
callers can decide what to do.

Unexpected defects are bugs. A corrupted invariant is not a business outcome.
Let it explode, or assert with useful context. Continuing past a corrupted
invariant usually creates a second, harder bug.

Error mapping belongs at boundaries. Translate library errors before they
enter the domain. Translate domain errors before they leave the system. A
`MongoServerError` is not a domain model. A `DuplicateEmail` is not an HTTP
response.

Logging belongs at boundaries too. If every layer logs and rethrows, one
failure becomes five log lines. Handle expected failures where they are
expected. Log the rest once, at the outermost boundary that has enough
context to explain them.

## examples

### expected failures as values

Weak:

```ts
async function createUser(input: CreateUserInput): Promise<User> {
  if (await emailExists(input.email)) {
    throw new Error("email already exists")
  }

  return insertUser(input)
}
```

Better:

```ts
class DuplicateEmail extends Error {
  readonly _tag = "DuplicateEmail"

  constructor(readonly email: string) {
    super("duplicate email")
  }
}

async function createUser(input: CreateUserInput): Promise<User> {
  if (await emailExists(input.email)) {
    throw new DuplicateEmail(input.email)
  }

  return insertUser(input)
}
```

This is still exception control flow, but at least the failure has a domain
name.

Stronger:

```ts
class DuplicateEmail extends Error {
  readonly _tag = "DuplicateEmail"

  constructor(readonly email: string) {
    super("duplicate email")
  }
}

class InvalidUser extends Error {
  readonly _tag = "InvalidUser"
}

type CreateUserError = DuplicateEmail | InvalidUser

async function createUser(
  input: CreateUserInput,
): Promise<Result<User, CreateUserError>> {
  if (await emailExists(input.email)) {
    return Result.fail(new DuplicateEmail(input.email))
  }

  return Result.succeed(await insertUser(input))
}
```

With Effect:

```ts
class DuplicateEmail extends Schema.TaggedError<DuplicateEmail>()(
  "DuplicateEmail",
  { email: Schema.String },
) {}

const createUser = (
  input: CreateUserInput,
): Effect.Effect<User, DuplicateEmail> =>
  Effect.gen(function* () {
    if (yield* emailExists(input.email)) {
      return yield* Effect.fail(new DuplicateEmail({ email: input.email }))
    }

    return yield* insertUser(input)
  })
```

The caller can now handle the expected case without catching unknown exceptions.

### map library errors inward

Weak:

```ts
async function saveUser(user: User): Promise<void> {
  await collection.insertOne(user)
}
```

This leaks whatever the database driver happens to throw.

Code smell:

```ts
async function registerUser(
  input: RegisterUserInput,
): Promise<Result<User, RegisterUserError>> {
  try {
    return Result.succeed(await userRepository.save(input))
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return Result.fail(new DuplicateEmail(input.email))
    }

    throw error
  }
}
```

The service now knows about MongoDB. A library error crossed a boundary that
should have translated it.

Stronger:

```ts
class UserAlreadyExists extends Error {
  readonly _tag = "UserAlreadyExists"

  constructor(readonly email: string) {
    super("user already exists")
  }
}

class UserPersistenceFailed extends Error {
  readonly _tag = "UserPersistenceFailed"

  constructor(readonly cause: unknown) {
    super("failed to save user")
  }
}

type SaveUserError = UserAlreadyExists | UserPersistenceFailed

async function saveUser(user: User): Promise<Result<void, SaveUserError>> {
  try {
    await collection.insertOne(user)
    return Result.succeed(undefined)
  } catch (error) {
    if (isDuplicateKey(error)) {
      return Result.fail(new UserAlreadyExists(user.email))
    }

    return Result.fail(new UserPersistenceFailed(error))
  }
}
```

Keep driver details inside the adapter. The rest of the system should see the
domain meaning.

### map domain errors outward

Weak:

```ts
const result = await createUser(command)

if (Result.isFailure(result)) {
  throw result.error
}
```

Stronger:

```ts
const result = await createUser(command)

return Result.match(result, {
  onSuccess: (user) => Response.json(user, { status: 201 }),
  onFailure: (error) => {
    switch (error._tag) {
      case "DuplicateEmail":
        return Response.json({ code: "duplicate-email" }, { status: 409 })
      case "InvalidUser":
        return Response.json({ code: "invalid-user" }, { status: 400 })
    }
  },
})
```

Each protocol has its own shape. Translate at the boundary.

### do not catch-log-rethrow

Weak:

```ts
try {
  return await createInvoice(command)
} catch (error) {
  logger.error(error, "failed to create invoice")
  throw error
}
```

If every layer does this, one failure becomes five log lines.

Stronger:

```ts
try {
  return await handleRequest(request)
} catch (error) {
  logger.error({ error, requestId }, "request failed")
  return Response.json({ code: "internal-error" }, { status: 500 })
}
```

Log once at the outermost boundary. Inside the system, either handle the
failure or let it pass through.

### defects are not business errors

Weak:

```ts
function applyTransition(state: State, event: Event): Result<State, DomainError> {
  switch (state._tag) {
    case "Draft":
      return applyDraftTransition(state, event)
    case "Published":
      return applyPublishedTransition(state, event)
    default:
      return Result.fail(new InvalidState())
  }
}
```

Stronger:

```ts
function applyTransition(state: State, event: Event): State {
  switch (state._tag) {
    case "Draft":
      return applyDraftTransition(state, event)
    case "Published":
      return applyPublishedTransition(state, event)
    default:
      assertNever(state)
  }
}
```

If the type says the state is impossible, treat reaching it as a bug. Do not
make callers recover from broken program assumptions.

### assert corrupted invariants

Weak:

```ts
if (invoice.total < 0) {
  return Result.fail(new InvalidInvoiceTotal())
}

await charge(invoice.total)
```

Stronger:

```ts
assert(invoice.total >= 0, "invoice total must not be negative")

await charge(invoice.total)
```

If a negative total is rejected user input, parse it at the boundary and return
a normal error. If a negative total can only happen because internal state is
corrupt, stop immediately.
