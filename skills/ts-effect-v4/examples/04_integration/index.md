## Integrating Effect into existing applications

`ManagedRuntime` bridges Effect programs with non-Effect code. Build one runtime
from your application Layer, then use it anywhere you need imperative execution,
like web handlers, framework hooks, worker queues, or legacy callback APIs.

Await `runtime.dispose()` during host shutdown. Disposal interrupts managed
fibers and waits for their cleanup before releasing layer resources.
