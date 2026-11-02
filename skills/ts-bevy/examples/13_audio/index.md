# Audio

Spawn an entity with `AudioPlayer` to play a loaded audio asset.

Module: `bevy::audio`. The default `audio` feature collection includes Vorbis support.
Enable other format features when the assets require them.

## Play and clean up

```rust
use bevy::prelude::*;

fn play_pickup(mut commands: Commands, assets: Res<AssetServer>) {
    commands.spawn((
        AudioPlayer::new(assets.load("sounds/pickup.ogg")),
        PlaybackSettings::DESPAWN,
    ));
}
```

This system requires `assets/sounds/pickup.ogg`.
For frequent effects, load once and keep the handle in a resource.
Run the system when the pickup action or event happens. Running it on every `Update` would start a sound every frame.

Use `PlaybackSettings::DESPAWN` to remove sound entities when playback ends.
Use `PlaybackSettings::LOOP` for looping music.
Use `PlaybackSettings::REMOVE` to remove finished audio components while keeping the gameplay entity.

## Control playback

Query `AudioSink` to control sound after it starts, or `SpatialAudioSink` for sound with a position in the world.
The sink may be missing while the source loads. Handle this in the query.
`PlaybackSettings` sets how playback starts. Changing it does not update an existing sink.

For positional audio, enable spatial playback and provide a `SpatialListener`.
Follow the spatial examples for listener placement, ear spacing, and world scale.

Changing game state or pausing game time does not pause audio by itself.
Use the sink or remove audio entities to handle pause, mute, and level changes.

Browsers may require a click or key press before playing audio. Test the start screen on the target browser.

## Release examples

- [Sound effect][effect]: keep a handle and remove the player when playback ends.
- [Audio control][control]: sinks, volume, speed, pause, and mute.
- [Soundtrack][music]: managing music playback.
- [Spatial audio in 2D][spatial2d] and [3D][spatial3d].
- [Playback settings][settings]: initial values and cleanup modes.

[effect]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/audio/play_sound_effect.rs
[control]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/audio/audio_control.rs
[music]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/audio/soundtrack.rs
[spatial2d]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/audio/spatial_audio_2d.rs
[spatial3d]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/audio/spatial_audio_3d.rs
[settings]: https://github.com/bevyengine/bevy/blob/v0.20.1/crates/bevy_audio/src/audio.rs
