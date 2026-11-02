# Messages and observers

Use messages when systems should read them later. Use events to run observers when the event is triggered.

Modules: `bevy::ecs::message`, `bevy::ecs::event`, `bevy::ecs::observer`.

| Need | API |
| --- | --- |
| Systems read messages when their schedule runs | `Message`, `MessageReader`, `MessageWriter` |
| Run a reaction when an event is triggered | `Event`, `On<E>`, an observer |
| Target an entity and its attached observers | `EntityEvent` |
| React to adding or removing a component | `On<Add<T>>`, `On<Remove<T>>` |

## Buffered messages

Read [01_messages.rs](./01_messages.rs).

Derive `Message`, register it with `app.add_message::<T>()`, send with `MessageWriter<T>::write`,
and read with `MessageReader<T>::read`. Each reader tracks which messages it has read.
One reader does not remove messages from another reader.

Run the writer before the reader when the reader must handle the message in the same frame.
Bevy keeps messages for a limited time. A system stopped by a run condition or state can miss them.
Store work in game state or a queue you manage when it must survive a long pause.

A reader and writer for the same message type in one system both borrow the same resource and conflict.
Use `MessageMutator<T>` to read and write, or split reading and writing into separate systems.

## Triggered events

Read [10_observers.rs](./10_observers.rs).

Register a global observer with `app.add_observer`.
Attach one to a particular entity with `commands.entity(entity).observe(...)`.
Observers use system parameters alongside `On<E>`.

`World::trigger` runs observers before it returns.
`Commands::trigger` queues the trigger; observers run when that command is applied.
Observers watching the same event have no defined order. Their queued commands apply after those observers run.
When steps must run in order, put them in one observer or in systems with an explicit order.
Make sure events triggered by observers cannot keep triggering each other without end.

For `#[derive(EntityEvent)]`, name the target field `entity: Entity`.
Use event attributes from this release to choose another field name or let events travel between related entities.

For events about adding or removing components, put the component type inside the event: `On<Add<Health>>`.
Changing a component through a query does not send an `Insert` event. Use change detection for that case.

## Picking and widget events

Pointer events have names such as `PointerClick`, `PointerPress`, and `PointerDrag`.
For a UI button, observe `ui_widgets::Activate` so pointer and keyboard activation can share the same action.
See [UI and picking](../12_ui-picking/index.md).

## Release examples and API

- [Messages][messages]: registration, mutation, readers, and ordering.
- [Observers][observers]: observers for the whole app, specific entities, and component changes.
- [Propagation][propagation]: events that travel through an entity hierarchy.
- [Message retention][retention]: how long Bevy keeps messages.
- [Observer API][observer-api]: execution order and command timing.

[messages]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/message.rs
[observers]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/observers.rs
[propagation]: https://github.com/bevyengine/bevy/blob/v0.20.1/examples/ecs/observer_propagation.rs
[retention]: https://docs.rs/bevy/0.20.1/bevy/ecs/message/struct.Messages.html
[observer-api]: https://docs.rs/bevy/0.20.1/bevy/ecs/observer/struct.Observer.html
