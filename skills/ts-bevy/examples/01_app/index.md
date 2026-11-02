# App setup

Use `App` to register plugins, resources, messages, and systems. A plugin groups one game feature's setup.

Modules: `bevy::app`, `bevy::window`. Common types come from `bevy::prelude::*`.

## Select features

For the full default set:

```toml
[dependencies]
bevy = "=0.20.1"
```

For a 2D game with UI and audio:

```toml
[dependencies]
bevy = { version = "=0.20.1", default-features = false, features = ["2d", "ui", "audio"] }
```

The release's default features are `2d`, `3d`, `ui`, and `audio`.
Use `3d` in place of `2d` for a 3D game. Add features according to the API and target platform you need.

Cargo features decide what is compiled. Plugins decide what runs in an app.
`DefaultPlugins` adds plugins for the enabled features. It cannot supply an API disabled in Cargo.

`MinimalPlugins` supplies task pools, frame counting, time, and a schedule runner.
Add state, input, asset, or transform plugins when an app without graphics needs them.

Put development tools behind an application feature such as `dev`.
Guard both the module and its plugin registration with `#[cfg(feature = "dev")]`.
Cargo's `--release` changes the build profile; it does not disable default features.
Choose the shipped game's features explicitly. See [Cargo's feature options][cargo-features].

## Organize gameplay

Read [01_plugin.rs](./01_plugin.rs) for a complete small plugin.

- Group code by game feature, such as combat, inventory, or level loading.
- Register that feature's resources, messages, and systems in a plugin.
  A function such as `fn menu_plugin(app: &mut App)` works with `add_plugins(menu_plugin)`.
  Use a struct implementing `Plugin::build` when it needs configuration fields or other plugin lifecycle methods.
- Use `Startup` to create initial entities, `Update` for work each frame, and state schedules for level or menu setup.
- Use `init_resource` to create a resource through `Default` or `FromWorld`. Use `insert_resource` to supply its value.
- Configure a built-in plugin through `DefaultPlugins.set(...)`.
- Use schedules and system sets to order work. Plugin registration order does not set the order of systems.

```rust
use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "Orchard".into(),
                ..default()
            }),
            ..default()
        }))
        .run();
}
```

See [Bevy New 2D's design][template] for a larger example of this structure
(Bevy 0.19, commit `bb9fa3e25cc8`). Use the pinned APIs in this handbook when adapting it.
Use [states](../05_states/index.md) to create and remove content when entering or leaving a menu or level.
Use [platforms](../18_platforms/index.md) for apps without graphics and setup for each target platform.

## Release examples

- [plugin.rs](https://github.com/bevyengine/bevy/blob/v0.20.1/examples/app/plugin.rs): configurable gameplay plugin.
- [plugin_group.rs](https://github.com/bevyengine/bevy/blob/v0.20.1/examples/app/plugin_group.rs): groups of plugins.
- [Window setup][window]: title, resolution, cursor, and other window settings.
- [Default and minimal plugin groups][plugins]: which plugins each group contains.

[window]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/window/window_settings.rs
[plugins]: https://docs.rs/bevy/0.20.1/bevy/struct.DefaultPlugins.html
[cargo-features]: https://doc.rust-lang.org/cargo/reference/features.html#command-line-feature-options
[template]: https://github.com/TheBevyFlock/bevy_new_2d/blob/bb9fa3e25cc83646fec2adc7ad85e4a0936042c5/docs/design.md
