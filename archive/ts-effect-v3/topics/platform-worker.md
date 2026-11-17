# Platform Worker / WorkerRunner

## What it is
`Worker` is the main-process client API. `WorkerRunner` is the worker-process server API.

## When to use
- CPU-bound or isolated work in worker threads/processes
- Typed request/response worker protocols

## When not to use
- Lightweight in-process effects where worker overhead is unnecessary

## Minimal examples
```ts
import { Worker } from "@effect/platform"
import { NodeWorker } from "@effect/platform-node"
import { Context, Layer } from "effect"
import * as WT from "node:worker_threads"

interface RangePool {
  readonly _: unique symbol
}

const RangePool = Context.GenericTag<RangePool, Worker.WorkerPool<number, number>>("@app/RangePool")

const PoolLive = Worker.makePoolLayer(RangePool, { size: 3 }).pipe(
  Layer.provide(
    NodeWorker.layer((id) => new WT.Worker(new URL(`./workers/range-${id}.js`, import.meta.url)))
  )
)
```

## Worker process side

```ts
import { WorkerRunner } from "@effect/platform"
import { NodeWorkerRunner, NodeRuntime } from "@effect/platform-node"
import { Layer, Stream } from "effect"

const WorkerLive = WorkerRunner.make((n: number) => Stream.range(0, n)).pipe(
  Layer.scopedDiscard,
  Layer.provide(NodeWorkerRunner.layer)
)

NodeRuntime.runMain(NodeWorkerRunner.launch(WorkerLive))
```

## Common pitfalls
- Missing node worker layer provisioning
- Using untyped payloads when a schema protocol is available

## See also
- `../sections/40-platform.md`
- `platform-ndjson.md`
