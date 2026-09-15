---
name: ts-performance-browser
description: >-
  Browser performance guidance. Use when designing, changing, or reviewing client-side responsiveness, rendering,
  animation, high-frequency events, live data, large DOM trees, or CPU-heavy browser work.
---

# Browser performance

## how the browser spends time

JavaScript, event handling, style calculation, layout, and paint share the browser's main thread.
A task that keeps the thread busy delays input and the next frame.

Improve response to input separately from total runtime. Splitting work can take more time overall,
but lets the browser handle input and render between tasks. Even a faster operation can make the UI feel slower
if it blocks the thread until it finishes.

Set time budgets for the target device and display. A 60 Hz display starts a
new frame about every 16.7 milliseconds, while a 120 Hz display starts one
about every 8.3 milliseconds. The application receives only part of that
interval. Do not turn either number into a universal JavaScript budget.

Measure on hardware like the user's. Development desktops can hide long tasks, heavy memory allocation,
and expensive layout. Use browser profiles and measurements from real use to find delayed input, missed frames,
repeated layout, and work that continues offscreen.

## shape main-thread work

Try these in order:

1. Eliminate work that does not affect the current result.
2. Move suitable work away from the main thread.
3. Schedule the remaining work around input and rendering.
4. Speed up the operation measurements show is costly.

### eliminate obsolete work

When the product needs only the current state, combine updates and keep the latest values. Discard stale stream
entries, skip repeated calculations, and limit saved history. Keep every event only when losing one would break
required behavior.

Do not create or update invisible UI without a reason. Render large lists near
the viewport, pause recurring work while it is hidden, and delay expensive
initialization until the user approaches the feature.

Cache computed results only when measurements show repeated work and the cache has a clear lifetime.
A cache that keeps growing saves main-thread time at an unlimited memory cost.

### split long tasks

Break interruptible work into slices. Yield between slices so the browser can
handle input and produce frames. Set slice size from measurements rather than
an arbitrary item count.

Choose the yield point for the work:

- Resume frame-related work through `requestAnimationFrame`.
- Resume other work with an API that yields to another browser task and is supported by the target browsers.
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

Batch work when repeating setup costs most of the time. Apply DOM changes together, process queue entries in
limited groups, and render at most once per frame when several events describe the same visual update.

Debounce work that should run after activity settles. Throttle work that must
make progress during continuous activity. Both change timing, so choose based on how the interaction must behave.

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

### prioritize what the user needs now

Handle user input before work done in anticipation or in the background. When the user needs a queued result,
the task may become urgent. Allow queued work to move up in priority or be cancelled.

Priority cannot interrupt JavaScript that is already running. Long tasks must
yield before urgent work can pass them.

### defer non-urgent work

Delay code loading, rendering, calculations, and recurring updates until they can affect the user.
Use whether content is visible or nearly onscreen to help decide. Spare time alone does not make work necessary.

## control rendering cost

Read sizes and positions before writing DOM or style changes. Reading them after a write can force immediate layout.
Alternating reads and writes in a loop can repeat that cost for every element.

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

Workers cost time and memory to start and exchange data. Account for startup, structured cloning, message frequency,
and memory. Transfer large transferable buffers when the sender no longer needs them.

```ts
worker.postMessage(
  { buffer: pixels.buffer, width, height },
  [pixels.buffer],
)
```

Do not move small operations to a worker by default. Communication can cost
more than the computation it replaces.

## when updates arrive too fast

Live data can arrive faster than the interface can render it. A queue without
a bound turns a temporary burst into growing latency and memory use. Define
what the interface does when it falls behind:

- Drop old entries when only recent activity matters.
- Merge queued updates when only the latest state matters.
- Preserve and batch events when every event matters.
- Stop or reduce optional effects while the backlog exists.

Show overload when silently losing updates would break required product behavior.
The UI may need to say that updates were sampled, paused, or omitted.

## measurement

Start with user-visible symptoms and trace them to main-thread work. Check:

- time to respond to input, including the slowest responses
- long tasks around delayed input
- frame timing during scroll and animation
- scripting, style, layout, paint, and compositing cost
- forced synchronous layout and repeated DOM mutation
- detached nodes, caches kept in memory, and repeated memory allocation
- background work that continues while hidden

Profile the real interaction with realistic data. Test cold startup and
sustained use. Recheck after the change; moving work can shift the bottleneck
to memory, worker communication, or rendering.
