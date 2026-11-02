//! Bevy 0.20.1: target an entity with an observer event.
//! Source API: examples/ecs/observers.rs at v0.20.1.
//! Press Space to open a chest once.

use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        .add_systems(Update, open_on_input)
        .run();
}

#[derive(Component)]
struct Chest;

#[derive(EntityEvent)]
struct OpenChest {
    entity: Entity,
}

fn setup(mut commands: Commands) {
    commands.spawn(Camera2d);
    commands.spawn(Chest).observe(open_chest);
}

fn open_on_input(
    keys: Res<ButtonInput<KeyCode>>,
    chests: Query<Entity, With<Chest>>,
    mut commands: Commands,
) {
    if keys.just_pressed(KeyCode::Space) {
        for entity in &chests {
            commands.trigger(OpenChest { entity });
        }
    }
}

fn open_chest(open: On<OpenChest>, mut commands: Commands) {
    info!("Opened chest {:?}", open.entity);
    commands.entity(open.entity).despawn();
}
