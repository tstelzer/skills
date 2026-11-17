# Errors

Choose an error shape based on what the caller must do with it.

| Need | Read |
| --- | --- |
| Return expected failures or handle missing data | [Propagation](./propagation.md) |
| Give callers recovery choices and preserve causes | [Types and context](./context.md) |
| Decide whether a failed assumption should panic | [Panics](./panics.md) |

For reporting an error once it is handled, read [diagnostics](../diagnostics/events.md).
