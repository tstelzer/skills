# tests are code

## reasoning

Tests are part of the system. They have readers, maintenance cost, failure
modes, and design pressure. Bad tests are defects: they slow change, hide
regressions behind noise, and teach people to ignore failures.

Tests are code first and framework usage second. The runner gives names,
lifecycle, and assertions. It should not become the design surface. Prefer
ordinary code that builds input, calls the thing under test, and compares data:

```ts
const result = await loadUser(input)
expect(result).toEqual(expected)
```

A good test should make a useful claim and avoid irrelevant implementation
details. The best case is input data to output data. Otherwise, compare the
closest thing the code produces: durable state, protocol data, or observable
behavior.

Prefer tests that protect decisions. Test the thing that would be expensive to
rediscover during a refactor: parsing rules, state transitions, error mapping,
contract behavior, persistence shape, authorization boundaries, idempotency,
ordering, retries, cleanup, and surprising edge cases.

Every test must add information the implementation does not already state. Keep
it only when it proves a behavior, contract, boundary, regression, or stable
invariant. Tests that assert constants, render components without behavior,
check prop forwarding, mirror library behavior, or verify test helpers are false
coverage.

Tests must not freeze design early. If a test mostly proves that a
helper was called, an object was assembled in a particular order, or a private
branch happened to run, it protects the current implementation instead of useful
behavior.

The best tests read like small, executable examples of the system. The worst
tests read like debug traces.

## examples

### low-value tests

Bad tests are false coverage: they make weak claims look protected. Delete them.

Weak:

```ts
expect(DEFAULT_PAGE_SIZE).toBe(25)
```

A constant already says this. If `25` matters, test the behavior that exposes it:

```ts
const result = await listUsers({})
expect(result).toEqual({
  users: expectedUsers,
  pageSize: 25,
  nextCursor: "cursor-2",
})
```

Weak:

```tsx
render(<UserMenu user={owner} />)
```

Rendering without an assertion proves almost nothing.

Weak:

```tsx
render(<UserMenu user={owner} />)
expect(screen.getByText("Ada Lovelace")).toBeInTheDocument()
```

This is still weak when the component only prints its props.

Weak:

```tsx
render(<UserMenu user={owner} onDelete={onDelete} />)

await userEvent.click(screen.getByRole("button", { name: "Delete user" }))

expect(onDelete).toHaveBeenCalledWith(owner.id)
```

This only proves that a leaf component forwards an event to a prop.

Stronger:

```tsx
render(<UsersPage />)

await userEvent.click(screen.getByRole("button", { name: "Delete Ada" }))
await userEvent.click(screen.getByRole("button", { name: "Confirm" }))

expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument()
expect(await screen.findByText("User deleted")).toBeVisible()
```

This protects the workflow: the user can delete a user, the list updates, and
the success state is visible.

Weak:

```ts
expect(formatDate(date)).toBe(format(date, "yyyy-MM-dd"))
```

This tests that a wrapper calls a library. Delete the wrapper test, or test the
domain contract:

```ts
expect(formatInvoiceDate(new Date("2026-01-02T12:00:00Z"))).toEqual("2026-01-02")
```

Weak:

```ts
expect(makeTestUser()).toEqual({
  id: "user-1",
  role: "member",
})
```

Do not test test helpers unless they contain real logic. Prefer keeping helpers
small enough to read at the call site.

### data over internals

Weak:

```ts
expect(repository.save).toHaveBeenCalledWith({
  id: "user-1",
  status: "active",
})
```

Stronger:

```ts
await activateUser("user-1")

const result = await loadUser("user-1")
expect(result).toEqual({
  id: "user-1",
  status: "active",
})
```

Best, when the domain logic allows it:

```ts
const input = {
  id: "user-1",
  status: "pending",
} as const

const expected = {
  id: "user-1",
  status: "active",
} as const

const result = activateUserRecord(input)
expect(result).toEqual(expected)
```

The first test couples to the collaboration shape. The second protects a state
change. The third protects the transformation directly.

### table-driven tests

Weak:

```ts
it("accepts admin", () => {
  expect(canEdit({ role: "admin" })).toBe(true)
})

it("accepts owner", () => {
  expect(canEdit({ role: "owner" })).toBe(true)
})

it("rejects guest", () => {
  expect(canEdit({ role: "guest" })).toBe(false)
})
```

Stronger:

```ts
it.each([
  { role: "admin", expected: true },
  { role: "owner", expected: true },
  { role: "guest", expected: false },
] as const)("checks edit access for $role", ({ role, expected }) => {
  const result = canEdit({ role })
  expect(result).toEqual(expected)
})
```

