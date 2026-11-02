# Gameplay data

An entity identifies a game object. Components hold its data. Systems read and change matching components.
Resources hold data shared by the app.

Modules: `bevy::ecs`, `bevy::transform`. Use the prelude for normal gameplay code.

## Choose where data belongs

| Need | API |
| --- | --- |
| Health, velocity, inventory on an entity | `#[derive(Component)]` |
| A tag such as player or enemy | A component with no fields |
| Shared level settings or score | `#[derive(Resource)]`, `Res<T>`, `ResMut<T>` |
| State private to one system | `Local<T>` |
| Read or change matching entities | `Query<...>` |
| Spawn, despawn, add, or remove components | `Commands` |

Spawn tuples of components. Built-in components such as `Sprite` and `Camera2d` add their required components.
Use `#[require(...)]` to add default components when adding one of your own components.
Set values such as player health yourself when they vary between entities.

## Grid-based game rules

Keep board cells and integer player coordinates in components or resources.
Check board bounds and occupancy before accepting a move. Use those coordinates for pickups and other cell rules.
Then derive the entity's `Transform` from its cell. A 3D board can map columns and rows to X and Z, with Y for height.
Keep visual movement separate so animation between cells does not change which cell the player occupies.
See [Alien Cake Addict][grid-game] for board data and a move cooldown.

## Query only what the system needs

```rust
use bevy::prelude::*;

#[derive(Component)]
struct Health(u32);

#[derive(Component)]
struct Enemy;

fn remove_dead_enemies(
    enemies: Query<(Entity, &Health), With<Enemy>>,
    mut commands: Commands,
) {
    for (entity, health) in &enemies {
        if health.0 == 0 {
            commands.entity(entity).despawn();
        }
    }
}
```

- Use `With<T>` or `Without<T>` to filter without fetching a component.
- Use `Option<&T>` for optional data and `Has<T>` to check whether the component exists.
- A tuple of filters means all filters must match; `Or<(With<Player>, With<Enemy>)>` selects either tag.
- When two query parameters would borrow the same component and one allows changes, use filters that cannot
  match the same entity, or access the queries in turn through `ParamSet`.
- Handle `Query::get`, `get_mut`, `single`, and `single_mut` failures according to the game's rules.
- Use `Single<...>` when the system should run only if exactly one entity matches.
  Use `Option<Single<...>>` to let it run with zero or one match. Multiple matches still cause validation to fail.
- Use an ordinary query with explicit error handling when a missing player must produce an error or trigger recovery.

`bevy::ecs::entity_disabling::Disabled` excludes an entity from queries unless they mention that component.
Use `With<Disabled>` for disabled entities, or `Allow<Disabled>` to include both enabled and disabled entities.
Disabling a parent does not disable its children. Remove `Disabled` to enable an entity again.

An `Entity` value is an identifier, not proof that the entity still exists.
Even `Commands::get_entity` cannot guarantee that an entity survives until its queued commands run.
Use `try_insert` or `try_despawn` when a missing entity is expected; keep unexpected failures visible.
Read [scheduling](../03_scheduling/index.md) before using the results of queued commands.

## Name reusable query and system inputs

Use `#[derive(QueryData)]` from `bevy::ecs::query` to give a repeated query named fields.
Write component references as `&'static T` in the definition and use the type in `Query<MyQuery>`.
For mutable fields, add `#[query_data(mutable)]` and use `&'static mut T`.
The derive also generates a read-only form. See the [custom query example][custom-query].

Use `#[derive(SystemParam)]` from `bevy::ecs::system` to group related system inputs and methods.
Each field must be a system parameter. Follow the [system parameter example][system-param] for the lifetimes:
`Query<'w, 's, &'static T>`, `Res<'w, T>`, and `Commands<'w, 's>`.
Bevy still checks the inner parameters for conflicting access; grouping them does not resolve a borrow conflict.

## React to changes

`Added<T>` and `Changed<T>` filter by changes since this system last ran. Added components also count as changed.
Accessing a value through a mutable reference can mark it changed even when its value stays the same.
Use `set_if_neq` on mutable component or resource wrappers to mark a change only when the new value differs.

