# Performance Review

Use this for performance regressions and waste. Prefer evidence from hot paths,
measured behavior, or obviously unnecessary work over vague style opinions.

## Focus

- Hot-path latency and throughput regressions
- Algorithmic complexity and repeated work
- Unnecessary I/O, N+1 patterns, and redundant queries or requests
- Memory growth, retention, and allocation churn
- Concurrency bottlenecks, serialization, and missing back-pressure
- Expensive work on critical paths that should be cached, deferred, or batched

## Workflow

1. Identify hot paths, loops, fan-out points, and shared resources.
2. Look for repeated work hidden behind convenience abstractions.
3. Check whether the change adds synchronous blocking, extra queries, or extra
   serialization in common paths.
4. Prefer findings backed by code-path analysis, benchmark output, profiler
   data, or a clear complexity argument.

## Category Hints

- `latency`
- `throughput`
- `complexity`
- `memory`
- `i-o`
- `concurrency`
- `caching`

## Evidence Hints

- Benchmark or profiler output
- Query count changes
- Complexity increase on hot paths
- New unbounded loops, buffering, or fan-out
