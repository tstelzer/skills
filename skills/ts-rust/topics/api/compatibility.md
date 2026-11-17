# Expose the smallest useful public contract

Keep implementation fields private when they protect a rule or may change.
Use restricted visibility for internal collaboration.

## Bad

```rust
pub struct RetryLimit {
    pub attempts: u32,
}
```

This API cannot enforce a positive attempt count.

## Good

```rust
use std::num::NonZeroU32;

pub struct RetryLimit {
    attempts: NonZeroU32,
}

impl RetryLimit {
    pub fn new(attempts: NonZeroU32) -> Self {
        Self { attempts }
    }

    pub fn attempts(&self) -> NonZeroU32 {
        self.attempts
    }
}
```

| Visibility | Who can use the item |
| --- | --- |
| Private | The defining module and its descendants |
| `pub(super)` | The parent module and code within that scope |
| `pub(crate)` | The crate |
| `pub(in path)` | The named ancestor module's scope |
| `pub` | External callers through an accessible path |

Use `pub use` to expose a stable name without exposing the internal module tree.
Do not make an item public merely to make an internal test convenient.

## Make future changes explicit

- Put `#[non_exhaustive]` on a public enum when external callers must allow future variants.
  Put it on a struct when external construction should go through provided methods.
  Adding the attribute later can break callers.
  It governs Rust API evolution; represent [unknown wire values](../types/modeling.md#preserve-unknown-protocol-values)
  in the parsed data.
- Seal a trait with a private supertrait when only your crate should implement it. Document that restriction.
  Sealing does not make changes to public method signatures harmless.
- Treat public trait implementations, fields, feature names, and serialized forms as contracts.
- Add standard traits when their semantics are sound, not because every public type must implement everything.
- Make optional integrations, such as Serde, Cargo features when they should be optional for users.
- Design features to add capabilities. Feature unification can enable more features than one caller requested.

A new public item or feature has a maintenance cost. Keep private helpers private until a caller needs the contract.
