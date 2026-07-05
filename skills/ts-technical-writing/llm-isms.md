# llm-isms

## rules

- Remove phrases that sound helpful but add no information.
- Replace hype with behavior.
- Replace generic transitions with structure.
- Do not flatter the question or the plan.
- Do not end with an invitation when no useful next action exists.

## examples

### cut throat-clearing

Weak:

```md
It is worth noting that the migration may take several minutes.
```

Stronger:

```md
The migration may take several minutes.
```

The first four words do no work.

### cut fake transitions

Weak:

```md
Moreover, the cache also improves performance.
```

Stronger:

```md
The cache also reduces database reads.
```

Use a heading or a real connection. Do not decorate the sentence.

### replace hype with facts

Weak:

```md
This powerful feature lets teams seamlessly manage data at scale.
```

Stronger:

```md
This feature imports CSV files up to 2 GB and resumes after worker restart.
```

The stronger sentence gives the reader something to verify.

### avoid easy/simple claims

Weak:

```md
Simply run the command to fix the issue.
```

Stronger:

```md
Run the command:
```

`Simply` does not make the task simpler. It can make a blocked reader feel blamed.

### avoid overclaiming

Weak:

```md
This setting ensures that jobs never run twice.
```

Stronger:

```md
This setting deduplicates jobs with the same `idempotencyKey`.
```

Use `ensures`, `guarantees`, `always`, and `never` only for proven invariants.

### avoid "let's"

Weak:

```md
Let's configure the worker.
```

Stronger:

```md
Configure the worker.
```

Technical instructions should state the action.

### avoid boilerplate conclusions

Weak:

```md
In conclusion, the replay command is an effective way to process failed events.
```

Stronger:

```md
Use `events replay` only for events that failed before handler execution.
```

End with the constraint or next action, not a sign-off.

### avoid meta explanation

Weak:

```md
This section will explain how to create a token.
```

Stronger:

```md
Create a token:
```

Do the thing. Do not announce the thing.

### replace vague intensifiers

Weak:

```md
This is a very important operational concern.
```

Stronger:

```md
Without a checkpoint, restart processes the file from the first row.
```

Show the consequence.

### avoid generic assistant closers

Weak:

```md
If you have any questions, feel free to ask.
```

Stronger:

```md
For retry failures, collect the import ID and the last checkpoint before paging
the importer owner.
```

Close with useful operational detail.
