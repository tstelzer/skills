# Game states

Use states for app-wide modes such as menu, loading, playing, and paused.
Use ordinary components or enums for individual enemies, abilities, or items.

Module: `bevy::state`.

Read [01_states.rs](./01_states.rs) for state transitions and automatic entity cleanup.

## Define transitions

Derive `States` with `Clone`, `Eq`, `PartialEq`, `Hash`, and `Debug`.
Use `Default` with `app.init_state::<T>()`, or supply the starting state with `app.insert_state(...)`.

- Read the current value through `Res<State<T>>`.
- Request a transition with `ResMut<NextState<T>>::set`.
- Initialize content in `OnEnter(value)`.
- Run gameplay with `.run_if(in_state(value))`.
- Clean up in `OnExit(value)`, or attach `DespawnOnExit(value)` to entities that belong to that state.

Setting `NextState` requests a change; it does not immediately change `State` in the current system.
The `StateTransition` schedule applies the pending value later.
Choose one system to set `NextState`, or order systems that can overwrite each other's requests.

`NextState::set` runs exit and enter schedules even when the value equals the current state.
Use `set_if_different` to skip those schedules when the state stays the same.
An earlier `set` request for the same value in that frame still makes those schedules run.

`DefaultPlugins` includes `StatesPlugin` when the state feature is enabled.
Add `bevy::state::app::StatesPlugin` explicitly when using `MinimalPlugins` with states.

## Clean up state content

Put `DespawnOnExit` on a level or menu root. Its linked children are cleaned up with it.
The release also has `DespawnOnEnter` and `DespawnWhen` for other cleanup conditions.
Clean up resources and entities outside that hierarchy separately.

Keep cameras, shared asset handles, and player settings outside a menu root if they must survive when it is removed.

## Choose what pauses

A `Paused` state only changes behavior you connect to it.
Use a run condition to stop simulation systems or sets. Pause `Time<Virtual>` when game time itself must stop.
Use `Time<Real>` for UI effects that must continue while game time is paused.

Do not rely on buffered messages surviving a long pause. See [communication](../04_communication/index.md).

Register `SubStates` with `app.add_sub_state::<T>()` for a mode that exists only under a parent state.
For menu pages, use `#[source(GameState = GameState::Menu)]` on the substate enum to tie its lifetime to the menu.
Two ordinary `States` types remain independent. The [game menu example][menu] explicitly switches its `MenuState`
to `Disabled` when starting the game; changing only `GameState` would leave the menu state active.
Register `ComputedStates` with `app.add_computed_state::<T>()` for a value calculated from existing states.

## Release examples

- [States][states]: menu-to-game flow.
- [State cleanup][cleanup]: remove entities on exit, on entry, or when a condition is met.
- [Substates][substates]: states that exist only under another state.
- [Computed states][computed]: states calculated from other states.
- [Game menu][menu]: a larger UI and state example.
- [NextState API][next]: requested state changes and entering the same state again.

[states]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/state/states.rs
[cleanup]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/state_scoped.rs
[substates]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/state/sub_states.rs
[computed]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/state/computed_states.rs
[menu]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/showcase/game_menu.rs
[next]: https://docs.rs/bevy/0.20.1/bevy/state/state/enum.NextState.html
