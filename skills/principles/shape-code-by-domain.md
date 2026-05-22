# shape code by domain

## reasoning

Names and structure are part of the model. They teach the reader what the
system thinks exists.

Domain names carry intent. Mechanism names carry implementation. A module named
`users` tells you what part of the business you are in. A module named
`controllers` tells you which framework shape happened to be used. The latter
may be true, but it is rarely the most important fact.

Use one internal term for one domain concept. If the product, a partner API, a
database table, or a legacy screen uses another word, translate that word at
the boundary. Do not let `customer`, `client`, `account`, and `user` spread
through the same core model unless they mean different things.

Good names make illegal abstractions harder to hide. If everything is an
`entity` or a `manager`, the code can drift without friction. If the code says
`subscription` or `workOrder`, the reader can ask domain questions.

Structure should follow the same rule. Put code near the domain it serves. Use
mechanism words only when they clarify a role inside that domain. A
`user.repository.ts` file inside `users` is usually clearer than a global
`repositories/user.ts` bucket.

Shared code should earn its distance. A small local helper belongs next to the
feature that needs it. Extractable, library-esque code can live in `lib`.
Kitchen-sink `utils` usually means ownership is unclear.

## examples

### domain nouns over technical placeholders

Weak:

```ts
type Entity = {
  id: string
  status: string
}

function processItem(data: Entity) {
  return manager.update(data)
}
```

Stronger:

```ts
type WorkOrder = {
  id: WorkOrderId
  status: WorkOrderStatus
}

function scheduleWorkOrder(workOrder: WorkOrder) {
  return workOrders.schedule(workOrder)
}
```

The stronger version gives the reader something to reason about. It also makes
the wrong abstraction easier to spot.

### one concept, one internal term

Weak:

```ts
type Customer = {
  id: string
  plan: string
}

function activateClient(account: Customer) {
  return users.activate(account.id)
}
```

Stronger:

```ts
type Account = {
  id: AccountId
  plan: BillingPlan
}

function activateAccount(account: Account) {
  return accounts.activate(account.id)
}
```

If the UI says "customer" and the payment provider says "client", map those
terms at the edge:

```ts
function toAccount(customer: CustomerDto): Account {
  return {
    id: AccountId.parse(customer.id),
    plan: BillingPlan.parse(customer.plan),
  }
}
```

Internal code should not preserve every synonym it receives. It should preserve
the domain distinction.

### structure by domain

Weak:

```text
src/
  controllers/
    user.controller.ts
    machine.controller.ts
  repositories/
    user.repository.ts
    machine.repository.ts
  services/
    user.service.ts
    machine.service.ts
```

Stronger:

```text
src/
  users/
    user.controller.ts
    user.repository.ts
    user.service.ts
  machines/
    machine.controller.ts
    machine.repository.ts
    machine.service.ts
```

The weaker structure groups by mechanism first. The stronger structure groups
by the thing that changes together.

### mechanism only to disambiguate

Weak:

```text
src/
  users/
    controller.ts
    service.ts
    repository.ts
```

Stronger:

```text
src/
  users/
    user.controller.ts
    user.service.ts
    user.repository.ts
```

Mechanism words are useful when they clarify role. They should not become the
primary organizing idea.

### mechanism separates concerns, not kinds of code

A "role" here is a real concern boundary: HTTP, persistence, an external
contract. It is not the TypeScript construct kind (types, schema, constants).

Weak:

```text
src/
  users/
    user.types.ts
    user.schema.ts
    user.constants.ts
    user.dto.ts
    user.dto-schema.ts
    user.dto-types.ts
```

Stronger:

```text
src/
  users/
    user.ts         // domain types, schemas, constants, small helpers
    user.dto.ts     // DTO types and schemas, mapping helpers
```

Controllers, services, repositories, and DTOs have different reasons to
change: they sit on different sides of a boundary. Types, schemas, and
constants for one concept do not. They describe the same thing and change
together. Co-locate them in one file named for the concept.

Add a mechanism suffix when you cross a real boundary (`user.dto.ts` for the
wire shape, `user.repository.ts` for persistence). Do not add a suffix to
split a single concept by the kind of TypeScript construct it happens to be.

### local helpers before shared helpers

Weak:

```text
src/
  utils/
    formatStatus.ts
    buildUserDisplayName.ts
    parseMachineLabel.ts
```

Stronger:

```text
src/
  users/
    build-user-display-name.ts
  machines/
    parse-machine-label.ts
  lib/
    format-status.ts
```

Keep domain-specific helpers with their domain. Move code to `lib` when it
behaves like a small library rather than a feature detail.

### abbreviations should buy readability

Weak:

```ts
const usrSubCfg = loadCfg()
```

Stronger:

```ts
const subscriptionConfig = loadConfig()
```

Short conventional names are fine in tight local scopes:

```ts
const dx = x2 - x1
const dy = y2 - y1
const r = Math.sqrt(dx ** 2 + dy ** 2)
```

Domain conventions are fine too:

```ts
const httpClient = makeHttpClient()
const vatRate = calculateVatRate(country)
const p95LatencyMs = summarizeLatency(samples).p95
```

Use abbreviations when they improve local readability. Prefer conventions over
private shorthand.
