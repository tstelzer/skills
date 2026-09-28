# handle it, or die

## reasoning

An error type earns its place when it helps a caller decide what to do. A pricing
rule can fail with `DiscountTooLarge` because the caller can ask for a smaller
discount. Renaming every failure to `PricingFailed` removes that distinction.
Adding a wrapper at each layer also makes the original failure harder to find.

Parsing and enriching keep the failure's meaning while making it easier to handle
or explain. Domain mapping changes that meaning. A database constraint can mean
that an email is taken; a database outage cannot. The mapping needs evidence for
the business claim it makes.

External users and internal handlers need different information. A handler may
need a driver code to recover. An operator needs the cause to debug a failure.
An HTTP caller needs a safe response. Keeping the original error until this last
boundary supports those needs without making every internal layer translate it.

In Effect,
[defects sit outside the typed error channel](https://effect.website/docs/v4/error-management/two-error-types).
A handler for typed failures alone will miss them. The final boundary must cover
defects too, so they produce a safe response and a useful report. That response
does not make it safe to resume work after a broken invariant.

## examples

The examples use `Result` for expected outcomes and Promises for IO. The logger
retains error stacks and causes while redacting secrets.

### create domain errors for business rules

A pricing service computes a quote. A discount that takes the price below the
allowed minimum is an expected business failure. No infrastructure has failed.
Amounts are validated integer cents.

```ts
class DiscountTooLarge extends Error {
  constructor(readonly maxDiscount: number) {
    super("discount exceeds the allowed maximum")
  }
}

function calculateQuote(
  price: number,
  minimumPrice: number,
  discount: number,
): Result<number, DiscountTooLarge> {
  const maxDiscount = price - minimumPrice
  if (discount > maxDiscount) {
    return Result.fail(new DiscountTooLarge(maxDiscount))
  }
  return Result.succeed(price - discount)
}

function previewOffer(input: OfferInput): Result<number, DiscountTooLarge> {
  return calculateQuote(input.price, input.minimumPrice, input.discount)
}

function showOfferPreview(input: OfferInput): void {
  Result.match(previewOffer(input), {
    onSuccess: (total) => showTotal(total),
    onFailure: (error) => showDiscountError(
      `Choose a discount of at most ${formatMoney(error.maxDiscount)}.`,
    ),
  })
}
```

For a price of 10,000 cents and a minimum of 8,000, a 3,000-cent discount fails.
The form shows the allowed maximum of 2,000. `previewOffer` passes the same error
through. Wrapping it in `OfferFailed` would give the form no new information.
There is no underlying exception to preserve and no unhandled failure to log.

### pass the original error to the outer handler

Weak:

```ts
async function saveUser(user: User): Promise<void> {
  try {
    await collection.insertOne(user)
  } catch {
    throw new Error("database failed")
  }
}

async function registerUser(user: User): Promise<void> {
  try {
    await saveUser(user)
  } catch {
    throw new Error("registration failed")
  }
}

async function postUser(user: User, requestId: string): Promise<Response> {
  try {
    await registerUser(user)
    return new Response(null, { status: 201 })
  } catch (error) {
    logger.error({ error, requestId }, "registration failed")
    return Response.json({ code: "internal-error", requestId }, { status: 500 })
  }
}
```

A database timeout becomes `registration failed`. The log loses the driver stack
and connection details. Each internal catch adds code without helping the caller.

Stronger:

```ts
async function saveUser(user: User): Promise<void> {
  await collection.insertOne(user)
}

async function registerUser(user: User): Promise<void> {
  await saveUser(user)
}

async function postUser(user: User, requestId: string): Promise<Response> {
  try {
    await registerUser(user)
    return new Response(null, { status: 201 })
  } catch (error) {
    logger.error({ error, requestId }, "registration failed")
    return Response.json({ code: "internal-error", requestId }, { status: 500 })
  }
}
```

The same database timeout reaches the logger intact. The HTTP caller still gets
only a safe code and request ID. A bug in either internal function reaches the
same final handler. Adding `cause` to the weak wrappers would retain evidence,
but would still add error types that no caller needs.

### handle a technical failure where its meaning is known

The client exposes `HttpError.status`. This application treats a missing profile
as a new user with default preferences. It also allows one retry for a temporary
service failure.

Weak:

```ts
async function fetchProfile(id: string): Promise<Profile> {
  try {
    return await profileClient.get(id)
  } catch {
    throw new ProfileServiceError("profile unavailable")
  }
}

async function loadProfile(id: string): Promise<Profile> {
  try {
    return await fetchProfile(id)
  } catch (error) {
    if (!(error instanceof ProfileServiceError)) throw error
    return await fetchProfile(id)
  }
}
```

Every failure gets the same name. The caller retries missing profiles,
authentication failures, and client bugs as though they were temporary outages.

Stronger:

```ts
async function readProfile(id: string): Promise<Profile> {
  try {
    return await profileClient.get(id)
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return defaultProfile(id)
    }
    throw error
  }
}

async function loadProfile(id: string): Promise<Profile> {
  try {
    return await readProfile(id)
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 503) throw error
    await delay(200)
    return await readProfile(id)
  }
}

async function getProfile(id: string, requestId: string): Promise<Response> {
  try {
    return Response.json(await loadProfile(id))
  } catch (error) {
    logger.error({ error, requestId }, "profile lookup failed")
    return Response.json({ code: "internal-error", requestId }, { status: 500 })
  }
}
```

A 404 becomes a default profile, including when it follows a retry. A 503 gets
one retry. Other failures reach the HTTP handler with their original details.
Returning a default and retrying are both handling: each makes a decision using
the existing error. Neither needs a domain wrapper or an error log on success.

#### parse and enrich when the handler needs a trusted shape

Suppose another client throws unknown values with a nested `response.status`.
The handler needs a valid HTTP error status. A technical wrapper can guarantee
that field and record which profile was being read.

```ts
class ProfileHttpError extends Error {
  private constructor(
    readonly status: number,
    readonly profileId: string,
    cause: unknown,
  ) {
    super(`profile read failed for ${profileId}: HTTP ${status}`, { cause })
  }

  static parse(cause: unknown, profileId: string): ProfileHttpError | undefined {
    if (typeof cause !== "object" || cause === null || !("response" in cause)) return
    const response = cause.response
    if (typeof response !== "object" || response === null || !("status" in response)) return
    const status = response.status
    if (typeof status !== "number" || !Number.isInteger(status) || status < 400 || status > 599) return
    return new ProfileHttpError(status, profileId, cause)
  }
}

async function readProfile(id: string): Promise<Profile> {
  try {
    return await profileClient.get(id)
  } catch (cause) {
    const error = ProfileHttpError.parse(cause, id)
    if (!error) throw cause
    if (error.status === 404) return defaultProfile(id)
    throw error
  }
}

async function getProfile(id: string, requestId: string): Promise<Response> {
  try {
    return Response.json(await readProfile(id))
  } catch (error) {
    logger.error({ error, requestId }, "profile lookup failed")
    return Response.json({ code: "internal-error", requestId }, { status: 500 })
  }
}
```

A 404 returns the default profile. A 503 reaches the logger with a trusted status,
the profile ID, and the original error in `cause`. An unrelated exception passes
through unchanged. The wrapper still describes an HTTP failure; it makes no
business claim about the profile. Use the project's schema library for these
shape checks when one is available.

### define and use business errors

Registration needs to tell the user when an email is already taken. The repository
can identify that specific constraint. It must let unrelated failures pass through.

```ts
class EmailAlreadyTaken extends Error {
  constructor(cause: unknown) {
    super("email already taken", { cause })
  }
}

async function registerUser(user: User): Promise<Result<void, EmailAlreadyTaken>> {
  try {
    await collection.insertOne(user)
    return Result.succeed(undefined)
  } catch (error) {
    if (isEmailUniqueConstraintViolation(error)) {
      return Result.fail(new EmailAlreadyTaken(error))
    }
    throw error
  }
}

async function postUser(user: User, requestId: string): Promise<Response> {
  try {
    const result = await registerUser(user)
    return Result.match(result, {
      onSuccess: () => new Response(null, { status: 201 }),
      onFailure: () => Response.json(
        {
          code: "email-already-taken",
          message: "Choose another email address.",
        },
        { status: 409 },
      ),
    })
  } catch (error) {
    logger.error({ error, requestId }, "registration failed")
    return Response.json({ code: "internal-error", requestId }, { status: 500 })
  }
}
```

The constraint check must identify the email constraint, not every duplicate key.
An email conflict gets a useful 409 response. A database outage or a bug reaches
the final handler and gets logged once. Neither becomes `EmailAlreadyTaken`.
The caller handles one real business outcome without knowing the driver.
