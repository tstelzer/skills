# Record fields that answer what happened

Use the project's logging facade. `tracing` is useful when structured fields and spans are needed.
Libraries emit events; applications choose the subscriber, destination, and filtering.

## Bad

```rust
fn record_failure(request_id: u64, error: &std::io::Error) {
    println!("request {} failed: {:?}", request_id, error);
}
```

This writes unfiltered text and makes the request ID harder to query as a field.

## Good

This example uses `tracing`.

```rust
fn record_failure(request_id: u64, error: &std::io::Error) {
    tracing::error!(request_id, error = %error, "request failed");
}
```

For a wrapped error, ordinary `Display` may show only the outer message.
Use the project's error-chain renderer, or walk `Error::source`, when reporting needs the original cause too.
An `anyhow` report can render its chain with its supported alternate display form.
Do not format an expensive report before knowing the event will be recorded.

| Level | Typical use |
| --- | --- |
| `error` | Work failed and this boundary is reporting the outcome |
| `warn` | An unusual condition needs attention but work may continue |
| `info` | Useful lifecycle or business events at normal volume |
| `debug` | Details for diagnosis |
| `trace` | Very detailed events that can be costly at high volume |

Choose levels from the audience and event rate. A successful retry does not need the same report as a final failure.
Log at the handling boundary; intermediate functions can add context and propagate without repeating the same report.

Do not record credentials, raw request bodies, or personal fields just because `Debug` is available.
Use approved identifiers and redacted values. Check errors and nested fields too.
Let the application install filtering such as an `EnvFilter`; a reusable library should not set a global subscriber.
