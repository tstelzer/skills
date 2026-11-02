# Input and cameras

Read input through Bevy's input resources or components. Convert it into game actions before simulation.

Modules: `bevy::input`, `bevy::window`, `bevy::camera`, `bevy::camera_controller`, `bevy::transform`.

## Read input

| Input | API |
| --- | --- |
| Physical keyboard buttons | `Res<ButtonInput<KeyCode>>` |
| Mouse buttons | `Res<ButtonInput<MouseButton>>` |
| Total mouse movement this frame | `Res<AccumulatedMouseMotion>` from `input::mouse` |
| Cursor location in a window | `Window::cursor_position()` |
| Connected controllers | `Query<(Entity, &Gamepad)>` |
| Touch contacts | `Res<Touches>` |
| Editable text | `TextInput` and `EditableText`; see the UI route |

Use `pressed` for a held button. Use `just_pressed` / `just_released` for a press or release during this frame.
Use physical `KeyCode` values for movement controls.
For text entry, use text input and input method editor (IME) support.
Do not turn physical key codes into characters yourself.

Normalize a movement vector or clamp its length so diagonal movement is not faster.
Multiply velocity by elapsed time to get movement. Mouse motion already gives the distance moved;
do not multiply it by frame time again.

For a fixed simulation, preserve pending actions before the fixed loop.
Read [scheduling](../03_scheduling/index.md) for when to read input and handle actions.

## Position cameras

Spawn `Camera2d` for a 2D view or `Camera3d::default()` with a `Transform` for a 3D view.
Use `Transform::looking_at` or `looking_to` to orient a 3D camera.
Adjust `Projection` for perspective or orthographic settings.

`Transform` gives position, rotation, and scale relative to the parent. `GlobalTransform` gives them in the game world.
For a camera with a parent, convert the target world position to a position relative to that parent.
Then set the camera's translation.

Use a marker component to select the intended camera when there are several.
Use `PrimaryWindow` to distinguish the main window when the app can create more than one.

Use `bevy::camera::visibility::RenderLayers` to choose which world entities each camera draws.
The camera and rendered entity must share a layer; entities without `RenderLayers` use layer 0.
Include lights on the layers they should illuminate.
Layers are not inherited. Set them on the rendered descendants of a loaded model, not only its root.
Select UI cameras through [UI targeting](../12_ui-picking/index.md).

## Convert cursor coordinates

- Read the cursor from the window targeted by the camera.
- Use `Camera::viewport_to_world_2d` for a 2D point.
- Use `Camera::viewport_to_world` for a 3D ray, then intersect the desired surface.
- Handle a missing cursor or a failed conversion.
- Run after `TransformSystems::Propagate` in `PostUpdate` when the conversion needs the camera's current transform.
- Also run after `bevy::camera::CameraUpdateSystems` when it needs this frame's projection or viewport changes.

Follow the viewport examples when a camera draws in only part of a window.
Convert screen coordinates before using them as world positions.

## Add a controller when needed

Enable the matching Cargo features to use this release's pan, free, and pan-orbit camera controllers.
For pan-orbit behavior, read the minimal example and its sibling custom input module.
It combines `PanOrbitCamera`, `DefaultPanOrbitCameraPlugins`, picking, and an input adapter.
Adding the camera component alone does not connect it to input.

## Release examples

- [Keyboard input][keyboard] and [gamepad input][gamepad].
- [Fixed movement][movement]: input capture and camera order.
- [2D viewport conversion][viewport2d] and [3D viewport conversion][viewport3d].
- [Top-down camera][topdown]: a small camera-follow example.
- [Pan-orbit camera][orbit]: requires its declared Cargo features and sibling input module.
- [RenderLayers API][layers]: which world entities a camera can render.
- [View model][view-model]: separate cameras and layers with shared lighting.
- [CameraUpdateSystems API][camera-update]: ordering after camera data updates.

[keyboard]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/input/keyboard_input.rs
[gamepad]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/input/gamepad_input.rs
[movement]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/movement/physics_in_fixed_timestep.rs
[viewport2d]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/2d/2d_viewport_to_world.rs
[viewport3d]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/3d/3d_viewport_to_world.rs
[topdown]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/camera/2d_top_down_camera.rs
[orbit]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/camera/pan_orbit_camera_minimal.rs
[layers]: https://docs.rs/bevy/0.20.1/bevy/camera/visibility/struct.RenderLayers.html
[view-model]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/camera/first_person_view_model.rs
[camera-update]: https://docs.rs/bevy/0.20.1/bevy/camera/struct.CameraUpdateSystems.html
