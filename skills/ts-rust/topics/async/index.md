# Async

Async lets a task wait without occupying a thread. It does not make blocking calls or long calculations cooperative.
These pages use Tokio when a runtime API is needed. Follow the project's runtime and enabled features.

| Need | Read |
| --- | --- |
| Await I/O or move blocking work off a worker | [Execution](./execution.md) |
| Access shared state around `.await` | [Locking](./locking.md) |
| Run independent work and own spawned tasks | [Tasks](./tasks.md) |
| Race work, set deadlines, or shut down | [Cancellation](./cancellation.md) |
| Queue requests, reply once, or publish changes | [Channels](./channels.md) |
| Define async traits or callback bounds | [Traits and callbacks](./traits.md) |

Read tasks and cancellation together when adding background work.
