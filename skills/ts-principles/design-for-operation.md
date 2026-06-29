# design for operation

## reasoning

Operation is part of the design. Cancellation, timeouts, retries, and
observability decide whether the system can be deployed, debugged, and
recovered without paging an engineer. Code that ignores them ends up on
the on-call ticket pile.

Long-running work needs to be cancellable. A request that takes a minute
should respect a shutdown signal or a client disconnect. A job that runs
for an hour should be resumable from a checkpoint. Otherwise every deploy
either drops work in flight or waits indefinitely for it.

Timeouts, retries, and backpressure each have a specific job. A timeout
bounds a single call so a stuck upstream cannot stall the caller. A retry
compensates for transient failure, but duplicates writes when the
operation is not idempotent. Backpressure protects the receiver from a
faster sender; without it, an unbounded queue grows until the process
runs out of memory.

Observability has to be enough to debug failures without reproducing
them. Reproducing a production incident in dev is expensive and
sometimes impossible. Logs, metrics, and traces should record the
inputs, the decisions made, and the failures encountered, with enough
context to reconstruct the path of a single request through the system.

Prefer actionable logs over noisy ones. A log line earns its keep when
the on-call reader can act on it without opening the code: it carries
the operation, the relevant identifiers, and the cause. Lines without
that detail force the reader to guess, and noise from low-value logs
hides the ones that matter.

## examples

### make long-running work cancellable

Weak:

```ts
async function generateMonthlyInvoices(month: BillingPeriod): Promise<void> {
  const customers = await db.customers.dueFor(month)
  for (const customer of customers) {
    const invoice = buildInvoice(customer, month)
    await invoices.issue(invoice)
    await mailer.send(invoice.pdfUrl, customer.email)
  }
}
```

The month-end run takes an hour. A redeploy in the middle kills the
process between iterations. Some customers end up with an issued invoice
and no email; some are skipped entirely on the rerun.

Stronger:

```ts
async function generateMonthlyInvoices(
  month: BillingPeriod,
  signal: AbortSignal,
): Promise<void> {
  const lastIssued = await readCheckpoint(month)
  const customers = db.customers.dueAfter(month, lastIssued)

  for await (const customer of customers) {
    if (signal.aborted) throw new AbortError()

    const key = `${month}:${customer.id}`
    const invoice = buildInvoice(customer, month)
    await invoices.issue(invoice, { idempotencyKey: key })
    await mailer.send(invoice.pdfUrl, customer.email, { idempotencyKey: key })
    await writeCheckpoint(month, customer.id)
  }
}
```

Cancellation is checked at the iteration boundary. Each customer is
processed with an idempotency key so a half-completed iteration is safe
to redo. The checkpoint advances after a full customer succeeds. A
redeploy stops cleanly and the next instance resumes from the last
checkpoint.

With Effect:

```ts
const generateMonthlyInvoices = (month: BillingPeriod) =>
  Effect.gen(function* () {
    const lastIssued = yield* readCheckpoint(month)
    const customers = yield* db.customers.dueAfter(month, lastIssued)

    yield* Effect.forEach(
      customers,
      (customer) =>
        Effect.gen(function* () {
          const key = `${month}:${customer.id}`
          const invoice = buildInvoice(customer, month)
          yield* invoices.issue(invoice, { idempotencyKey: key })
          yield* mailer.send(invoice.pdfUrl, customer.email, {
            idempotencyKey: key,
          })
          yield* writeCheckpoint(month, customer.id)
        }),
      { discard: true },
    )
  })
```

No explicit signal check or finally block. A redeploy stops the loop at
the next iteration boundary, and idempotency keys plus the checkpoint
make resume safe: every committed customer is skipped, the in-flight
one can be retried without duplicating committed work.

### timeouts at boundaries

Weak:

```ts
async function fetchExchangeRate(): Promise<ExchangeRate> {
  const response = await fetch("https://rates.example.com/usd-eur")
  return response.json()
}
```

If the upstream is slow, every caller of `fetchExchangeRate` is slow.
One stuck dependency stalls every request that touches it.

Stronger:

```ts
async function fetchExchangeRate(): Promise<ExchangeRate> {
  const response = await fetch("https://rates.example.com/usd-eur", {
    signal: AbortSignal.timeout(2000),
  })
  return response.json()
}
```

Latency is bounded. The caller can decide what to do on timeout: retry,
fall back to a cached rate, or surface the error.

With Effect:

```ts
const decodeExchangeRate = HttpClientResponse.schemaBodyJson(ExchangeRate)

const fetchExchangeRate = Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient
  const response = yield* client.get("https://rates.example.com/usd-eur")
  return yield* decodeExchangeRate(response)
}).pipe(Effect.scoped, Effect.timeout("2 seconds"))
```

