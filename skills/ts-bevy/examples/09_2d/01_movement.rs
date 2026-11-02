//! Bevy 0.20.1: move a colored sprite with the arrow keys.
//! Source APIs at v0.20.1: examples/2d/move_sprite.rs,
//! examples/state/states.rs.
//! Movement updates each frame. See the scheduling guide for fixed simulation steps.

use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        .add_systems(Update, move_player)
        .run();
}

#[derive(Component)]
struct Player;

fn setup(mut commands: Commands) {
    commands.spawn(Camera2d);
    commands.spawn((
        Player,
        Sprite::from_color(Color::srgb(0.2, 0.7, 0.3), Vec2::splat(40.0)),
    ));
}

fn move_player(
    keys: Res<ButtonInput<KeyCode>>,
    time: Res<Time>,
    mut players: Query<&mut Transform, With<Player>>,
) {
    let mut direction = Vec2::ZERO;
    if keys.pressed(KeyCode::ArrowLeft) {
        direction.x -= 1.0;
    }
    if keys.pressed(KeyCode::ArrowRight) {
        direction.x += 1.0;
    }
    if keys.pressed(KeyCode::ArrowUp) {
        direction.y += 1.0;
    }
    if keys.pressed(KeyCode::ArrowDown) {
        direction.y -= 1.0;
    }

    let movement = direction.normalize_or_zero() * 250.0 * time.delta_secs();
    for mut transform in &mut players {
        transform.translation += movement.extend(0.0);
    }
}
