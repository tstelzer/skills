---
name: ts-rust
description: Rust handbook for ownership, types, control flow, errors, APIs, async, safety, testing, and performance.
---

# Rust

Use this handbook to write and review Rust functions, types, and APIs.
It covers code structure within a module. Choose application layers and crate boundaries separately.

## Where to start

- Pick the task below. Read its topic index, then the pattern pages that fit the code.
- Read related pages only when the change reaches that topic. Do not load the whole handbook.
- Each pattern gives a rule, its reason, and bad/good examples. Read the limits beside the example.
- Bad examples show a problem under the stated requirements. They are not blanket bans on the syntax.
- Snippets are independent. Examples that need a crate name it; they do not require adding that crate to every project.
- `compile_fail` marks code that Rust should reject. `ignore` marks unsafe or incomplete examples that must not run.
- Use skill: ts-principles for general engineering choices.

## Check the project first

Read the package's Rust edition, `rust-version`, enabled features, and dependency versions.
Use the project's toolchain and conventions. An edition and a compiler version are separate choices.

Use stable features supported by the project. Check version-sensitive APIs before adopting them.
Tokio, Serde, and other crates appear only in the topics that need them.
Use [API lookup](./sources.md) for exact signatures and behavior.

## Choose a task

| Task | Start here |
| --- | --- |
| Choose borrowing, ownership, lifetimes, or shared data | [Ownership](./topics/ownership/index.md) |
| Model values, valid states, and construction | [Types](./topics/types/index.md) |
| Simplify branches, loops, iterators, or callbacks | [Control flow](./topics/flow/index.md) |
| Return failures, add context, or decide when to panic | [Errors](./topics/errors/index.md) |
| Name an API, choose traits, or expose public items | [APIs](./topics/api/index.md) |
| Choose a collection or update it without extra work | [Collections](./topics/collections/index.md) |
| Handle text, filesystem paths, byte parsing, or partial I/O | [Text and I/O](./topics/io/index.md) |
| Convert numbers or handle overflow and floats | [Numbers](./topics/numbers/index.md) |
| Reduce allocations or control resource cleanup | [Memory and resources](./topics/memory/index.md) |
| Await I/O, manage tasks, or handle cancellation | [Async](./topics/async/index.md) |
| Use threads, locks, or atomic values | [Concurrency](./topics/concurrency/index.md) |
| Review unsafe operations or foreign calls | [Unsafe Rust](./topics/unsafe/index.md) |
| Read or write data with Serde | [Serialization](./topics/serde/index.md) |
| Write macros or code evaluated at compile time | [Macros and const](./topics/metaprogramming/index.md) |
| Measure runtime, memory, binary size, or build time | [Performance](./topics/performance/index.md) |
| Test behavior, properties, or concurrent code | [Testing](./topics/testing/index.md) |
| Write API docs or use formatting and lint checks | [Docs and checks](./topics/documentation/index.md) |
| Record useful logs and follow async work | [Diagnostics](./topics/diagnostics/index.md) |

## Common routes

- New function: ownership, control flow, errors.
- New public type: types, APIs, docs and checks.
- Parsing external data: text and I/O, types, errors. Add numbers or serialization when needed.
- Background worker: async execution, tasks, cancellation, channels.
- Shared mutable state: ownership, concurrency. Add async locking when the caller can suspend.
- Slow code: performance measurement first, then the collection or memory pattern shown by the profile.
- Unsafe wrapper: unsafe boundaries, initialization, testing.

## Defaults

- Borrow for temporary access. Take ownership when storing or transferring a value.
- Make invalid states hard to construct. Keep the fields that enforce a rule private.
- Return expected failures with `Result`. Use `Option` for meaningful absence.
- Keep the main path clear. Use `?`, early returns, and exhaustive matches where they fit.
- Start with standard collections and safe code. Measure before changing storage for speed or adding compiler hints.
- Give each spawned task an owner and a completion path. Limit queued and running work.
- Keep unsafe contracts small enough to explain and review.
- Document behavior callers cannot learn from a type signature.
