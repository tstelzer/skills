# Errors

Choose an error shape based on what the caller must do with it.

| Need | Read |
| --- | --- |
| Return failures, handle missing data, or define state after failure | [Propagation](./propagation.md) |
| Give callers recovery choices and report failures | [Types and reporting](./context.md) |
| Decide whether a failed assumption should panic | [Panics](./panics.md) |

For reporting an error once it is handled, read [diagnostics](../diagnostics/events.md).
