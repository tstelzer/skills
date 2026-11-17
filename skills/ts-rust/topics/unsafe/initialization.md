# Keep uninitialized storage separate from initialized values

Use safe initialization when possible. Use `MaybeUninit<T>` when a low-level operation needs storage before
it can produce a valid `T`.

## Bad

This creates an invalid reference immediately. Do not run it.

```rust,ignore
let value: &u32 = unsafe { std::mem::zeroed() };
```

## Good

This small example shows the initialization boundary, not a reason to replace ordinary assignment.

```rust
use std::mem::MaybeUninit;

let mut slot = MaybeUninit::<u32>::uninit();
slot.write(42);
// SAFETY: write initialized the slot with a valid u32, and it has not been moved out.
let value = unsafe { slot.assume_init() };
assert_eq!(value, 42);
```

- Do not use `mem::uninitialized`. Uninitialized bytes are not a valid arbitrary Rust value, including for integers.
- Zero bytes are valid only for types whose documented representation permits them.
- Initialize every required part before creating a reference to `T` or calling `assume_init`.
  A reference to `MaybeUninit<T>` is allowed before `T` has been initialized.
- Padding bytes need not be initialized to make a value valid. Do not read them as ordinary initialized bytes.
- Track which elements were initialized if construction can fail or panic. Drop those elements exactly once.
- Dropping `MaybeUninit<T>` does not run `T`'s destructor, even after a successful write.
- Prefer `Vec::push`, `extend`, or `resize` over manual length management.
- For manual filling, write into spare capacity before increasing length. Capacity is not initialized length.

## Use only documented layout guarantees

`repr(Rust)` does not promise declaration-order fields or a stable foreign layout.
`repr(C)` gives a defined field-layout scheme but does not make every field suitable for a C interface.
`repr(transparent)` can give a wrapper the layout and function-call rules of its qualifying field.
Check its restrictions and the inner type's validity rules.

Equal sizes do not prove two types can be transmuted. Check alignment, valid bit patterns, ownership, and lifetimes.
An arbitrary integer is not a valid `bool`, enum, reference, or nonzero type just because it fits in the same storage.
A representation attribute does not recursively change nested types.
Avoid packed structures that require unaligned field access unless the external layout requires them;
do not create an ordinary reference to an unaligned field.