Tables keep repeated intent visible, and `.test.each` or `.it.each` usually
produces better failure output than a plain loop. Keep the case body ordinary:
build input, call code, compare data.

### simple assertions

Weak:

```ts
expect(result.items).toHaveLength(2)
expect(result.items[0]?.id).toBe("a")
expect(result.items[0]?.label).toBe("Alpha")
expect(result.items[1]?.id).toBe("b")
expect(result.items[1]?.label).toBe("Beta")
expect(result.total).toBe(2)
```

Stronger:

```ts
expect(result).toEqual({
  items: [
    { id: "a", label: "Alpha" },
    { id: "b", label: "Beta" },
  ],
  total: 2,
})
```

Best, when a schema already exists:

```ts
const result = await listUsers()
const parsed = UserList.parse(result)
expect(parsed).toEqual(expected)
```

With Effect Schema, the same shape applies:

```ts
const result = await listUsers()
const parsed = Schema.decodeUnknownSync(UserList)(result)
expect(parsed).toEqual(expected)
```

Many small assertions are sometimes right, especially when they isolate a
specific failure. Long assertion blocks often hide the actual shape being tested.
If the codebase already has a Zod or Effect schema for that shape, use it.

### real systems before mocks

Best, when already available:

```ts
const created = await users.create(input)
const result = await users.findById(created.id)
expect(result).toEqual(expected)
```

Use existing integration tests with real systems when the repo already supports
them: MongoDB, RabbitMQ, Postgres, Redis, queues, object storage, or HTTP
services. A slower honest test is often more useful than a fast test that only
proves a mock setup.

Otherwise, prefer the canonical dependency injection mechanism of the codebase:
Effect layers, NestJS testing modules and providers, constructor arguments, or a
small explicit test service.

```ts
const result = await runWithTestServices(program)
expect(result).toEqual(expected)
```

MSW can be a good fit for outgoing HTTP. It locks APIs globally enough to avoid
accidental real calls, while still testing request and response data.

Vitest or Jest module mocking is the last resort. Treat it as an anti-pattern
unless the alternative is worse.

Suspicious:

```ts
vi.mock("../user-normalizer", () => ({ normalize: vi.fn() }))
vi.mock("../permission-builder", () => ({ build: vi.fn() }))
vi.mock("../email-renderer", () => ({ render: vi.fn() }))
```

Mocking several local helpers means the test is coupled to the
decomposition rather than the result.

### errors are data too

Weak:

```ts
const error = await createUser(input).catch((error: unknown) => error)
expect((error as Error).message).toEqual("email already exists")
```

Stronger:

```ts
const result = await createUser(input)
const tag = Result.match(result, {
  onSuccess: () => "unexpected-success",
  onFailure: (error) => error._tag,
})

expect(tag).toEqual("DuplicateEmail")
```

With Effect, prefer the domain tag:

```ts
const result = await Effect.runPromise(Effect.either(createUser(input)))
const tag = Either.match(result, {
  onLeft: (error) => error._tag,
  onRight: () => "unexpected-success",
})

expect(tag).toEqual("DuplicateEmail")
```

Do not assert on error messages unless the message is the user-facing contract.
Prefer an error instance, or a discriminant such as `_tag`.

### counterfactuals

Weak:

```ts
expect(parseConfig(validConfig)).toEqual(expectedConfig)
```

Stronger:

```ts
expect(parseConfig(validConfig)).toEqual(expectedConfig)

const result = parseConfigResult({ ...validConfig, timeoutMs: -1 })
expect(result._tag).toEqual("InvalidConfig")
```

Happy-path tests prove the main claim. Counterfactuals prove the boundary of
the claim.

### property-based tests for stable invariants

Weak:

```ts
expect(decodeUser(encodeUser(ada))).toEqual(ada)
expect(decodeUser(encodeUser(grace))).toEqual(grace)
expect(decodeUser(encodeUser(linus))).toEqual(linus)
```

Stronger, when the invariant is real:

```ts
fc.assert(
  fc.property(userArbitrary, (user) => {
    const result = decodeUser(encodeUser(user))
    expect(result).toEqual(user)
  }),
)
```

Property-based tests are rare but valuable when the code has a durable law:
encode/decode round trips, normalization idempotency, ordering, set membership,
permission monotonicity, parsing boundaries, or state-machine transitions.

Do not force them onto example-shaped business rules. A property test without a
clear invariant is a harder-to-read unit test.
