# examples

## rules

- Prefer a concrete example to another sentence of explanation.
- Use real shapes: command, request, response, config, error, input, output.
- Keep examples current with the interface.
- Show both weak and stronger examples when teaching a rule.
- Use safe values for tokens, keys, emails, domains, and IDs.

## examples

### show the command

Weak:

```md
Use the CLI to replay events from a specific offset.
```

Stronger:

````md
Run:

```sh
pnpm events replay --topic billing-events --from-offset 4219
```
````

The reader should not have to invent syntax.

### show input and output

Weak:

```md
The parser normalizes email addresses.
```

Stronger:

````md
Input:

```json
{ "email": "Ada@Example.COM " }
```

Output:

```json
{ "email": "ada@example.com" }
```
````

Input/output pairs show behavior without extra prose.

### make code examples match the current API

Weak:

```ts
await client.users.disable("user_123")
```

Stronger:

```ts
await client.users.disable({
  userId: "user_123",
  reason: "requested-by-admin",
})
```

An example that uses the old call shape is a bug.

### avoid fake secret-shaped literals

Weak:

```ts
const client = createClient({ token: "sk_test_123" })
```

Stronger:

```ts
const client = createClient({ token: process.env.API_TOKEN })
```

Do not teach readers to paste secret-shaped strings into source.

### use realistic values

Weak:

```json
{ "id": "foo", "amount": 123 }
```

Stronger:

```json
{ "invoiceId": "inv_01J4Z0K7YQ8J9M2H3P4V5B6N7C", "amountCents": 1299 }
```

Realistic values reveal naming, units, and shape.

### show failure cases

Weak:

```md
The endpoint can fail if the token is invalid.
```

Stronger:

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "code": "invalid-token"
}
```

Failures are part of the contract.

### keep examples short enough to inspect

Weak:

```ts
const app = createApp({
  // 70 lines of unrelated setup
})

await app.billing.invoices.create({ /* one relevant field */ })
```

Stronger:

```ts
await billing.invoices.create({
  accountId: "acct_123",
  amountCents: 1299,
})
```

Hide setup unless the setup is the point.

### explain only what the example does not show

Weak:

````md
The `amountCents` field is the amount in cents.

```json
{ "amountCents": 1299 }
```
````

Stronger:

````md
`amountCents` uses integer cents. Decimal conversion happens at the HTTP edge.

```json
{ "amountCents": 1299 }
```
````

Do not repeat names. Add the missing contract.
