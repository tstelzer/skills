# Unsafe Rust

Use safe APIs first. Unsafe code needs a concrete reason and a contract that every reachable safe call preserves.

| Need | Read |
| --- | --- |
| Define and review an unsafe contract | [Boundaries](./boundaries.md) |
| Initialize memory or depend on layout | [Initialization and layout](./initialization.md) |
| Call foreign code or implement thread-safety traits | [FFI and thread safety](./ffi.md) |

Review safe methods that maintain the contract, not only the lines inside `unsafe`.
Use [testing guidance](../testing/concurrent.md) for Miri and other targeted checks.
