## Effect HttpClient

Build http clients with the `HttpClient` module.

Define boundary outcomes before implementation. Keep transport failure,
missing data, empty data, malformed data, and partial results distinct when
callers respond differently. Decode untrusted response bodies with `Schema` at
the response boundary.
