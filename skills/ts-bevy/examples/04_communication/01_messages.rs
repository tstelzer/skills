//! Bevy 0.20.1: send and apply damage in the same update.
//! Source API: examples/ecs/message.rs at v0.20.1.
//! Press Space to deal damage. Health cannot fall below zero.

use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_message::<Damage>()
        .add_systems(Startup, setup)
        .add_systems(Update, (attack, apply_damage).chain())
        .run();
}

#[derive(Component)]
struct Health(u32);

#[derive(Message)]
struct Damage {
    target: Entity,
    amount: u32,
}

fn setup(mut commands: Commands) {
    commands.spawn(Camera2d);
    commands.spawn(Health(25));
}

fn attack(
    keys: Res<ButtonInput<KeyCode>>,
    targets: Query<Entity, With<Health>>,
    mut damage: MessageWriter<Damage>,
) {
    if keys.just_pressed(KeyCode::Space) {
        for target in &targets {
            damage.write(Damage { target, amount: 10 });
        }
    }
}

fn apply_damage(
    mut damage: MessageReader<Damage>,
    mut health: Query<&mut Health>,
) {
    for hit in damage.read() {
        // A target may have despawned before this message is handled.
        if let Ok(mut health) = health.get_mut(hit.target) {
            health.0 = health.0.saturating_sub(hit.amount);
            info!("Health: {}", health.0);
        }
    }
}
