# Background tasks and gameplay tests

Keep frame systems short. Test gameplay through its data and public systems without starting a renderer.

Modules: `bevy::tasks`, `bevy::app`, `bevy::time`, `bevy::ecs`.

## Run background work

Use `AsyncComputeTaskPool` for calculations that may take several frames to finish.
Use `IoTaskPool` for I/O work such as reading files. Check what the target platform supports.

- Move the data the task needs into it.
- Keep its `Task<T>` handle in a component or resource.
- Check whether it has finished with `bevy::tasks::futures::check_ready`.
- Apply the result through a system or queued command.
- Remove the finished task so it is not checked again.
- Check that the requesting entity or level still exists before applying the result.

Do not pass borrowed components or resources into a background task.
Return plain data unless the operation specifically needs a `CommandQueue`.
Use a channel when code outside the game loop sends several results.
Limit the queue size and decide what happens when it is full.

Keep task handles when the game needs their results. Dropping a `Task` requests cancellation.
`detach()` lets work continue without its handle. Decide how to handle its result, report failures, and stop the work.
Before applying a late result, check that it belongs to the current request or level version.
Do not let an old result overwrite newer state.

Do not block the frame waiting for a task to finish.
The release's async example uses `check_ready` to check for a result without waiting.

## Test without graphics

Use `App::new()` with the game plugin under test, then call `app.update()` to advance the app.
Inspect the world's components, resources, or messages for the result.
Use `World::run_system_once` to test one system when the test does not depend on a schedule.

Add only the runtime plugins the behavior needs:
`MinimalPlugins` supplies time and task pools, but does not supply states, input, assets, or transform propagation.
For state tests, add `StatesPlugin`. For message tests, register the message type.

Test game rules and failure cases: health cannot fall below zero, unloading a level removes its entities,
a load failure leaves the loading state, or a button press is handled once.
Run the schedule in tests that depend on when commands are applied or which system runs first.

Keep a random generator in a resource and seed it explicitly when a test must repeat the same random choices.
[Alien Cake Addict][random] uses this for board heights and item placement.
A seed alone does not make the whole game repeatable; the order of random draws and simulation steps must also match.
Its random generator comes from separate crates. Check the release's dev-dependencies before copying its imports.

## Check replay and rollback

Rollback restores an earlier game state and runs it again with corrected player input.
Give the simulation recorded actions for each step. Keep live keyboard input and wall-clock time outside that work.
Bevy does not guarantee [query iteration order][query-order]. Sort by stable game IDs when order affects the result.
Keep those IDs in the saved state; runtime `Entity` values are not shared player IDs.

Test restoring a snapshot and replaying the same inputs. Compare gameplay data at each step, in a stable order.
Restore gameplay resources and all components needed by systems, including query markers such as `Player`.
Restore the random generator's current state too.
Test across spawning, despawning, and round changes. Restoring an entity without its marker can silently exclude it
from gameplay systems. Keep file writes and sound playback out of replayed systems so they do not repeat.

The [Extreme Bevy desync chapter][desync] explains the missing-marker case.
It belongs to the Bevy 0.17 tutorial series and links to the `part-3.5` reference.
Use its test design here; check networking plugins' Bevy compatibility separately before adopting their APIs.

## Control time

Use `TimeUpdateStrategy::ManualDuration` instead of sleeping:

```rust
use std::time::Duration;

use bevy::{prelude::*, time::TimeUpdateStrategy};

fn timed_app() -> App {
    let mut app = App::new();
    app.add_plugins(MinimalPlugins)
        .insert_resource(TimeUpdateStrategy::ManualDuration(
            Duration::from_millis(20),
        ));
    app
}
```

The first update sets up the clock. Allow for this when checking elapsed time or counting fixed steps.
Set `Time<Fixed>` when the test needs a specific simulation rate.

Check graphics and behavior on the target platform in separate tests.
Gameplay tests without graphics cannot prove that a shader compiles or an audio device works.

## Release examples and API

- [Async compute][compute]: task handles and checking for results.
- [Async channel pattern][channel]: repeated results through a channel.
- [External producer][external]: work from an external thread.
- [Relationships][world]: a world without an app and systems run on their own.
- [Time tests][time]: `ManualDuration` and checking how the fixed loop runs.
- [App API](https://docs.rs/bevy/0.20.1/bevy/app/struct.App.html): `update`, `world`, and `world_mut`.

[compute]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/async_tasks/async_compute.rs
[channel]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/async_tasks/async_channel_pattern.rs
[external]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/async_tasks/external_source_external_thread.rs
[world]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/relationships.rs
[time]: https://github.com/bevyengine/bevy/blob/v0.20.1/crates/bevy_time/src/lib.rs
[random]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/showcase/alien_cake_addict.rs
[query-order]: https://docs.rs/bevy/0.20.1/bevy/ecs/system/struct.Query.html#method.iter
[desync]: https://johanhelsing.studio/posts/extreme-bevy-desync-detection
