## Effect HttpClient

Build http clients with the `HttpClient` module.

Define boundary outcomes before implementation. Keep transport failure,
missing data, empty data, malformed data, and partial results distinct when
callers respond differently. Decode untrusted response bodies with `Schema` at
the response boundary.

Use `HttpClient.retryTransient` for transient errors and responses. A
`Retry-After` header sets the minimum retry delay. Reuse `isTransientError`
and `isTransientResponse` when a custom policy needs the same classification.

Apply `HttpClient.withCircuitBreaker` after retry and rate-limit middleware
to record the final outcome of each call. An open circuit then skips retries.
Build the breaker with `effect/persistence/CircuitBreaker`; this API is experimental.

Pass `Ref<ReadonlyArray<Cookies.Cookie>>` to `HttpClient.withCookiesRef`.
Seed it with `Cookies.mergeIntoArray` or cookies with explicit domains.
Stored cookies obey host, path, scheme, and expiry rules.

On runtimes without streaming request support, `FetchHttpClient` fails with
`EncodeError`. Set `FetchHttpClient.StreamBodyFallback` to `"buffer"` only when
holding the whole request body in memory fits the operation.
