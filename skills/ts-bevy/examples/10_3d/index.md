# 3D graphics

Start with `Camera3d`, meshes, materials, and lights.
Read the [local BSN scene](../08_scenes/01_scene.rs) for a complete scene with no asset files.

Modules: `bevy::mesh`, `bevy::pbr`, `bevy::light`, `bevy::camera`, `bevy::shape`.

## Build visible objects

- Add a mesh to `Assets<Mesh>` and place its handle in `Mesh3d`.
- Add a material to `Assets<StandardMaterial>` and place its handle in `MeshMaterial3d`.
- Set the entity's `Transform`.
- Add lighting and a camera facing the object.

Built-in shapes such as `Cuboid`, `Sphere`, and `Plane3d` can create meshes.
Use their mesh builders for more control over the size and number of mesh segments.

Use `Color::srgb` for colors specified in sRGB. Use linear color values where the API asks for them,
such as `StandardMaterial::emissive`.
Reuse mesh and material handles when objects should share the same assets.

For a textured or animated model, use [assets](../07_assets/index.md) and [scenes](../08_scenes/index.md).

## Materials and light

`StandardMaterial` controls how a surface looks and reacts to light.
Start with its base color, texture, roughness, metallic value, alpha mode, and emissive value.
Choose an explicit `AlphaMode` for cutouts or blended surfaces.

Use `PointLight`, `SpotLight`, or `DirectionalLight` according to the source of light.
Enable shadow maps with `shadow_maps_enabled` on supported light types.
Use `GlobalAmbientLight` for light that fills the scene. Use environment maps for lighting from images.

Adjust light strength, how materials react to light, and camera exposure together.
Check the size of objects and the camera's near and far clipping distances before using extreme settings.

## Optional effects

Use the release examples for fog, bloom, anti-aliasing, shadows, and post-processing.
Before using an effect, check its required features and whether the target graphics backend supports it.
Do not copy advanced rendering pipelines into ordinary gameplay setup.

Use [materials](../17_materials/index.md) for shader extensions.

## Release examples

- [Simple scene][scene]: camera, mesh, material, and light through BSN.
- [Lighting][lighting]: light types and their controls.
- [PBR][pbr]: material properties.
- [Orthographic view][ortho]: a 3D scene with an orthographic camera.
- [glTF loading][gltf]: a model with environment lighting.
- [Post-processing][post]: built-in post-processing settings.

[scene]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/3d/3d_scene.rs
[lighting]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/3d/lighting.rs
[pbr]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/3d/pbr.rs
[ortho]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/3d/orthographic.rs
[gltf]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/gltf/load_gltf.rs
[post]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/3d/post_processing.rs
