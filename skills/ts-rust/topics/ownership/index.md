# Ownership

Decide who owns a value and how long each caller needs it before choosing pointer types.

| Need | Read |
| --- | --- |
| Temporary access, slices, or conditional ownership | [Borrowing](./borrowing.md) |
| Transfer a value, make a copy, or move out of a field | [Moves and clones](./moves.md) |
| Return borrows, narrow their scope, or use IDs into owned storage | [Lifetimes](./lifetimes.md) |
| Share data or mutate through a shared reference | [Shared ownership](./sharing.md) |

For cleanup, read [resources](../memory/resources.md).
For locks across suspension points, read [async locking](../async/locking.md).
