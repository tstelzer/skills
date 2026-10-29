## Working with AI modules

Effect's AI modules provide a provider-agnostic interface for language models.
You can generate text, decode structured objects with `Schema` and stream partial
responses.

Set `toModelOutput` in `Tool.make` options when a tool should send text, images,
or files to the model while keeping its typed result for application code.

Use `DecisionModel.decide` for all-or-nothing decisions and `decideSettled`
when callers need valid answers alongside per-decision failures. Declare
images as `Decision.Image` input fields. Use `Decision.locate` for a bounding
box around a target in an image; the provider must support it.

Use the scoped, experimental `McpClient` for stdio or Streamable HTTP MCP
servers. `McpClient.toolkit` exposes discovered tools to a language model.
For `McpServer`, pass registration layers through the transport's
`registrations` option. Supply request services through middleware; capture
construction-time services with `Layer.unwrap`. Use `McpTest.makeClient` to
test registrations through the wire encoding in memory.

Handle `AiError.InvalidResponseError` as a non-retryable provider response
failure. Model-generated output validation can still be retried.
`NetworkError.cause` can hold the original, unredacted `HttpClientError`;
do not serialize that cause into user-facing output.
