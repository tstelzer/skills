# UI and picking

Use Bevy UI for menus and on-screen game information (HUDs).
Use picking observers to handle pointer actions on sprites, meshes, and UI entities.

Modules: `bevy::ui`, `bevy::text`, `bevy::ui_widgets`, `bevy::input_focus`, `bevy::picking`.

## Layout and text

`Node` holds layout properties: dimensions, positioning, flex or grid layout, padding, and borders.
Use `px(...)`, `percent(...)`, `auto()`, and the release's other `Val` units.
Create a hierarchy with `children!`, `with_children`, or BSN.
Set `Node::display` to `Display::None` to hide a subtree and remove its layout space.
Use `Visibility::Hidden` to hide it while keeping that space.
For a shader-based progress bar or other UI effect, use [UI materials](../17_materials/index.md#draw-a-ui-effect).

Use `Text` for UI text and `Text2d` for text placed in the game world.
Style text with `TextFont`, `TextColor`, and `TextLayout`.
`TextFont::font_size` uses `FontSize`, such as `FontSize::Px(24.0)`.
Use `TextFont::from_font_size(24.0)` to set a size in pixels.

For mixed styles, add `TextSpan` children under a `Text` root, each with its own text style.
Update a span through `TextUiWriter`, as in [Breakout's score display][breakout].
For a root with one span child, `*writer.text(root, 1) = score.to_string()` replaces the child's text.
Index 0 names the root. Use `get_text` and handle `None` when the requested span may be absent; `text` panics then.

Put `UiTargetCamera(camera_entity)` on a UI root when the game uses several cameras or windows.
Use `IsDefaultUiCamera` on a camera to choose the default for roots without an explicit target.
`RenderLayers` does not filter Bevy UI.

## Buttons and focus

Read [01_button.rs](./01_button.rs).

Import `bevy::ui_widgets::Button`. The UI button in the prelude is deprecated.
Observe `Activate` to handle the action. Use UI components to give the widget an appearance.

- Add `Hovered` from `bevy::picking::hover` when the style should change as the pointer moves over the widget.
- Read `Has<Pressed>` from `bevy::ui` to check whether the widget is held down.
- Use `InteractionDisabled` to disable interaction.
- Add `ActivateOnPress` when the action should happen on press instead of a completed click.
- Add `TabNavigationPlugin`, `TabGroup`, and `TabIndex` to move focus between widgets with the keyboard.

The `ui` feature includes the widget feature, and `DefaultPlugins` installs its widget plugins.
If you choose features or plugins yourself, check that you included the widget features and plugins.

Feathers supplies styled widgets aimed at tools and editors. It is optional and requires `bevy_feathers`.
Use it when those controls fit the game or tool. Game UI can also use the unstyled widgets directly.

## Settings controls

Keep settings in resources that survive menu cleanup. Store each option's value in a component on its widget.
For navigation buttons, store an action enum and read it from `event.entity` in an `On<Activate>` observer.
See the [game menu example][menu] for both patterns.

Import `RadioGroup`, `RadioButton`, and `ValueChange` from `bevy::ui_widgets` for a choice among options.
Handle `On<ValueChange<Entity>>`: `event.source` is the group and `event.value` is the chosen button.
Read that button's value, update the setting, and move `bevy::ui::Checked` to the selected option.
The group emits the event but does not update `Checked` by itself.
Limit selection updates to the event's group so another settings group keeps its own selection.
Initialize checked options from the settings resource when rebuilding the screen.

## Text entry

Use both `bevy::ui_widgets::TextInput` and `bevy::text::EditableText`.
`TextInput` handles input. `EditableText` holds the text being edited and its editing state.
Use `bevy::input_focus::InputFocus` to select the active widget. Set layout, cursor appearance, and input filtering.
Disable gameplay shortcuts while a text widget has focus. UI event handling does not clear `ButtonInput<KeyCode>`.

By default, copied text stays inside the app. Enable `system_clipboard` to use the operating system's clipboard.
Check platform support and permissions before relying on copy and paste between apps.

## Picking

Attach observers such as `On<PointerClick>` or `On<PointerDrag>` to interactive entities.
Read the event's `entity` as its target.

Picking needs a backend that can detect which objects are under the pointer.
The mesh examples add `MeshPickingPlugin` explicitly; enabling its Cargo feature alone does not add that plugin.
Use the matching sprite or UI backend for those visuals.

Use `Pickable::IGNORE` on decoration that should ignore the pointer and let it reach objects behind the decoration.
Set `Pickable::should_block_lower` to control blocking; UI nodes block by default even without `Pickable`.
These settings apply to each entity separately.
Set them on overlay children too if the pointer should pass through them.
Stopping event propagation stops the event from reaching related entities. It does not change which objects are hit.

## Release examples

- [Button][button]: current widget API and hover/pressed styling.
- [Standard widgets][widgets]: reusable control behavior.
- [Text input][text]: editing, focus, and clipboard feature notes.
- [Grid layout][grid]: grid dimensions and placement.
- [UI targeting][target]: selecting cameras for UI roots.
- [Display and visibility][visibility]: hiding UI with or without its layout space.
- [Simple picking][picking]: UI clicks and dragging meshes.
- [Sprite picking][sprites]: interaction with sprites.
- [Pickable API][pickable]: receiving events and blocking objects behind an entity.

[button]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ui/widgets/button.rs
[widgets]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ui/widgets/standard_widgets.rs
[text]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ui/text/text_input.rs
[grid]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ui/layout/grid.rs
[target]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ui/ui_target_camera.rs
[visibility]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ui/layout/display_and_visibility.rs
[picking]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/picking/simple_picking.rs
[sprites]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/picking/sprite_picking.rs
[pickable]: https://docs.rs/bevy/0.20.1/bevy/picking/struct.Pickable.html
[breakout]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/showcase/breakout.rs
[menu]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/showcase/game_menu.rs
