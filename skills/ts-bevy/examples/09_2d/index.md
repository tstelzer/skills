# 2D graphics

Start with `Camera2d`, `Sprite`, and `Transform`.
Read [01_movement.rs](./01_movement.rs) for keyboard movement with no asset files.

Modules: `bevy::sprite`, `bevy::sprite_render`, `bevy::image`, `bevy::text`, `bevy::camera`.

## Choose a visual

| Visual | API |
| --- | --- |
| Image | `Sprite::from_image` |
| Solid rectangle | `Sprite::from_color` |
| Frame in a sprite sheet | `Sprite::from_atlas_image`, `TextureAtlas` |
| Shape or generated mesh | `Mesh2d`, `MeshMaterial2d<ColorMaterial>` |
| Text placed in the game world | `Text2d`, `TextFont`, `TextColor` |
| A rendered tile chunk | `TilemapChunk`, `TilemapChunkTileData` |

For sprite sheet animation, match `sprite.texture_atlas.as_mut()` and change the atlas's `index` when a timer advances.
Build its layout with `TextureAtlasLayout::from_grid` and keep the layout handle alongside the image.

For pixel art, use nearest-neighbor sampling, such as `ImagePlugin::default_nearest()`.
Choose image sampling and camera scaling separately. Follow the pixel-grid example to draw on a fixed pixel grid.

## Place and order visuals

Use the transform's X and Y for location. Give overlapping sprites different Z values to set their draw order.
Sprites at the same Z can change draw order.

For a top-down view, derive depth from the object's ground position, such as a character's feet.
With the default `Camera2d`, lower world Y should map to higher Z to draw nearer objects in front.
Use the same mapping for characters and props. Keep its Z range inside the camera's clipping range.
Update depth after movement and before transform propagation.
For sprites under different parents, compare world positions and convert the result back to local transforms.
See [top-down depth sorting][depth] for the game design (Bevy 0.20, commit `0e37080502fe`).

Use `Sprite::custom_size` to set its displayed size and `Transform::scale` to scale the entity.
Use `flip_x` / `flip_y` to mirror the image.

The local movement example updates once per frame and multiplies speed by elapsed time.
For collision simulation or physics, use the [fixed-step route](../03_scheduling/index.md).

## Simple collision tests

Use `BoundingCircle` and `Aabb2d` from `bevy::shape` for simple overlap tests.
`BoundingCircle::new(center, radius)` takes a radius; `Aabb2d::new(center, half_size)` takes half the box dimensions.
Use `IntersectsVolume::intersects` to test overlap and `Aabb2d::closest_point` to find the point nearest the ball.

Keep both bounds in the same coordinate space. Derive their size from the game's collision data.
Breakout uses transform scale as box size because its rectangles start at unit size and have no rotation or parent.
Do not assume transform scale gives the size of an arbitrary sprite.

For a simple bounce, reverse a velocity component only when the ball moves into that collision side.
An overlap test can miss a fast object that crosses an obstacle between steps.
For a moving point, use `RayCast2d` from `bevy::shape::bounding` to test the whole path:

- Compute the step's movement as velocity times the fixed time step.
- Skip a zero-length movement before making its `Dir2` direction.
- Set the cast's maximum distance to the movement's length.
- Use `aabb_intersection_at` or `circle_intersection_at` and choose the nearest hit across all obstacles.

A center ray ignores the moving object's size. Use `AabbCast2d` for a box against boxes, or `BoundingCircleCast`
for a circle against circles. These calls return hit distances; the game still needs to resolve the collision
and any remaining movement. Use a physics plugin for more complex shapes and responses.
Follow the release's [bounding examples][bounds].
The older [Block Breaker design][block-breaker] (Bevy 0.18, commit `6e2a26758551`) shows nearest-hit selection.

## Tile chunks

The built-in tilemap example renders a chunk through `bevy::sprite_render`.
It uses texture arrays, per-tile data, and chunk coordinates. Follow its image loader settings.
Rendering a chunk does not supply game rules, collision, or a level editor format.

For a custom sprite shader, read [materials](../17_materials/index.md).

## Release examples

- [Sprite][sprite]: loading an image.
- [Sprite sheet][sheet]: atlas layout and frame selection.
- [2D shapes][shapes]: meshes and color materials.
- [Text2d][text]: text positioned in the world.
- [Pixel-grid rendering][pixels]: camera and texture setup.
- [Tilemap chunk][tiles]: tileset array layout and chunk data.
- [Breakout][breakout]: a complete small game using sprites, score, collisions, and audio.

[sprite]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/2d/sprite.rs
[sheet]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/2d/sprite_sheet.rs
[shapes]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/2d/2d_shapes.rs
[text]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/2d/text2d.rs
[pixels]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/2d/pixel_grid_snap.rs
[tiles]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/2d/tilemap_chunk.rs
[breakout]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/showcase/breakout.rs
[bounds]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/math/bounding_2d.rs
[block-breaker]: https://github.com/rust-adventure/block-breaker/commit/6e2a2675855136dbb40b0fdd485efc9537799670
[depth]:
  https://github.com/jamesfebin/ImpatientProgrammerBevyRust/tree/0e37080502feebf8a34998fcc4255dd780304f37/chapter4
