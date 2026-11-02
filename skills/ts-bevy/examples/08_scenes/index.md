# Scenes

Choose the API based on what you need to spawn.

Modules: `bevy::scene`, `bevy::world_serialization`, `bevy::gltf`.

| Need | Start with |
| --- | --- |
| A few entities created by gameplay | `Commands::spawn` with component tuples |
| Scenes defined in Rust that can be reused and combined | `bsn!`, `bsn_list!` |
| A glTF scene loaded from a file | `WorldAssetRoot` and `GltfAssetLabel::Scene` |
| Entities and components loaded from a world file using reflection | `DynamicWorldRoot`; see persistence |

## Reuse component bundles

For a repeated component tuple, write a function returning `impl Bundle`.
Pass handles and settings as arguments, then spawn the result with `commands.spawn(...)` or place it in `children!`.
The release's [widget functions][widgets] use this for reusable UI controls.

Each component type can appear only once in a bundle, including nested tuples.
Pass a different value to the function or call `insert` after spawning to replace a component.
Adding another copy of the component to the tuple causes a panic.
Use BSN below when field overrides and nested scenes fit the task.

## Build scenes with BSN

Read [01_scene.rs](./01_scene.rs).

`bsn!` describes one root entity. `bsn_list!` describes several.
Inside a scene list, `--` separates entities. Components written together without `--` belong to the same entity.

- Use `Children [ ... ]` for nested entities.
- Use `@some_scene(...)` to include a reusable scene.
- Specify component fields to override their template defaults.
- Use `#Name` to name an entity. BSN also lets you refer to named entities within the same scope.
- Use `asset_value(...)` to create an asset from a value inside the scene.
- Attach an observer with `on(...)`.

A function returning `impl SceneList` can become a startup system with `scene.spawn()`, as in the release examples.
BSN templates have rules that differ from normal Rust struct syntax.
Check the macro docs before adding custom components or handles to a snippet.

In this release, write BSN through Rust macros. Loading separate `.bsn` files is described as future work;
do not assume it is available.

## Wait for dependencies and children

`Commands::spawn_scene` tries to spawn the scene when Bevy applies the command.
It logs an error if required assets have not loaded yet.
Its return value is `EntityCommands`.
Use `World::spawn_scene` to get a `Result` immediately and handle any error.
`Commands::queue_spawn_scene` records which assets the scene needs and waits for them to load before spawning.

Observe `bevy::scene::Ready` for BSN entities after they and their children have spawned.
Use the queued form for scenes whose templates depend on assets that may still be loading.

A glTF root uses a different API:

```rust
use bevy::prelude::*;

fn load_model(mut commands: Commands, assets: Res<AssetServer>) {
    commands.spawn(WorldAssetRoot(
        assets.load(GltfAssetLabel::Scene(0).from_asset("models/hero.glb")),
    ));
}
```

This function requires the application's `assets/models/hero.glb`.
Observe `bevy::world_serialization::WorldInstanceReady` on that root before looking for spawned children.
The mesh or animation player may be on a child entity. Search the root's descendants for the components you need.

Use [animation](../11_animation/index.md) for model players and
[persistence](../14_persistence/index.md) for worlds saved to files.

## Release examples and API

- [BSN composition][bsn]: reusable scenes and field overrides.
- [Simple 3D scene][scene3d]: scene lists and asset values.
- [glTF loading][gltf]: spawning a loaded world asset.
- [Animated mesh][animation]: waiting for a world instance and finding its player.
- [Scene module](https://docs.rs/bevy/0.20.1/bevy/scene/index.html): syntax and how spawning works.

[bsn]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/scene/bsn.rs
[scene3d]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/3d/3d_scene.rs
[gltf]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/gltf/load_gltf.rs
[animation]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/animation/animated_mesh.rs
[widgets]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ui/widgets/standard_widgets.rs
