# Concurrency

Decide who owns each value and who waits for each worker before adding synchronization.

| Need | Read |
| --- | --- |
| Borrow data across threads or run CPU work in parallel | [Threads](./threads.md) |
| Protect shared state or choose atomic ordering | [Locks and atomics](./synchronization.md) |

For work on an async runtime, start with [async execution](../async/execution.md).
