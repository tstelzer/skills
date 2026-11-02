//! Bevy 0.20.1: build a scene by reusing a wooden crate definition.
//! Source APIs: examples/scene/bsn.rs and examples/3d/3d_scene.rs.
//! All meshes and materials are created in code.

use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, level.spawn())
        .run();
}

fn level() -> impl SceneList {
    bsn_list! {
        Camera3d
        Transform::from_xyz(0.0, 4.0, 8.0)
            .looking_at(Vec3::ZERO, Vec3::Y)
        --
        PointLight {
            intensity: 800_000.0,
            shadow_maps_enabled: true,
        }
        Transform::from_xyz(2.0, 4.0, 3.0)
        --
        @wooden_crate(Vec3::new(-1.0, 0.0, 0.0))
        --
        @wooden_crate(Vec3::new(1.0, 0.0, 0.0))
    }
}

fn wooden_crate(position: Vec3) -> impl Scene {
    bsn! {
        Mesh3d(asset_value(Cuboid::new(1.0, 1.0, 1.0)))
        MeshMaterial3d::<StandardMaterial>(
            asset_value(Color::srgb(0.5, 0.25, 0.1))
        )
        Transform::from_translation(position)
    }
}
