# Platform Stream -> Sink

## What it is
Pattern for writing `Stream` data into platform sinks (for example `FileSystem.sink`).

## When to use
- Persisting streaming bytes to files
- Keeping stream transforms pure and pushing sinks to boundaries

## When not to use
- In-memory only transformations with no sink boundary

## Minimal examples
```ts
import { FileSystem } from "@effect/platform"
import { Effect, Stream } from "effect"

const encoder = new TextEncoder()

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem

  yield* Stream.make("first\n", "second\n").pipe(
    Stream.map((line) => encoder.encode(line)),
    Stream.run(fs.sink("./out.txt"))
  )
})
```

## NDJSON to file

```ts
import { FileSystem, Ndjson } from "@effect/platform"
import { Effect, Stream } from "effect"

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  yield* Stream.make({ id: 1 }, { id: 2 }).pipe(
    Stream.pipeThroughChannel(Ndjson.pack()),
    Stream.run(fs.sink("./events.ndjson"))
  )
})
```

## Common pitfalls
- Running sinks in intermediate pipeline stages instead of boundaries
- Forgetting byte encoding before file sink writes

## See also
- `../sections/40-platform.md`
- `platform-ndjson.md`
