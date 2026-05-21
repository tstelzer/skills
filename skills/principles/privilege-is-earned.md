# privilege is earned

## reasoning

Security is about authority. A value has a type. It also has a source and a
capability attached to it.

Start every boundary closed. A request is not a user. A token is not an
identity until its signature, issuer, audience, and expiry are checked. A user
is not allowed to touch a resource until the action is authorized against that
resource. A URL is not safe because it is well formed. A file path is not safe
because it was normalized.

Ask four questions:

- Who controls this value?
- What authority does this code grant?
- What asset can move, change, or leak?
- What happens when the answer is unclear?

The safe default is deny, drop, redact, bound, or refuse. Allow only after the
code proves the caller, target, action, and sink are allowed.

Do not spread trust decisions across helpers and hope the composition is safe.
Put identity binding, authorization, secret handling, and sink constraints near
the boundary where trust changes. A handler may parse a request body. It should
also bind the actor to the target resource before the domain operation runs.

Keep secrets and sensitive data on the smallest surface. Secrets do not belong
in source, client bundles, logs, telemetry, errors, URLs, screenshots, or test
fixtures. Sensitive data should leave its boundary only when the caller is
allowed to know it and the operation needs it.

Treat external systems as untrusted in both directions. Do not send more data
or authority than the integration needs. Do not write third-party responses
into internal state until they are parsed and mapped.

Treat code acquisition as a trust boundary. Generated code, install scripts,
CI jobs, containers, packages, and client bundles run with the authority you
give them. Limit that authority.

Resource exhaustion is a security bug when an attacker can trigger it. Bounds,
timeouts, rate limits, pagination, upload limits, archive limits, and
concurrency caps are part of the trust decision.

Security logs should prove who did what to which target without leaking the
thing being protected. Privileged actions, failed authorization, exports,
deletes, tenant access, impersonation, and billing changes need an audit trail.

## common trust boundaries

- Access control: bind actor, action, and target resource. A login check is not
  enough.
- Tenant isolation: carry tenant identity through queries, commands, cache keys,
  jobs, queues, subscriptions, and admin paths.
- Authentication: verify token signature, issuer, audience, expiry, rotation,
  logout, recovery, and session identity binding.
- Sensitive data: constrain responses, events, exports, logs, analytics,
  caches, errors, and telemetry to the fields the caller may know.
- Dangerous sinks: keep caller-controlled data out of executable strings:
  SQL, shell, templates, redirects, LDAP, NoSQL, regular expressions, and
  expression evaluators.
- File access: prove uploads, downloads, archive entries, templates, and static
  files stay inside their intended base.
- Outbound calls: constrain user-controlled URLs, hosts, protocols, redirects,
  webhooks, image fetchers, importers, and link previewers.
- Browser trust: restrict redirects, CORS, cookies, CSRF, rendered HTML,
  `postMessage`, and content security policy.
- Privileged operations: require explicit authority for admin actions, billing,
  impersonation, export, deletion, feature flags, and policy changes.
- Third parties: parse responses, bound timeouts and response sizes, constrain
  redirects, map external errors, and send only needed secrets.
- Configuration: keep development defaults, debug endpoints, public buckets,
  CORS, cookies, TLS assumptions, and route order out of production by default.
- Supply chain: treat packages, install hooks, native binaries, generated code,
  CI permissions, container images, and publish credentials as authority grants.
- Abuse controls: bound user-controlled limits, depth, retries, concurrency,
  fan-out, uploads, archive extraction, expensive queries, and pagination.

## examples

### authorize the target resource

Weak:

```ts
app.get("/accounts/:id", requireUser, async (req, res) => {
  const account = await accounts.findById(req.params.id)
  res.json(account)
})
```

The route proves the caller is logged in. It does not prove the caller can read
that account.

Stronger:

```ts
app.get("/accounts/:id", requireUser, async (req, res) => {
  const account = await accounts.findForUser({
    accountId: AccountId.parse(req.params.id),
    userId: req.user.id,
  })

  if (!account) {
    return res.status(404).json({ code: "not-found" })
  }

  res.json(toAccountResponse(account))
})
```

The lookup binds actor and target. A missing or unauthorized account has the
same outward shape.

### verify tokens before trusting identity

