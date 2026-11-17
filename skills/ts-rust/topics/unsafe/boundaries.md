# Make the unsafe obligation explicit

Keep unsafe operations small and put a concrete `SAFETY` reason beside each one.
The comment must explain why the preconditions hold, not restate what the operation does.

## Bad

This safe function lets a caller cause undefined behavior with an invalid pointer. Do not use it.

```rust,ignore
pub fn read_byte(pointer: *const u8) -> u8 {
    // SAFETY: reads a byte.
    unsafe { *pointer }
}
```

## Good

Expose a safe borrowed interface when that meets the need:

```rust
pub fn first_byte(bytes: &[u8]) -> Option<u8> {
    bytes.first().copied()
}
```

When raw pointer access is the actual contract, make the caller's obligation explicit:

```rust
/// Reads the byte at `pointer`.
///
/// # Safety
/// `pointer` must be valid for reading one initialized byte during this call.
/// No other thread may write that byte during the read.
pub unsafe fn read_byte(pointer: *const u8) -> u8 {
    // SAFETY: the caller guarantees a valid, initialized byte with no concurrent writer.
    unsafe { *pointer }
}
```

An `unsafe fn` still needs small explicit unsafe blocks around its unsafe operations.
Keep allocation ownership, bounds, alignment, lifetimes, and aliasing in the contract where they matter.
Creating a reference makes these promises immediately.
Avoiding a later dereference does not excuse an invalid reference.
Do not use unchecked indexing solely to remove a bounds check without measured need and a proof of the index range.
Checks that make an unsafe operation sound must run in every build. Do not rely on `debug_assert!` for those checks.

## Review the safe code that maintains the rules

Private fields can keep callers from corrupting bookkeeping. Every method that changes those fields must preserve the
rules used by later unsafe operations.
Do not trust an arbitrary safe trait implementation to satisfy an undocumented safety condition.
Use an `unsafe trait` when implementers must uphold a condition that safe code cannot enforce and memory safety needs.
State that condition in its `# Safety` docs and justify each `unsafe impl`.

Check what happens if a clone, comparison, callback, or allocation panics midway through an update.
Use guards or prepare data before changing the structure so cleanup never reads or drops uninitialized values.
Memory safety after a panic is required even when the operation cannot preserve its full application-level result.

Do not depend on `Drop` always running to keep an API sound. Safe code can leak values.
Miri and stress tests check the paths they exercise. A safe wrapper must be sound for all allowed calls.
