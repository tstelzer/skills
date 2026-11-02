# Custom materials

Use the public material APIs when an effect needs a shader.
Start with the matching release example and its shader file.

Modules: `bevy::pbr`, `bevy::sprite_render`, `bevy::ui_render`, `bevy::shader`, `bevy::render`.

| Target | Public API |
| --- | --- |
| A custom 3D material | `Material`, `MaterialPlugin<T>`, `MeshMaterial3d<T>` |
| Extend the standard 3D material | `ExtendedMaterial<StandardMaterial, T>`, `MaterialExtension` |
| A custom 2D mesh material | `Material2d`, `Material2dPlugin<T>`, `MeshMaterial2d<T>` |
| Extend a 2D material | `ExtendedMaterial2d`, `MaterialExtension2d` |
| A custom sprite effect | `SpriteMaterial<T>`, `SpriteMaterialPlugin<T>` |
| A shader on a UI node | `UiMaterial`, `UiMaterialPlugin<T>`, `MaterialNode<T>` |

## Keep the material and shader together

Define the material with `Asset` and the reflection or type metadata shown in the example.
Use `AsBindGroup` to describe the values, textures, and samplers sent to the GPU.
For `fragment_shader`, return `ShaderRef` from `Material`, `Material2d`, or `MaterialExtension`.
`MaterialExtension2d` returns `Option<ShaderRef>`; return `Some(...)` to replace the base shader.
Register the matching material plugin and put its asset handle on the visible entity.

Make sure the Rust code and shader agree on uniform data, textures, samplers, and their binding numbers.
Follow the release example's binding slots and alignment rules, especially for WebGL2.
For material extensions, use binding numbers that the base material does not use.
If you copy `#[cfg(feature = "webgl2")]`, it checks for a feature in your application.
Define that application feature to enable `bevy/webgl2`, or include the needed padding in every build.

## Send a list of values to a shader

Use `bevy::render::storage::ShaderBuffer` for data such as a list of stripe colors.
Add it to `Assets<ShaderBuffer>` and store its handle in a material field marked `#[storage(0, read_only)]`.
Update the existing asset through `Assets<ShaderBuffer>`; the release example uses `clear` and `extend`.
Match the data's memory layout to the shader. Start with the example's `Vec<[f32; 4]>` color data.
Keep shader indices within the uploaded list and check storage-buffer support on the target graphics backend.
Read the [buffer example][buffer] with its [WESL shader][buffer-shader].

## Match depth and shadow rendering

A prepass draws depth, surface directions, or motion before the main picture.
When a shader moves vertices or cuts holes in a surface, make the same changes in its prepass shaders.
`Material` and `MaterialExtension` expose `prepass_vertex_shader` and `prepass_fragment_shader`.
These shaders also control shadow depth maps. Leaving the defaults can produce a shadow of the unchanged mesh.
Check the `deferred_*_shader` methods too when using deferred rendering.
The [prepass example][prepass] shows which camera components enable its outputs.
Materials with alpha blending do not write those prepass textures.

## Draw a UI effect

Implement `UiMaterial`, register `UiMaterialPlugin<T>`, and attach `MaterialNode(handle)` to a `Node` with a size.
Change its values through `Assets<T>` to animate a progress bar or health display.
Follow the [UI material example][ui] and [shader][ui-shader] for UI-specific shader inputs and bindings.
Use [widgets](../12_ui-picking/index.md) for button behavior; a material only draws the node.

## Use the release's shader language

Bevy 0.20 uses WESL in its shader examples.
Read the referenced `.wesl` file alongside the Rust example.
Do not paste older Bevy `#import` or shader-definition syntax into WESL code.

For a sprite effect, start from the sprite material example: it uses `MaterialExtension2d` with
`SpriteMaterialPlugin`. A 2D mesh material has a different setup.

Use a built-in material option or extension when it can produce the effect.
Custom render graph nodes, extraction, and specialized pipelines require a separate rendering task.

For effect designs, [Rust Adventure's examples][adventure] include stripe buffers, dissolving meshes, and UI shaders.
That snapshot uses Bevy 0.18 at commit `df6325890695`. Adapt it through the release examples below.
Its `ShaderStorageBuffer` and `.wgsl` examples use older APIs.

## Release examples and shader assets

- [3D material][material3d] and its [shader][shader3d].
- [Extended 3D material][extended] and its [shader][extendedshader].
- [2D material][material2d] and its [shader][shader2d].
- [Sprite material][sprite] and its [shader][spriteshader].

[material3d]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/shader/shader_material.rs
[shader3d]: https://github.com/bevyengine/bevy/blob/v0.20.1/assets/shaders/custom_material.wesl
[extended]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/shader/extended_material.rs
[extendedshader]: https://github.com/bevyengine/bevy/blob/v0.20.1/assets/shaders/extended_material.wesl
[material2d]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/shader/shader_material_2d.rs
[shader2d]: https://github.com/bevyengine/bevy/blob/v0.20.1/assets/shaders/custom_material_2d.wesl
[sprite]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/shader/sprite_material.rs
[spriteshader]: https://github.com/bevyengine/bevy/blob/v0.20.1/assets/shaders/sprite_material.wesl
[buffer]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/shader/storage_buffer.rs
[buffer-shader]: https://github.com/bevyengine/bevy/blob/v0.20.1/assets/shaders/storage_buffer.wesl
[prepass]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/shader/shader_prepass.rs
[ui]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ui/ui_material.rs
[ui-shader]: https://github.com/bevyengine/bevy/blob/v0.20.1/assets/shaders/custom_ui_material.wesl
[adventure]: https://github.com/rust-adventure/bevy-examples/tree/df63258906957cef533468af48ecb3b47b184634
