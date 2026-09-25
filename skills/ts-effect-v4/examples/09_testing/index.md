## Testing Effect programs

Use `it.effect` for Effect workflows and `it.live` only when the test requires
live runtime services. Build fixtures with layers and scoped Effect resources.
Do not patch `process.env`, use raw filesystem promises, or manage cleanup with
manual `try` / `finally`.

Use `it.effect.each` for repeated success and failure cases. Compare complete
values when practical. Assert error tags and structured fields instead of
messages or implementation calls.

Test public behavior. Do not add tests for pass-through Effect wrappers. At an
external boundary, cover the distinct missing, empty, malformed, partial,
cleanup, and exact-value-preservation cases that affect callers.

For property tests, pass Schemas or native `Arbitrary` values to `it.prop` or
`it.effect.prop`. Set run options under `arbitrary`, not `fastCheck`. See the
[rc117 Arbitrary guide](https://github.com/Effect-TS/effect/blob/effect@4.0.0-rc.117/packages/effect/ARBITRARY.md).
