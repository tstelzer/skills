# Adapting older Bevy code

Check the Bevy versions in the project's `Cargo.toml` and `Cargo.lock` before changing APIs.
This handbook targets 0.20.1. Follow the official migration guides from the project's version to 0.20, in order.

The table below catches common old tutorial patterns. It is not a complete migration guide.

| Older pattern | Check for 0.20.1 |
| --- | --- |
| `SpriteBundle`, camera bundles, `NodeBundle` | Spawn components; Bevy adds their required components |
| Buffered `EventReader`, `EventWriter`, `add_event` | `MessageReader`, `MessageWriter`, `add_message` |
| `Trigger<E>` observer parameter | `On<E>` |
| `On<Add, T>` | `On<Add<T>>` |
| `Pointer<Click>`, `Pointer<Drag>` | `PointerClick`, `PointerDrag` |
| UI prelude `Button` and `Interaction` | Explicit `ui_widgets::Button`, `Activate`, `Hovered`, `Pressed` |
| `EditableText` as the whole text widget | `EditableText` plus `TextInput` |
| `TextFont { font_size: 24.0, ... }` | `FontSize::Px(24.0)` or `TextFont::from_font_size` |
| `SceneRoot` for a glTF scene | `WorldAssetRoot` |
| `SceneInstanceReady` for a loaded scene | `WorldInstanceReady` |
| `DynamicScene` / `DynamicSceneRoot` | `DynamicWorld` / `DynamicWorldRoot` |
| `Parent` in entity hierarchies | `ChildOf` |
| Older BSN grammar | Check `bsn!`, `bsn_list!`, `--`, and `@scene(...)` in this release |
| Old Bevy shader preprocessor syntax | Read the corresponding WESL shader example |
| `ShaderStorageBuffer` | `render::storage::ShaderBuffer`; check its data layout and update methods |

Some old APIs still work but are deprecated. Use the release's preferred API for new code.
Check whether behavior changed before treating a migration as a simple rename.

## Changes that need a behavior check

- Sprites at the same Z can change draw order. Give overlapping sprites different Z values.
- `EditableText` stores the text being edited and its editing state. `TextInput` handles input for the widget.
- A widget can be activated by a pointer or keyboard. Keep keyboard activation working.
- Observers for component changes now name the component inside the event type, as in `On<Add<Health>>`.
- `chain_weak` can leave systems unordered when their data access does not conflict.
- BSN `Ready` and loaded-world `WorldInstanceReady` refer to different spawning APIs.
- Use `NextState::set_if_different` for states. Mutable component and resource wrappers still use `set_if_neq`.
- Camera-controller examples can require Cargo features, picking plugins, and a separate input adapter.

Use the matching topic guide after identifying the old pattern.
Read the API docs or source when a migration changes how many entities a query must match, when commands run,
or how errors are handled.

## Official guides

- [0.19 to 0.20](https://bevy.org/learn/migration-guides/0-19-to-0-20/)
- [0.18 to 0.19](https://bevy.org/learn/migration-guides/0-18-to-0-19/)
- [Earlier migrations](https://bevy.org/learn/migration-guides/)

The migration pages explain what changed. Check the 0.20.1 source and API docs for the exact calls to use.
