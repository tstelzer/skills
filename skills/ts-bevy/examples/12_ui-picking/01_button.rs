//! Bevy 0.20.1: react to a UI button's Activate event.
//! Source API: examples/ui/widgets/button.rs at v0.20.1.
//! Uses Bevy's default font; no asset files are needed.

use bevy::{
    prelude::*,
    ui_widgets::{Activate, Button},
};

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .init_resource::<Clicks>()
        .add_systems(Startup, setup)
        .run();
}

#[derive(Resource, Default)]
struct Clicks(u32);

fn setup(mut commands: Commands) {
    commands.spawn(Camera2d);
    commands
        .spawn((
            Button,
            Node {
                width: px(180),
                height: px(60),
                margin: auto().all(),
                align_items: AlignItems::Center,
                justify_content: JustifyContent::Center,
                ..default()
            },
            BackgroundColor(Color::srgb(0.15, 0.3, 0.5)),
            children![(
                Text::new("Add a point"),
                TextFont::from_font_size(24.0),
            )],
        ))
        .observe(add_point);
}

fn add_point(_: On<Activate>, mut clicks: ResMut<Clicks>) {
    clicks.0 += 1;
    info!("Points: {}", clicks.0);
}
