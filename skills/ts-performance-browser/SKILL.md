---
name: ts-performance-browser
description: >-
  Browser performance guidance. Use when designing, changing, or reviewing client-side responsiveness, rendering,
  animation, high-frequency events, live data, large DOM trees, or CPU-heavy browser work.
---

# Browser performance

## mental model

Treat the browser main thread as a shared resource. JavaScript execution, event
handling, style calculation, layout, and paint compete for the same time. A
task that occupies the thread also delays input and the next frame.

Optimize responsiveness separately from completion time. Splitting work adds
overhead and may increase total runtime, but it gives input and rendering a
chance to run. A faster operation can still produce a worse interface when it
blocks the thread in one uninterrupted task.

Derive budgets from the target device and display. A 60 Hz display starts a
new frame about every 16.7 milliseconds, while a 120 Hz display starts one
about every 8.3 milliseconds. The application receives only part of that
interval. Do not turn either number into a universal JavaScript budget.

Measure on representative hardware. Desktop development machines hide long
tasks, allocation pressure, and expensive layout. Use browser profiles and
field measurements to find delayed interactions, missed frames, repeated
layout, and work that continues outside the viewport.

## shape main-thread work

Use these moves in order of leverage:

1. Eliminate work that does not affect the current result.
2. Move suitable work away from the main thread.
3. Shape the remaining work around interaction and rendering.
4. Optimize the measured hot operation.

### eliminate obsolete work

Do not process every update when the product needs only the current state.
Coalesce superseded values, discard stale stream entries, skip repeated
computations, and cap retained history. Preserve every event only when losing
one would change the contract.

Do not create or update invisible UI without a reason. Render large lists near
the viewport, pause recurring work while it is hidden, and delay expensive
initialization until the user approaches the feature.

Memoization is useful only when repeated work is measured and its cache has a
clear lifetime. A growing memo table exchanges main-thread time for an
unbounded memory cost.

### split long tasks

Break interruptible work into slices. Yield between slices so the browser can
handle input and produce frames. Set slice size from measurements rather than
an arbitrary item count.

Choose the yield point for the work:

- Resume frame-related work through `requestAnimationFrame`.
- Resume other work through a task-yielding primitive supported by the target
  browsers.
- Do not use a resolved promise as a yield. Microtasks run before rendering
  gets another turn.

Keep each `requestAnimationFrame` callback small. Scheduling work before a
frame does not make the work fit inside that frame.

```ts
async function processInSlices<T>(
  items: ReadonlyArray<T>,
  budgetMs: number,
  process: (item: T) => void,
  yieldToBrowser: () => Promise<void>,
): Promise<void> {
  let sliceStartedAt = performance.now()

  for (const item of items) {
    process(item)

    if (performance.now() - sliceStartedAt >= budgetMs) {
      await yieldToBrowser()
      sliceStartedAt = performance.now()
    }
  }
}
```

Some operations cannot yield midway. Large synchronous parsing, compression,
or third-party calls may require smaller inputs, a worker, or a different data
format.

### batch frequent work

Batch when repeated fixed costs dominate. Apply DOM changes together, process
queue entries in bounded groups, and render at most once for each frame when
several events describe the same visual update.

Debounce work that should run after activity settles. Throttle work that must
make progress during continuous activity. Both policies change timing, so
choose them from the interaction contract.

```ts
let latestPrice: Price | undefined
let renderScheduled = false

const receivePrice = (price: Price): void => {
  latestPrice = price
  if (renderScheduled) return

  renderScheduled = true
  requestAnimationFrame(() => {
    renderScheduled = false
    if (latestPrice !== undefined) renderPrice(latestPrice)
  })
}
```

Batching improves throughput but can create a long task. Bound batch size or
execution time when a batch can grow with external input.

### prioritize current intent

Handle direct user input before speculative or background work. A task can
become urgent when the user requests its result, so allow queued work to be
promoted or cancelled.

Priority cannot interrupt JavaScript that is already running. Long tasks must
yield before urgent work can pass them.

### defer non-urgent work

Delay code loading, rendering, computation, and recurring updates until their
results can affect the user. Visibility and proximity to the viewport are
useful signals. Idle time is an opportunity, not proof that the work is
needed.

## control rendering cost

Group layout reads before DOM or style writes. Reading geometry after a write
can force the browser to calculate layout immediately. Alternating reads and
writes inside a loop can repeat that cost for every element.

Weak:

```ts
for (const element of elements) {
  const width = element.offsetWidth
  element.style.width = `${width + 8}px`
}
```

Stronger:

```ts
const widths = elements.map((element) => element.offsetWidth)

elements.forEach((element, index) => {
  element.style.width = `${widths[index]! + 8}px`
})
```

Prefer `transform` and `opacity` for motion that does not need to change
layout. The browser can often composite these changes without running layout
or paint for each frame. Verify the result in browser tools because layer
promotion is an implementation decision, not a guarantee.

For real layout changes, measure the initial and final geometry once, then
animate the visual difference with a transform. Avoid permanent or widespread
`will-change`; extra layers consume memory.

Keep DOM size bounded. Virtualize large collections when rendering every item
has a measured cost, but preserve focus, keyboard navigation, search, and
screen-reader behavior.

## move computation off the main thread

Use a worker for substantial computation that does not require DOM access,
such as image processing, large-data transforms, or parsing that cannot be
split. Keep UI mutation on the main thread and return the smallest useful
result.

Worker boundaries have costs. Account for startup, structured cloning,
message frequency, and memory. Transfer ownership of large transferable
buffers when the sender no longer needs them.

```ts
worker.postMessage(
  { buffer: pixels.buffer, width, height },
  [pixels.buffer],
)
```

Do not move small operations to a worker by default. Communication can cost
more than the computation it replaces.

## overload policy

Live data can arrive faster than the interface can render it. A queue without
a bound turns a temporary burst into growing latency and memory use. Define
what the interface does when it falls behind:

- Drop old entries when only recent activity matters.
- Merge queued updates when only the latest state matters.
- Preserve and batch events when every event matters.
- Stop or reduce optional effects while the backlog exists.

Expose overload when silent loss would violate the product contract. The UI
may need to show that updates were sampled, paused, or omitted.

## measurement

Start with user-visible symptoms and trace them to main-thread work. Check:

- interaction latency and its slow tail
- long tasks around delayed input
- frame timing during scroll and animation
- scripting, style, layout, paint, and compositing cost
- forced synchronous layout and repeated DOM mutation
- detached nodes, retained caches, and allocation churn
- background work that continues while hidden

Profile the real interaction with realistic data. Test cold startup and
sustained use. Recheck after the change; moving work can shift the bottleneck
to memory, worker communication, or rendering.