Weak:

```ts
const userId = decodeJwt(token).sub
```

Decoding reads attacker-controlled bytes. It does not prove who signed them or
whether they still apply here.

Stronger:

```ts
const claims = await jwt.verify(token, {
  issuer: "https://auth.example.com",
  audience: "api",
})

const userId = UserId.parse(claims.sub)
```

Identity exists only after signature, issuer, audience, expiry, and subject
shape pass.

### do not return persistence models

Weak:

```ts
return Response.json(user)
```

Persistence models often contain fields the caller should not see: roles,
flags, password metadata, tenant IDs, tokens, and internal timestamps.

Stronger:

```ts
return Response.json({
  id: user.id,
  name: user.name,
  email: user.email,
})
```

The response names the allowed data. New database fields do not leak by
accident.

### use structured APIs at dangerous sinks

Weak:

```ts
await db.query(`select * from users where email = '${email}'`)
```

The caller controls part of the query text.

Stronger:

```ts
await db.query("select * from users where email = $1", [email])
```

The sink receives data separately from query text.

### keep secrets out of logs

Weak:

```ts
logger.info("stripe request failed", { apiKey, error })
```

The log path can outlive the request, cross systems, and reach people who
should never hold the secret.

Stronger:

```ts
logger.warn("stripe request failed", {
  provider: "stripe",
  requestId,
  cause: error.code,
})
```

The log supports debugging without carrying the credential.

### prove file paths stay inside the base directory

Weak:

```ts
const file = path.join(uploadDir, req.query.name)
return sendFile(file)
```

`path.join` builds a path. It does not prove the final path stays below
`uploadDir`.

Stronger:

```ts
const name = FileName.parse(req.query.name)
const file = path.resolve(uploadDir, name)
const root = path.resolve(uploadDir)
const relative = path.relative(root, file)

if (
  relative === ".." ||
  relative.startsWith(`..${path.sep}`) ||
  path.isAbsolute(relative)
) {
  return Response.json({ code: "not-found" }, { status: 404 })
}

return sendFile(file)
```

The sink receives a path only after containment is checked.

### constrain outbound requests

Weak:

```ts
await fetch(req.body.webhookUrl)
```

The caller controls where the server connects. That can expose metadata
services, internal networks, local services, or privileged endpoints.

Stronger:

```ts
const url = WebhookUrl.parse(req.body.webhookUrl)

if (!allowedWebhookHost(url.hostname)) {
  return Response.json({ code: "invalid-webhook-url" }, { status: 400 })
}

await fetch(url, {
  redirect: "error",
  signal: AbortSignal.timeout(2000),
})
```

The server grants only the outbound capability the feature needs.

### bound attacker-triggered work

Weak:

```ts
const rows = await search(req.query.q, {
  limit: Number(req.query.limit),
})
```

The caller controls the amount of work.

Stronger:

```ts
const input = SearchInput.parse(req.query)
const rows = await search(input.query, {
  limit: input.limit,
})
```

The parser owns the allowed range. The service receives a bounded value.

### restrict browser trust

Weak:

```ts
return redirect(req.query.next ?? "/")
```

The caller controls where the browser goes next.

Stronger:

```ts
const next = SameOriginPath.parse(req.query.next ?? "/")
return redirect(next)
```

The redirect only grants same-origin navigation.

### audit privileged actions

Weak:

```ts
app.post("/admin/users/:id/disable", requireUser, disableUser)
```

The route does not prove admin authority and leaves no durable record of the
actor, target, and action.

Stronger:

```ts
app.post("/admin/users/:id/disable", requireAdmin, async (req, res) => {
  const command = DisableUserCommand.parse({
    actorId: req.user.id,
    targetUserId: req.params.id,
  })

  await users.disableByAdmin(command)

  res.status(204).end()
})
```

```ts
async function disableByAdmin(command: DisableUserCommand): Promise<void> {
  await userStore.transaction(async (tx) => {
    await users.disable(tx, command.targetUserId)
    await audit.write(tx, {
      actorId: command.actorId,
      action: "user.disable",
      targetType: "user",
      targetId: command.targetUserId,
    })
  })
}
```

The operation names the actor, action, and target. The audit event commits
with the privileged change.
