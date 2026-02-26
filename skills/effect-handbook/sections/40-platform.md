# Platform (Non-HTTP)

## What it is
`@effect/platform` modules excluding `Http*`: filesystem/path/url/ndjson/workers and stream-sink integration.

## When to use
- Cross-platform runtime services for IO/path/url workflows

## When not to use
- Top-level HTTP API/server definitions (see `30-http-server.md`)

## Runtime layers (Node)

```ts
import { NodeFileSystem, NodePath, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer } from "effect"

const layer = Layer.mergeAll(NodeFileSystem.layer, NodePath.layer)

Effect.gen(function* () {
  // program
}).pipe(
  Effect.provide(layer),
  NodeRuntime.runMain
)
```

## FileSystem

```ts
import { FileSystem } from "@effect/platform"
import { Effect } from "effect"

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  yield* fs.makeDirectory("./tmp", { recursive: true })
  yield* fs.writeFileString("./tmp/data.txt", "hello\n")
  const text = yield* fs.readFileString("./tmp/data.txt")
  return text
})
```

## Url + UrlParams

```ts
import { Url, UrlParams } from "@effect/platform"
import { Either } from "effect"

const parsed = Url.fromString("https://example.com/search?q=effect")

const updated = Either.map(parsed, (url) =>
  Url.modifyUrlParams(url, (params) => params.pipe(UrlParams.set("page", 2)))
)
```

## Path

```ts
import { Path } from "@effect/platform"
import { Effect } from "effect"

const buildPath = Effect.gen(function* () {
  const path = yield* Path.Path
  return path.resolve("data", "events.ndjson")
})
```

## Common pitfalls
- Hardcoding path separators instead of `Path.Path`
- Doing protocol transforms in sinks instead of stream/channel stages

## See also
- `30-http-server.md`
- `../topics/platform-ndjson.md`
- `../topics/platform-worker.md`
- `../topics/platform-stream-sink.md`
