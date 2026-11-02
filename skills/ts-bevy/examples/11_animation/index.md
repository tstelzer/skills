# Animation

For sprite sheet animation, change the atlas index to choose the displayed frame.
Use animation graphs and players to animate models or other properties.

Modules: `bevy::animation`, `bevy::gltf`, `bevy::curve`.

## Animate a loaded model

Follow the release's [animated mesh example][mesh] in this order:

1. Load an animation clip with `GltfAssetLabel::Animation(index)`.
2. Create an `AnimationGraph`, for example with `AnimationGraph::from_clip`.
3. Store the returned graph asset handle and `AnimationNodeIndex`.
4. Spawn the model through `WorldAssetRoot`.
5. Observe `WorldInstanceReady` on the root.
6. Find the descendant with `AnimationPlayer`, add `AnimationGraphHandle`, and play the graph node.

`AnimationPlayer::play(index).repeat()` starts looping a graph node.
The index belongs to the graph you built. It is not a glTF clip index.
The player may be on a child entity instead of the model root.

## Switch and blend

Use `AnimationTransitions` for transitions between graph nodes.
When `AnimationTransitions` manages a player, switch animations through its play API so it can track the change.
Use a graph for layered animation, masks, and blends.

Keep gameplay state separate from playback state.
A character can be stunned even before its visual transition finishes.
Use animation events to trigger an effect at a particular point in an animation.
For game rules, decide what should happen when animation time pauses or differs from fixed simulation time.

## Other animation

- Use a timer and atlas index for 2D sprite sheets.
- Use curves for animated transforms or other supported properties.
- Use morph targets to change a mesh's shape when the model includes morph data.
- Use easing to change a UI value or transform smoothly when a full animation graph is unnecessary.

## Release examples

- [Animated mesh][mesh]: load a clip and start it when the instance is ready.
- [Animation control][control]: playback and transitions.
- [Animation graph][graph]: graph structure and blending.
- [Animation events][events]: effects tied to animation time.
- [Animated transform][transform]: property animation.
- [Sprite sheet][sprite]: the smaller API for frame animation.

[mesh]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/animation/animated_mesh.rs
[control]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/animation/animated_mesh_control.rs
[graph]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/animation/animation_graph.rs
[events]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/animation/animation_events.rs
[transform]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/animation/animated_transform.rs
[sprite]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/2d/sprite_sheet.rs
