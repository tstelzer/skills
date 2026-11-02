//! Bevy 0.20.1: create content when entering a state and remove it when leaving.
//! Source APIs at v0.20.1: examples/state/states.rs,
//! examples/ecs/state_scoped.rs.
//! Press Space to switch between a menu and a level.

use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .init_state::<GameState>()
        .add_systems(Startup, setup_camera)
        .add_systems(OnEnter(GameState::Menu), show_menu)
        .add_systems(OnEnter(GameState::Playing), spawn_level)
        .add_systems(Update, switch_state)
        .run();
}

#[derive(States, Default, Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum GameState {
    #[default]
    Menu,
    Playing,
}

fn setup_camera(mut commands: Commands) {
    commands.spawn(Camera2d);
}

fn show_menu(mut commands: Commands) {
    commands.spawn((
        Text::new("Press Space to play"),
        DespawnOnExit(GameState::Menu),
    ));
}

fn spawn_level(mut commands: Commands) {
    commands.spawn((
        Sprite::from_color(Color::srgb(0.2, 0.7, 0.3), Vec2::splat(64.0)),
        DespawnOnExit(GameState::Playing),
    ));
}

fn switch_state(
    keys: Res<ButtonInput<KeyCode>>,
    current: Res<State<GameState>>,
    mut next: ResMut<NextState<GameState>>,
) {
    if keys.just_pressed(KeyCode::Space) {
        next.set(match current.get() {
            GameState::Menu => GameState::Playing,
            GameState::Playing => GameState::Menu,
        });
    }
}