Use `Ref<T>` to inspect `is_added` or `is_changed` without filtering the query.
Use `RemovedComponents<T>` to detect removal. This reader cannot give you the old component value.
Use [observers](../04_communication/index.md) when the reaction belongs to a triggered event.

## Relationships and transforms

Use `ChildOf` and `Children` for parent-child relationships.
Create children with `with_children`, `children!`, or `add_child`.
Let Bevy keep the parent's `Children` list up to date.
Despawning a parent also despawns its linked children.
Move an entity to a new parent before deleting its old parent if it must survive.

`Transform` gives position, rotation, and scale relative to the parent. `GlobalTransform` gives them in the game world.
Give a parent that groups visible objects a `Transform` and `Visibility`. `ChildOf` alone does not add them.
Bevy updates `GlobalTransform` in `PostUpdate`. Write `Transform` before `TransformSystems::Propagate`.
Read `GlobalTransform` after that set when you need this frame's result.
See [input and cameras](../06_input-camera/index.md).

When a fixed-step system needs a parent's latest movement before propagation, use
`TransformHelper::compute_global_transform(entity)`. It calculates and returns the world transform without updating
the stored `GlobalTransform`. Handle errors for missing entities or transforms.
It reads transforms throughout the hierarchy. Use `ParamSet` if the same system also writes `Transform`.
Use the stored component after propagation when possible to avoid recalculating it.
See the [helper API][transform-helper] and [Flappy Bird collision code][flappy]
(Bevy 0.18, commit `47265c861ee0`) for this use case.

Set `Visibility::Hidden` to hide an entity and descendants that use `Visibility::Inherited`.
A child with `Visibility::Visible` overrides a hidden parent. Hidden entities remain in gameplay queries.
Let Bevy compute `InheritedVisibility` and `ViewVisibility`.

## Custom relationships

Use a custom relationship for links such as a combat target. This does not add transform or visibility propagation.
Define the source component and the collection Bevy maintains on the target:

```rust
#[derive(Component)]
#[relationship(relationship_target = TargetedBy)]
struct Targeting(Entity);

#[derive(Component)]
#[relationship_target(relationship = Targeting)]
struct TargetedBy(Vec<Entity>);
```

Change a target by inserting a replacement `Targeting(entity)`. Remove the component to end the link.
Let Bevy update `TargetedBy`; keep its collection private and read it through `iter()`.
Without `linked_spawn`, deleting the target removes the sources' relationship components.
The source entities stay alive.
Add `linked_spawn` to `relationship_target` only when deleting the target should also delete its sources.

Use `iter_ancestors` on a query of source links and `iter_descendants` on a query of target collections.
For graphs that can contain cycles, track visited entities and stop on a repeat.
See the [relationship example][relationships].

## Release examples and API

- [ECS guide][ecs]: components, resources, systems, and app setup.
- [Change detection][changes]: filters, resource changes, and equality checks.
- [Hierarchy][hierarchy]: several ways to spawn and manage children.
- [Relationships][relationships]: source and reverse relationship components.
- [Entity disabling][disabling]: excluding entities from ordinary queries.
- [Visibility API][visibility]: visibility inheritance and computed values.
- [Query API](https://docs.rs/bevy/0.20.1/bevy/ecs/system/struct.Query.html)
- [Single API](https://docs.rs/bevy/0.20.1/bevy/ecs/system/struct.Single.html)
- [EntityCommands API](https://docs.rs/bevy/0.20.1/bevy/ecs/system/struct.EntityCommands.html)

[ecs]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/ecs_guide.rs
[changes]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/change_detection.rs
[hierarchy]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/hierarchy.rs
[relationships]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/relationships.rs
[disabling]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/entity_disabling.rs
[visibility]: https://docs.rs/bevy/0.20.1/bevy/camera/visibility/index.html
[grid-game]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/showcase/alien_cake_addict.rs
[custom-query]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/custom_query_param.rs
[system-param]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/system_param.rs
[transform-helper]: https://docs.rs/bevy/0.20.1/bevy/transform/helper/struct.TransformHelper.html
[flappy]: https://github.com/rust-adventure/flappy-bird/commit/47265c861ee0a747e7c8eb4e005bda6bb0c738ba
