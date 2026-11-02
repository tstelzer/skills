# Diagnostics

First check the game's state, schedule, and data. Measure time spent per frame before making a performance change.

Modules: `bevy::diagnostic`, `bevy::log`, `bevy::gizmos`, `bevy::dev_tools`, `bevy::ecs::error`.

## Find missing behavior

- Check that the plugin registered the system in a schedule that actually runs.
- Check its run conditions and current state.
- Check query filters and `Single` validation when a system appears to be skipped.
- Check queued commands and system order when new entities are missing.
- Check for failed asset loads and wait for the scene to finish spawning before querying a model.
- Check the intended camera, visibility, transform, and light when an object exists but is not visible.

Add `Name` components to entities that need to be inspected.
Use `Gizmos` to draw positions, directions, or object bounds that help explain a gameplay problem.

## Measure performance

Add `FrameTimeDiagnosticsPlugin` for frame metrics.
Use `LogDiagnosticsPlugin` to print diagnostics or read `DiagnosticsStore` for an in-game display.
The FPS overlay example requires `bevy_dev_tools`.

Compare release builds on the target hardware using scenes like those in the game.
Measure time spent loading assets and preparing render pipelines separately from time spent on normal frames.
Look for growing entity counts, repeated asset creation, task queues without limits, and queries that read too much
data each frame.

Measure a system before using parallel queries, and check that each part of its work can run on its own.
Set the required system order even when systems run in parallel.

## Errors

Systems and observers that can fail can return Bevy's `Result`.
Handle expected gameplay failures where the game can recover, such as an asset failure shown on a loading screen.

Check the error's severity and the app's error handler to find out what happens when a system returns `Err`.
This release lets you set error severity and choose a handler with `App::set_error_handler`.
Fix broken game rules instead of hiding their errors with a handler that only warns or ignores them.

## Release examples

- [Log diagnostics][metrics]: frame, entity, process, and render diagnostics.
- [FPS overlay][fps]: on-screen frame metrics.
- [2D gizmos][gizmos]: visual debugging.
- [Error handling][errors]: systems that can fail, error severity, and handlers.
- [Fallible parameters][params]: checking whether system inputs are valid.
- [System stepping][stepping]: inspecting execution step by step.

[metrics]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/diagnostics/log_diagnostics.rs
[fps]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/dev_tools/fps_overlay.rs
[gizmos]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/gizmos/2d_gizmos.rs
[errors]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/error_handling.rs
[params]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/fallible_params.rs
[stepping]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/system_stepping.rs
