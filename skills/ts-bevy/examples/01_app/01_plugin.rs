//! Bevy 0.20.1: a plugin sets up a game feature.
//! Source API: examples/app/plugin.rs at v0.20.1.
//! Press Space to add a point. No asset files are needed.

use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins((DefaultPlugins, ScorePlugin))
        .add_systems(Startup, setup_camera)
        .run();
}

struct ScorePlugin;

impl Plugin for ScorePlugin {
    fn build(&self, app: &mut App) {
        app.init_resource::<Score>()
            .add_systems(Update, add_point);
    }
}

#[derive(Resource, Default)]
struct Score(u32);

fn setup_camera(mut commands: Commands) {
    commands.spawn(Camera2d);
}

fn add_point(keys: Res<ButtonInput<KeyCode>>, mut score: ResMut<Score>) {
    if keys.just_pressed(KeyCode::Space) {
        score.0 += 1;
        info!("Score: {}", score.0);
    }
}
