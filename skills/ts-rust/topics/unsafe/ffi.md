# Treat foreign declarations as contracts you must verify

Foreign function interfaces, or FFI, connect Rust to code with another calling convention or ownership model.
Check the declaration, pointer lifetime, allocator, and error contract against that code.

## Bad

This sketch makes raw foreign memory look safe without establishing the foreign function's requirements.

```rust,ignore
pub fn foreign_length(pointer: *const std::ffi::c_char) -> usize {
    unsafe { strlen(pointer) }
}
```

## Good

This Rust 2024 declaration sketch assumes a target with the C `strlen` contract and matching linkage.

```rust
use std::ffi::{c_char, CStr};

unsafe extern "C" {
    fn strlen(pointer: *const c_char) -> usize;
}

fn foreign_length(text: &CStr) -> usize {
    // SAFETY: CStr supplies a valid, NUL-terminated string for the duration of the call.
    unsafe { strlen(text.as_ptr()) }
}
```

Use `CStr`'s own length method in ordinary Rust code.
The foreign call here shows how a safe input establishes a contract.

- Rust 2024 uses `unsafe extern` blocks. Mark an item safe only when all safe calls meet its foreign preconditions.
- Use `#[unsafe(no_mangle)]` and related unsafe attribute forms where the edition requires them.
  Explain symbol uniqueness or section requirements; an attribute can create obligations without an unsafe block.
- Pair foreign allocation with the matching foreign deallocator.
- Do not pass `String`, `Vec`, or ordinary Rust enums as though they were C-compatible values.
- State whether a foreign call keeps a pointer after returning. A temporary borrow cannot satisfy an unknown lifetime.
- Keep unwinding behavior explicit at the boundary. Do not rely on an ordinary foreign ABI accepting Rust panics.

## Let fields determine `Send` and `Sync` where possible

### Bad

```rust,ignore
struct Counter(std::cell::Cell<u32>);
unsafe impl Sync for Counter {}
```

This permits shared access that the contained cell cannot safely support.

### Good

```rust
struct Counter(std::sync::Mutex<u32>);
```

The compiler can derive suitable automatic thread-safety traits from the fields.
`Cell` may be movable between threads when its contents permit it; that is separate from sharing references to it.

A manual unsafe implementation must explain why every safe operation remains sound across the allowed thread uses.
Do not justify it by assuming callers will always add a mutex. The type's own contract must enforce what it needs.
Recheck the proof when fields, methods, or marker types change.
