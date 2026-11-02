# Platforms

Choose the target platform and Cargo features before copying code written for a specific platform.

Modules: `bevy::window`, `bevy::winit`, `bevy::app`.
Read the [release platform guide][platforms] for target setup.
Read the [Linux dependency guide][linux] for native packages.

## Desktop

Start with the `2d`, `3d`, `ui`, and `audio` feature groups you need.
For build failures, check system libraries and the selected Linux window backend before changing API calls.
The default platform features enable both X11 and Wayland support.

Use `WindowPlugin` to configure windows and `WinitSettings` for event-loop behavior such as low-power applications.
Package assets where the application is set up to find them.

## Browser

Use the `wasm32-unknown-unknown` target with the release's Wasm setup instructions.
A Wasm file still needs browser loading code and assets served at the expected URLs.

The `webgpu` feature overrides `webgl2`. Enabling both does not let the game fall back to WebGL2 while running.
Choose the graphics backend according to the browsers and effects the game must support.

- Start audio from a user interaction when the browser requires it.
- Use browser-compatible storage for settings and saves.
- The browser controls access to the clipboard, cursor capture, and fullscreen mode.
- Bevy's browser task pool runs on the JavaScript event loop. Split calculations into small chunks and let the
  browser run between them. Putting work in `async` does not move it to another thread.
- Test asset URLs, case sensitivity, and loading failures after packaging.

Bevy's Wasm helper builds its examples. Other Bevy games do not have to depend on it.

## Mobile

Read the release's `examples/mobile` project and platform guide before setting up Android or iOS builds.
Check touch input and what happens when the app opens, closes, pauses, or resumes.
Check graphics support and packaged assets.
Keep platform startup code and build requirements outside ordinary gameplay plugins.

## Run without graphics

Use `App::update()` for tests or when other code controls the loop.
Use `MinimalPlugins` with `ScheduleRunnerPlugin` when the app needs its own loop.
Its default runner loops as fast as possible. Set `run_loop(Duration)` to limit how often it runs.

```rust
use std::time::Duration;

use bevy::{app::ScheduleRunnerPlugin, prelude::*};

fn main() {
    App::new()
        .add_plugins(MinimalPlugins.set(ScheduleRunnerPlugin::run_loop(
            Duration::from_secs_f64(1.0 / 60.0),
        )))
        .run();
}
```

Disabling rendering plugins does not remove graphics dependencies already enabled by Cargo features.
Set `default-features = false` and choose features when build size or system library requirements matter.
For example, `["std", "default_app"]` provides a basic app without the window and rendering feature groups.
Add runtime plugins for the actual resources and schedules the server needs.

## Release examples

- [Platform guide][platforms]: mobile and browser instructions.
- [Linux dependencies][linux]: native packages for the selected features.
- [Mobile project][mobile].
- [Headless app][headless]: schedule runner setup.
- [Low-power window][power]: event-loop behavior.

[platforms]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/README.md
[linux]: https://github.com/bevyengine/bevy/blob/v0.20.1/docs/linux_dependencies.md
[mobile]: https://github.com/bevyengine/bevy/tree/v0.20.1/examples/mobile
[headless]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/app/headless.rs
[power]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/window/low_power.rs
