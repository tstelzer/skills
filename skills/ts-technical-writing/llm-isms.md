# llm-isms

## rules

- Remove phrases that sound helpful but add no information.
- Replace general claims about quality with supported behavior that helps the reader.
- State behavior and reasons directly. Delete sentences that praise the design, announce an explanation,
  or restate the previous sentence in broader terms.
- Use contrasts to distinguish plausible alternatives. Use lists for needed facts, not to suggest completeness.
- Replace generic transitions with structure.
- Do not flatter the question or the plan.
- Do not end with an invitation when no useful next action exists.
- Treat feedback as an edit instruction, not artifact content.
- Remove exclusions that do not prevent a plausible reader action.
- Delete filler without replacing it when the useful answer is already complete.

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

Use only facts supported by the source material. Include them only when they help answer the reader's question.

### replace stock rhetorical contrasts

Weak:

```md
The queue is not merely a buffer; it is the foundation of reliable processing.
```

Stronger:

```md
The queue stores pending jobs until a worker can process them.
```

### replace vague praise of a design

Weak:

```md
This approach provides a clean and predictable failure model.
```

Stronger:

```md
If validation fails, the command exits before writing any files.
```

### cut abstract restatements

Weak:

```md
Each customer has a separate database. This establishes a clear isolation
boundary between tenants.
```

Stronger:

```md
Each customer has a separate database.
```

Add a specific consequence when the reader needs it.

### replace lists of virtues

Weak:

```md
The design improves reliability, maintainability, extensibility, and operational clarity.
```

Stronger:

```md
New exporters can reuse the existing parser.
```

Name a supported benefit relevant to the reader. A list of desirable qualities does not establish one.

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

Stronger: delete the sentence. End after the replay instructions.

### avoid meta explanation

Weak:

```md
This distinction is important for understanding how retries behave.
```

Stronger: delete the sentence. State the retry behavior directly.

### remove orphaned exclusions

A negative instruction must prevent a plausible reader action.

For each exclusion, ask what in the current code, source requirements, or artifact would lead a reasonable reader to
consider the excluded option. Delete the exclusion when only prior discussion or an earlier draft makes the option
relevant.

Weak:

```md
Derive types with `z.output`. Do not add `MODEL_ID`, a format version, a checksum,
or optional extension fields.
```

Stronger:

```md
Derive types with `z.output`. Exclude the existing `MODEL_ID` field.
```

Negative statements introduce concepts into scope. Do not name alternatives that the reader has no reason to
consider.

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

Stronger: delete the sentence. The answer is complete.
