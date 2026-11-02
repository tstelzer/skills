---
name: ts-bevy
description: Bevy 0.20.1 handbook for Rust games, public APIs, and examples for this release.
---

# Bevy

Use this handbook to build games with Bevy's public API.

## Reference snapshot

- Repository: `bevyengine/bevy`
- Release: `v0.20.1`
- Commit: `a0577b5c6a7b208719dd761c5c6a7a539e472a97`
- Crate: `bevy = "=0.20.1"`
- Minimum Rust version: `1.97.1`
- Rust edition in the release: `2024`
- Latest stable release checked: `2026-11-02`

Use this release throughout a task. Check the version requested in `Cargo.toml` and the version chosen in `Cargo.lock`.
For a Git dependency, check its commit too. Check the APIs again before using a newer release.
Do not change this pin without telling the user.

Use [versioned API docs](https://docs.rs/bevy/0.20.1/bevy/).
Read the [source guide](./sources.md) when looking up signatures, upstream examples, features,
or platform requirements.

## Where to start

- Pick a task below. Do not read every topic.
- For implementation or review, read that topic's `index.md`, then its relevant examples.
- For a narrow API lookup, open the named example or versioned API page.
- Local `.rs` files are small, independent examples. Read their topic guide for setup and limits.
- Follow upstream example links for complete applications, asset files, and less common options.
- Read [migration notes](./migration.md) when adapting older tutorials or existing Bevy code.

For implementation and review, also apply skill: ts-principles.

## Choose a task

Paths are relative to this file.

| Task | Start here |
| --- | --- |
| Start a game, select features, organize plugins | [App setup](./examples/01_app/index.md) |
| Store game data, query components, link entities | [Gameplay data](./examples/02_ecs/index.md) |
| Order systems, apply commands, choose a timestep | [Scheduling and time](./examples/03_scheduling/index.md) |
| Send gameplay messages or react to events | [Messages and observers](./examples/04_communication/index.md) |
| Switch menus, levels, loading, or pause states | [Game states](./examples/05_states/index.md) |
| Read input, move cameras, convert coordinates | [Input and cameras](./examples/06_input-camera/index.md) |
| Load assets and handle loading failures | [Assets](./examples/07_assets/index.md) |
| Reuse entity definitions, build scenes, load glTF models | [Scenes](./examples/08_scenes/index.md) |
| Draw sprites, sprite sheets, tiles, or 2D meshes | [2D](./examples/09_2d/index.md) |
| Draw 3D meshes, materials, lights, and shadows | [3D](./examples/10_3d/index.md) |
| Play and blend model animations | [Animation](./examples/11_animation/index.md) |
| Build menus, HUDs, text inputs, or pointer interaction | [UI and picking](./examples/12_ui-picking/index.md) |
| Play effects, music, or positional sound | [Audio](./examples/13_audio/index.md) |
| Save settings or game data | [Persistence](./examples/14_persistence/index.md) |
| Run background work or test gameplay and replays | [Tasks and tests](./examples/15_tasks-tests/index.md) |
| Debug behavior or measure time spent per frame | [Diagnostics](./examples/16_diagnostics/index.md) |
| Write mesh, sprite, or UI shaders | [Materials](./examples/17_materials/index.md) |
| Build for browsers, mobile, or headless use | [Platforms](./examples/18_platforms/index.md) |

## Common routes

- New 2D game: app setup, gameplay data, 2D. Add scheduling when movement needs a fixed timestep.
- New 3D game: app setup, gameplay data, 3D, input and cameras. Add scenes for imported models.
- Menu and level flow: game states, UI and picking, assets.
- Spawned model has no animation: assets, scenes, animation.
- Input is missed or motion stutters: scheduling and time, input and cameras.
- Entity disappears or a query stops running: gameplay data, game states, diagnostics.

## Scope

Start with the public components, systems, and plugins in `bevy`.
Read their implementation only when the API docs and examples do not explain their behavior.

Use the material extension APIs before considering a custom renderer. This handbook does not cover renderer internals,
ECS storage, or changes to the engine itself. It does not list every feature.

Select third-party physics, networking, editor, or asset workflow plugins separately. Verify their exact Bevy
compatibility before adding an example. Bevy's bounding and picking examples are not a full physics simulation.

## Check the result

- Check that each API works with the project's Bevy version, Cargo features, and installed plugins.
- Set the system order when one system needs another's output or queued commands.
- Read input, run fixed simulation steps, and update visuals in the right schedules.
- In code that uses an entity or asset, handle missing entities, unfinished loads, and load failures.
  Wait for a scene to finish spawning before using its children.
- Check when state cleanup runs, asset handles are dropped, tasks are cancelled, and audio entities are removed.
- Check asset paths, graphics support, and input behavior on the target platform.
