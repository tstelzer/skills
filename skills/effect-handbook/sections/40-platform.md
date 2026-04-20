# Platform Services

## What it is
`@effect/platform` modules outside schema-first `HttpApi`: `HttpClient`, `HttpRouter`, `FileSystem`, `Path`, `Url`, `Terminal`, `CommandExecutor`, `KeyValueStore`, `Ndjson`, `Worker`, and related Node layers.

## When to use
- Cross-platform runtime services for IO, outgoing HTTP, route-first servers, terminal/process work, and worker/file workflows

## When not to use
- Schema-first `HttpApi` contracts and generated clients (see `30-http-server.md`)

## Runtime layers (Node)

```ts
import { NodeContext, NodeHttpClient, NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"

const program = Effect.gen(function* () {
  // program
}).pipe(
  Effect.provide(NodeHttpClient.layer), // outgoing HTTP
  Effect.provide(NodeContext.layer), // FileSystem, Path, Terminal, CommandExecutor, WorkerManager
  NodeRuntime.runMain
)
```

Add targeted layers when needed:
- `NodeTerminal.layer` for terminal-only programs
- `NodeCommandExecutor.layer` for subprocess APIs
- `NodeKeyValueStore.layerFileSystem("./kv")` for persistent key-value storage

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

## Other high-value services

| Service | Typical entrypoint |
|---|---|
| Outgoing HTTP | `../topics/http-client.md` |
| Route-first servers | `../topics/http-router.md` |
| Terminal input/output | `Terminal.Terminal`, `NodeTerminal.layer` |
| Subprocesses | `CommandExecutor.CommandExecutor`, `NodeCommandExecutor.layer` |
| Key-value storage | `KeyValueStore.KeyValueStore`, `NodeKeyValueStore.layerFileSystem(...)` |

## Common pitfalls
- Hardcoding path separators instead of `Path.Path`
- Forgetting to provide `NodeHttpClient.layer` / `FetchHttpClient.layer` for outgoing HTTP
- Treating `HttpRouter` and `HttpApi` as interchangeable; choose contract-first vs route-first explicitly
- Doing protocol transforms in sinks instead of stream/channel stages

## See also
- `30-http-server.md`
- `../topics/http-client.md`
- `../topics/http-router.md`
- `../topics/platform-ndjson.md`
- `../topics/platform-worker.md`
- `../topics/platform-stream-sink.md`
