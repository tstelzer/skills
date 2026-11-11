# Review Performance

Check how much time and computing power the changed code needs, and how much work it can handle.

## Review target

Look for the simplest code that keeps the main work within its time and resource limits.

## Required skills

Read these detail pages from skill: ts-principles:

- `performance is not optional`
- `design for operation`
- `avoid hasty abstractions`

## What to check

- Response time in frequent or time-sensitive code. Include both typical and unusually slow requests, and how much
  work the system can finish per second.
- Work caused by one request: other calls it starts, rows read, bytes moved, objects created, locks held, retries,
  and converting data into a form that can be sent or stored.
- How work grows with input size, repeated work, and work that is not needed.
- Database and network calls.
- Memory growth, values kept longer than needed, data waiting to be processed, and frequent memory allocation.
- Work running at the same time, shared workers and connections, locks, queues, and tasks forced to run one by one.
  Check whether the system slows incoming work when it cannot keep up.
- Overload: when to reject or drop work, reduce service, limit queues, or stop accepting more work.
- Cache rules: how keys match requests, how much can be stored, how old data can be, when to remove it, and what
  happens if the cache fails.
- Logs and measurements needed to notice or prove a slowdown or rise in resource use.

## Outside this review

- Tiny speed improvements with no reason to think they affect important work or its cost.
- Changes that only make code easier to read.
- Generic cache advice with no specific rules to check.
- Reliability problems with no cost in time or resources.
- Attacks that waste resources, unless the user requested a performance review of them.
- General test quality. Include missing benchmarks or tests that would catch a performance regression.

## Steps

1. List the changed code paths and the time and resources each needs.
2. Find frequent or time-sensitive code, work with no upper limit, calls that start other calls, loops, queues,
   shared workers or connections, locks, caches, and shared services.
3. Compare the old and new costs. Count queries, requests, rows, bytes, and memory allocations.
   Check work running at the same time, retries, data conversion, and time spent waiting.
4. Check the slowest requests separately from average requests.
5. Find where work waits when requests arrive faster than the system can handle them.
6. Check whether limits on work running at once match the part of the system that runs out of capacity first.
7. Check that caches and waiting data have size limits. Check the rules for keeping data up to date.
8. Keep only problems backed by measurements, a clear explanation of how work grows with input size, or specific
   extra work in a frequent or time-sensitive code path.
9. Return findings using [review-template.md](../review-template.md).

## Severity examples

Use these examples to help judge how serious the actual problem is.

- `critical`: a measured rise in time or resource use in a main code path, or memory or queues that can grow without
  limit during normal use.
- `high`: doubling the input accidentally causes about four times the work, too many database, network, or file
  operations, no limit on work running at once, or a cache with no clear rules for storing and reusing data.
- `low`: extra cost outside the main code paths, or cleanup with no measured effect.

## Category examples

- `latency`
- `tail-latency`
- `throughput`
- `cost-model`
- `complexity`
- `fan-out`
- `database-io`
- `network-io`
- `memory`
- `allocation-churn`
- `concurrency`
- `saturation`
- `backpressure`
- `overload`
- `cache-contract`
- `observability`
