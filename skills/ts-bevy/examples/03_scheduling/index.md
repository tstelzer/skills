# Scheduling and time

Use schedules to decide when work runs. Within a schedule, order systems when one needs another's result.

Modules: `bevy::app`, `bevy::ecs::schedule`, `bevy::time`.

## Choose a schedule

| Schedule | Use |
| --- | --- |
| `Startup` | Initial setup, once |
| `PreUpdate` | Work before ordinary frame logic; check when input plugins run |
| `RunFixedMainLoop` | Read input before the fixed loop and update visuals after it |
| `FixedUpdate` | Simulation that advances in fixed time steps |
| `Update` | Frame logic, UI, and simple movement |
| `PostUpdate` | Work after frame logic, including transform propagation |
| `OnEnter(state)`, `OnExit(state)` | State setup and cleanup |

A fixed loop may run zero, one, or several times per rendered frame.
Multiply speed in units per second by `time.delta_secs()` to get the distance to move this frame.
A fixed timestep keeps each simulation step the same length. It does not guarantee the same result on every run.
Use the [replay tests](../15_tasks-tests/index.md#check-replay-and-rollback) when the game must repeat earlier steps.

## Order dependent work

A tuple of systems can run in any order. Use `.chain()` to run them in the listed order:

```rust
app.add_systems(Update, (read_actions, apply_actions, update_hud).chain());
```

The names above stand for the game's systems. Use `.before(...)`, `.after(...)`, and named `SystemSet` values to
order larger groups. Add `.run_if(...)` when the system should run only under a condition.

`Commands` queues changes such as spawning entities or adding components. Queries in the same system cannot see those
changes yet. With the default schedule settings, `.chain()` makes Bevy apply queued commands between ordered systems
where needed. The commands still wait until the system that queued them has finished.

`.chain_ignore_deferred()` orders systems without making Bevy apply queued commands between them.
`.chain_weak()` can leave systems unordered when their data access does not conflict.
It still keeps the order after a system that queues commands.
Use ordinary ordering when one system must run first for reasons Bevy cannot see from data access.

## Run a system on demand

For an action selected at runtime, register its system once with `commands.register_system(action)`.
Store the returned `bevy::ecs::system::SystemId` and call `commands.run_system(id)` when needed.
The [loading screen example][loading] stores separate IDs for loading and unloading levels.

Execution waits until Bevy applies the command.
Use `World::run_system(id)` when you need the returned result immediately.
Reusing the same registration preserves `Local` state and change detection between calls.
Use `unregister_system(id)` when the registered action is no longer needed.
These calls run with exclusive world access; keep normal frame work in schedules so Bevy can run it in parallel.

## Capture input before fixed simulation

For physics-style movement, read the [complete fixed movement example][movement].

- Capture input in `RunFixedMainLoopSystems::BeforeFixedMainLoop`.
- Store held actions and pending presses in game data.
- Handle each jump press or other one-time action once in the simulation.
  Keep it pending in frames that run no fixed step.
- Run simulation in `FixedUpdate`.
- After the fixed loop, smooth movement by placing the displayed position between the previous and current
  simulation positions.
- Update camera translation after the displayed player position is ready.

Do not use `just_pressed` in `FixedUpdate` as the only record of a button press.
The simulation can miss the press when no fixed step runs, or handle it several times when several steps run.

## Choose a clock

`Res<Time>` supplies virtual frame time in ordinary frame schedules and fixed time in fixed schedules.
Choose a clock type when you need a specific kind of time:

- `Time<Virtual>`: game time; can pause, speed up, or slow down.
- `Time<Real>`: elapsed real time.
- `Time<Fixed>`: the fixed timestep and time left over after the last step, used to smooth movement between steps.

Configure simulation frequency with `Time::<Fixed>::from_hz(60.0)`.
Tick `Timer` with the chosen clock's `delta()`. Use `just_finished()` to check whether it finished during that tick.
A repeating timer can finish several times in one tick. Use `times_finished_this_tick()` when each completion matters.

For a cooldown, use `TimerMode::Once` and check `is_finished()` after ticking it.
It stays ready until `reset()`, so an action can use it after the tick when it first finished.
Reset it when the action is accepted. See [Alien Cake Addict][cooldown] for timed grid movement.

## Release examples and API

- [Fixed timestep][fixed]: schedules and the active `Time` resource.
- [Fixed movement][movement]: input capture, simulation, interpolation, and camera order.
- [Run conditions][conditions]: run systems only when conditions are met; combine conditions.
- [Virtual time][virtual]: pause and speed changes.
- [Ordering API][ordering]: `chain`, weak ordering, and when queued commands are applied.

[fixed]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/fixed_timestep.rs
[movement]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/movement/physics_in_fixed_timestep.rs
[conditions]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/run_conditions.rs
[virtual]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/time/virtual_time.rs
[ordering]: https://docs.rs/bevy/0.20.1/bevy/ecs/schedule/trait.IntoScheduleConfigs.html
[cooldown]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/showcase/alien_cake_addict.rs
[loading]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/showcase/loading_screen.rs
