# prose

## rules

- Use the shortest word that preserves meaning.
- Prefer active voice.
- Name the actor when responsibility matters.
- Replace hidden verbs with verbs.
- Replace vague claims with concrete facts.
- Cut setup phrases.

## examples

### use common words

Weak:

```md
Utilize the configuration interface to facilitate credential rotation.
```

Stronger:

```md
Use the settings page to rotate credentials.
```

Do not use bigger words to sound technical.

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
The scheduler performs validation of each job before execution.
```

Stronger:

```md
The scheduler validates each job before running it.
```

`Validates` carries the sentence. `Performs validation` adds weight.

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
