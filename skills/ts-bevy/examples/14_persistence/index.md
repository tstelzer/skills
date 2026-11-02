# Persistence

Choose a save format based on what the game needs after a restart.

Modules: `bevy::settings`, `bevy::reflect`, `bevy::world_serialization`.

| Need | Approach |
| --- | --- |
| Preferences such as audio level or window settings | `SettingsPlugin` and settings resources |
| Reflected ECS content or a world snapshot | `DynamicWorld`, `DynamicWorldBuilder` |
| A save that still works after the game's data format changes | Saved data with a version number and upgrade rules |

## Settings

Enable the `bevy_settings` feature and add `SettingsPlugin::new(application_id)`.
Keep the same application identifier across releases so they find the same preferences.

The release example derives `Resource`, `SettingsGroup`, `Reflect`, and `Default`, with
`#[reflect(Resource, SettingsGroup, Default)]` on settings resources.
Follow the example's type registration setup so Bevy can read the fields through reflection.
Check this setup when disabling default features.

Queue `SaveSettingsDeferred` to combine changes made close together into one save.
Use `SaveSettingsSync::IfChanged` to finish saving before the desktop app's normal exit.
Follow the release's browser guidance for when to save settings.

Settings can write to disk or browser storage. Use a test application identifier when running examples.

## World serialization

Use `DynamicWorldBuilder` to choose entities and resources for a snapshot.
Register the component and resource types with reflection so Bevy can load them.
Use `#[reflect(skip_serializing)]` for fields that should not be saved. Provide a way to rebuild those fields on load.

Spawn serialized dynamic content with `DynamicWorldRoot`.
Use the release's `WorldAssetRoot` and `WorldInstanceReady` APIs for imported world assets;
see [scenes](../08_scenes/index.md).

Saving ECS data alone does not ensure that future game versions can load it.
Choose game IDs that stay the same after a restart. Give the save format a version and define how to upgrade old saves.
Do not use runtime `Entity` IDs or renderer state to identify saved game objects.
In a custom save format, store asset references that remain valid after a restart and rebuild handles on load.

Do not make the frame loop wait for file operations. Use storage APIs supported by the browser for browser builds.
Use [tasks](../15_tasks-tests/index.md) to return completion or failure to the game.

## Release examples

- [Settings][settings]: resources, delayed saves, and controlled exit.
- [Window settings][window]: persisting window preferences.
- [World serialization][world]: reflected types, loading, and saving selected world data.
- [Reflection serialization][reflect]: serialization of reflected values.

[settings]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/app/settings.rs
[window]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/window/persisting_window_settings.rs
[world]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/scene/world_serialization.rs
[reflect]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/reflection/serialization.rs
