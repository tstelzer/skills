# Assets

Load files with `AssetServer`. Keep their typed `Handle<T>` values in components or resources.
Read or change loaded values through `Assets<T>`.

Modules: `bevy::asset`, `bevy::image`, `bevy::gltf`.

## Load and keep assets

`AssetServer::load` starts loading and returns a handle without waiting for the load to finish.
The asset and the other assets it needs may still be loading.

Paths normally start inside the application's `assets/` directory.
For example, `"textures/player.png"` names `assets/textures/player.png`.
Configure the root through `AssetPlugin` when the application needs another layout.

Keep a strong handle for as long as the asset is needed. Dropping all strong handles allows the asset to be removed.
Clone a handle to share an asset. This does not copy the image, mesh, or material itself.

Use `Assets<T>::add` for generated meshes and materials. Reuse the handle across entities.
Changing a shared material through `Assets<T>` changes every entity using that asset.
Create separate material assets when entities need different values.

## Model loading as a state

- Start loads once when entering a loading state.
- Store the handles in a resource.
- Use `AssetServer::is_loaded_with_dependencies` to check whether the asset and all assets it needs have loaded.
- Use `get_load_states` to check whether the asset, its dependencies, or their dependencies failed to load.
- Show a load failure or let the player recover from it.
  A failed dependency must not leave the loading screen waiting forever.

Read `AssetEvent<T>` messages for load and change notifications, including `LoadedWithDependencies`.
A loaded asset does not mean its entities have spawned yet.
Read [scenes](../08_scenes/index.md) before querying a loaded model's children.

For several asset types, keep a pending list of `UntypedHandle` values, as in the [loading screen example][screen].
Check each with `is_loaded_with_dependencies` and remove completed entries. Keep the level's strong handles elsewhere
after removing them from the pending list. Reset the list and progress counters when starting a new level load.

Creating a handle resource with `init_resource` does not wait for its assets to load.
Run systems that use those assets only after loading succeeds, or insert a ready resource after checking the loads.
Bevy New 2D's `load_resource` is its own helper, not a Bevy method; see its
[design](../01_app/index.md#organize-gameplay) before copying that call.

To prepare render pipelines before revealing a level, spawn it behind a loading overlay and let it render.
The example reads `PipelineCache::waiting_pipelines` through its own `PipelinesReadyPlugin` and waits for several
consecutive ready frames. Copy that plugin's implementation when adopting this approach.
An empty queue only describes work already submitted. Pipelines can also leave the queue after a permanent error.
Check pipeline errors; a few ready frames do not guarantee that later content needs no new pipelines.
This step uses rendering APIs beyond asset loading.

## Configure loading

Use typed labels such as `GltfAssetLabel::Scene(0).from_asset("models/hero.glb")` for glTF sub-assets.
Replace the example path with an asset shipped by the application.

Use loader settings when import behavior matters, such as image sampling or texture arrays.
The `file_watcher` feature enables file watching for development. The `dev` feature collection includes it.
Use file watching during development. Plan how the packaged game will find its assets separately.

For assets loaded over a network, enable the required network features and handle load failures.

## Load game definitions

Store shared character or item definitions in assets. Keep changing values, such as current health, in components.
See the [character data example][characters] for movement speeds and sprite animation ranges stored in a file.
It uses Bevy 0.20 at commit `0e37080502fe`; its helper plugins have separate version requirements.

For a game-specific file format, follow the release's [custom asset example][custom]:

- Derive `Asset` and `TypePath` for the loaded type.
- Implement `AssetLoader` and register both types with `init_asset::<T>()` and `init_asset_loader::<L>()`.
- Read through the loader's `Reader` and return parse or validation errors from `load`.
- Validate values before spawning entities. For animation data, reject zero frame counts and invalid frame ranges.
- Keep the handle and wait for loading to finish before reading the definition through `Assets<T>`.

A string containing an image path does not load that image or make it an asset dependency.
Load referenced images through `LoadContext::load` inside the loader and store typed handles.
Mark handle fields with `#[dependency]` so the asset derive can report them as dependencies.
See the [dependency docs][dependencies] and [LoadContext API][load-context].
This lets the loading state wait for both the definition and its images.

## Release examples and API

- [Asset loading][loading]: handles, sub-assets, and generated materials.
- [Loading screen][screen]: assets and render pipeline readiness.
- [Loader settings][settings]: per-load settings.
- [Hot reload][reload]: development file watching.
- [Custom asset][custom]: defining and loading a file format.
- [AssetServer API][server]: readiness and failure queries.

[loading]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/asset/asset_loading.rs
[screen]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/showcase/loading_screen.rs
[settings]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/asset/asset_settings.rs
[reload]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/asset/hot_asset_reloading.rs
[custom]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/asset/custom_asset.rs
[server]: https://docs.rs/bevy/0.20.1/bevy/asset/struct.AssetServer.html
[dependencies]: https://docs.rs/bevy/0.20.1/bevy/asset/index.html#asset-dependencies
[load-context]: https://docs.rs/bevy/0.20.1/bevy/asset/struct.LoadContext.html#method.load
[characters]:
  https://github.com/jamesfebin/ImpatientProgrammerBevyRust/tree/0e37080502feebf8a34998fcc4255dd780304f37/chapter3
