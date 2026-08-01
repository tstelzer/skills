## Managing resources and `Scope`s

Learn how to safely manage resources in Effect using `Scope`s and finalizers.

Prefer `acquireRelease`, `acquireUseRelease`, `Scope`, and scoped platform
helpers over manual promise lifecycles or `try` / `finally`.

Choose cleanup semantics as part of the operation contract:

- Preserve cleanup failures when cleanup is part of the result.
- Ignore them only for a named best-effort path where the original result must
  win.
- Use `onError` for failure-only cleanup instead of catch-cleanup-rethrow code.
- Do not use `orDie` for expected cleanup failures.
- When probing for `NotFound`, `AlreadyExists`, or another expected condition,
  catch only that condition.