On timeout, the HTTP call is interrupted and the response scope is closed.
The caller receives a `TimeoutException` it can match on.

### retries need idempotency

Weak:

```ts
async function chargeOrder(orderId: OrderId, amount: Money): Promise<void> {
  await retry(() => payments.charge(orderId, amount), { attempts: 3 })
}
```

If the first charge succeeded but the response was lost, the retry
creates a second charge. The retry made the partial failure worse.

Stronger:

```ts
async function chargeOrder(orderId: OrderId, amount: Money): Promise<void> {
  await retry(
    () =>
      payments.charge(orderId, amount, {
        idempotencyKey: `order:${orderId}`,
      }),
    { attempts: 3 },
  )
}
```

The provider deduplicates on `idempotencyKey`. The retry is safe under
partial failure, and the order never gets charged twice.

With Effect:

```ts
const chargeOrder = (orderId: OrderId, amount: Money) =>
  payments
    .charge(orderId, amount, { idempotencyKey: `order:${orderId}` })
    .pipe(
      Effect.retry({
        schedule: Schedule.exponential("100 millis").pipe(
          Schedule.compose(Schedule.recurs(3)),
        ),
        while: (error) => error._tag === "TransientError",
      }),
    )
```

Domain errors like `CardDeclined` skip the schedule and propagate. The
exponential schedule and the cap on attempts are explicit values at the
call site.

### bounded queues for backpressure

Weak:

```ts
const queue: Job[] = []

function enqueue(job: Job): void {
  queue.push(job)
}

async function worker(): Promise<void> {
  while (true) {
    const job = queue.shift()
    if (job) await process(job)
    else await sleep(10)
  }
}
```

When the producer is faster than the worker, `queue` grows without
bound. The first sign of trouble is the OOM killer.

Stronger:

```ts
const queue = new BoundedQueue<Job>({ capacity: 1000 })

async function enqueue(job: Job): Promise<void> {
  await queue.offer(job) // blocks (or fails) when full
}
```

A full queue blocks the producer. Backpressure travels up the pipeline
instead of memory growing in the middle.

With Effect:

```ts
const pipeline = Effect.gen(function* () {
  const queue = yield* Queue.bounded<Job>(1000)

  yield* Effect.fork(
    Effect.forever(
      Effect.gen(function* () {
        const job = yield* receiveJob
        yield* Queue.offer(queue, job)
      }),
    ),
  )

  yield* Effect.forever(
    Effect.gen(function* () {
      const job = yield* Queue.take(queue)
      yield* processJob(job)
    }),
  )
})
```

The producer suspends when the queue is full. Backpressure propagates
without explicit signaling. The same shape with `Queue.dropping` or
`Queue.sliding` picks a different overflow policy.

### actionable logs

Weak:

```ts
try {
  return await handleRequest(request)
} catch (error) {
  logger.error("request failed")
  throw error
}
```

The on-call reader sees `request failed` and has nothing to act on. No
request id, operation, customer, or cause.

Stronger:

```ts
try {
  return await handleRequest(request)
} catch (error) {
  logger.error(
    {
      requestId,
      operation: "chargeOrder",
      orderId: request.orderId,
      customerId: request.customerId,
      cause: error,
    },
    "request failed",
  )
  return toChargeResponse(error)
}
```

The line is searchable by `orderId` and `customerId`, filterable by
`requestId`, and carries the original error. The log sits at the boundary
that also turns the failure into a protocol response.

Do not log routine business rejections at error level. Reserve error logs for
failures an operator can investigate.

With Effect:

```ts
const handleChargeRequest = (request: ChargeRequest) =>
  chargeOrder(request.orderId, request.amount).pipe(
    Effect.annotateLogs({
      requestId: request.id,
      operation: "chargeOrder",
      orderId: request.orderId,
      customerId: request.customerId,
    }),
    Effect.withSpan("chargeOrder", {
      attributes: {
        requestId: request.id,
        orderId: request.orderId,
        customerId: request.customerId,
      },
    }),
    Effect.catchTag("PaymentProviderUnavailable", (error) =>
      Effect.logError("payment provider unavailable").pipe(
        Effect.annotateLogs({ cause: error._tag }),
        Effect.as(toChargeResponse(error)),
      ),
    ),
    Effect.catchAll((error) => Effect.succeed(toChargeResponse(error))),
  )
```

The boundary owns the log and the protocol response. Annotated fields travel
into logs and traces, so a request can be followed by `requestId` or `orderId`.
