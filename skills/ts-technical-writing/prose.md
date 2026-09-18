# prose

## rules

- Replace abstract phrases with the actions they describe. Name what reads, writes, changes, or fails.
- Preserve exact code and interface names. Rewrite descriptive phrases to explain what happens.
- Prefer active voice.
- Name the actor when responsibility matters.
- Replace hidden verbs with verbs.
- Split sentences that carry several decisions, causes, or conditions. Give independent rules separate bullets.
- Keep necessary conditions and consequences. Remove abstractions that merely rename the behavior.
- Reduce the number of concepts the reader must track. Splitting a sentence does not remove unnecessary concepts.
- Replace internal workflow terms with words the reader uses.
- Define unfamiliar terms when code or context does not make them clear.
- Replace vague claims with concrete facts.
- Cut setup phrases.

## examples

### use common words

These examples are not a complete list or fixed substitutions. Establish the behavior, then rewrite without losing
conditions or meaning. Keep this table to at most 25 examples; replace rows to improve coverage.

| Wording | Possible rewrite |
| --- | --- |
| utilize | use |
| prior to | before |
| in the absence of | without |
| perform validation | validate |
| connection establishment | opening a connection |
| materialize output | write the output file |
| retain provenance | record where the data came from |
| effective settings | settings after applying overrides |
| effective requiredness | whether required keys have values after applying overrides |
| command cutover | switching commands to the new implementation |
| shared-write isolation | keeping personal values out of shared writes |

### unpack dense technical prose

Weak:

```md
Cache eligibility requires successful authentication and absence of request-specific overrides.
```

Stronger:

```md
The server uses the cache only for authenticated requests with no custom settings.
```

Keep the conditions. Express them as behavior the reader can follow.

### replace abstract subjects

Weak:

```md
The retry mechanism provides resilience against transient upstream failures.
```

Stronger:

```md
The client retries requests when the server is temporarily unavailable.
```

### name the consequence

Weak:

```md
Configuration changes have implications for connection lifecycle management.
```

Stronger:

```md
Changing the configuration closes existing connections.
```

State only consequences supported by the source material.

### remove formal framing

Weak:

```md
The architectural role of the index is to support efficient record discovery.
```

Stronger:

```md
The index lets queries find records without scanning the whole table.
```

### keep exact technical terms

Weak:

```md
Idempotency is achieved through persistence of request-associated deduplication identifiers.
```

Stronger:

```md
The API stores each request's idempotency key. If a request repeats that key,
the API returns the saved result.
```

Keep a precise term when the reader needs it. Explain its concrete behavior instead of replacing it with vague prose.

### omit details outside the reader's task

Reader's task: understand why email sending runs separately from web requests.

Weak:

```md
The web server inserts pending email jobs into PostgreSQL so requests can finish
without waiting for the email provider. Each row contains a UUID, recipient
address, template identifier, JSON parameters, attempt count, and next-attempt
timestamp. Workers select eligible rows with `FOR UPDATE SKIP LOCKED` and record
completion after the provider accepts the message.
```

Stronger:

```md
The web server saves email jobs in PostgreSQL. Separate workers send the messages,
so web requests can finish without waiting for the email provider.
```

Keep the division of work and its reason. Row fields and locking syntax help someone implementing the worker;
they do not help this reader understand why sending happens separately.

### use active voice

Weak:

```md
The request is validated and a token is returned.
```

Stronger:

```md
The server validates the request and returns a token.
```

The stronger sentence says who acts.

### passive voice is allowed when the actor does not matter

Weak:

```md
The server encrypts backups at rest with AES-256.
```

Also fine:

```md
Backups are encrypted at rest with AES-256.
```

Use passive voice when the object matters more than the actor and no responsibility is hidden.

### replace hidden verbs

Weak:

```md
Token invalidation occurs upon completion of password reset.
```

Stronger:

```md
Resetting the password invalidates existing tokens.
```

Make the action a verb.

### cut filler

Weak:

```md
It is important to note that the API may return a 409 response in cases where
the email address already exists.
```

Stronger:

```md
The API returns `409` when the email address already exists.
```

The stronger sentence keeps the claim and drops the ceremony.

### avoid weak openers

Weak:

```md
There are three fields that control retries.
```

Stronger:

```md
Three fields control retries.
```

Make the subject do work.

### make claims concrete

Weak:

```md
The new importer is robust and scalable.
```

Stronger:

```md
The new importer processes files up to 2 GB and resumes from the last committed
checkpoint after worker restart.
```

Concrete bounds beat adjectives.

### put conditions before instructions

Weak:

```md
Restart the worker if it stops after writing a checkpoint.
```

Stronger:

```md
If the worker stops after writing a checkpoint, restart it.
```

The reader can decide whether the instruction applies before reading the action.

### prefer present tense

Weak:

```md
The command will create a token and will print it to stdout.
```

Stronger:

```md
The command creates a token and prints it to stdout.
```

Present tense is shorter and usually more direct.

### keep precision

Weak:

```md
The cleanup job deletes old data.
```

Stronger:

```md
The cleanup job deletes audit events older than 90 days.
```

Plain prose is not vague prose.
