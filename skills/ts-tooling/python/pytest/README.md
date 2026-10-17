# pytest

Use the latest pytest 9 release. Keep the default test command non-interactive.

- Set `testpaths` to the repository's test folders. Use `importlib` import mode for new test suites.
- Test packaged code through its editable installation. For script-only layouts, set pytest's `pythonpath` to the
  source root when needed. Keep test imports consistent with application commands.
- Use temporary paths and generated fixtures for ordinary tests. Put tests that need external services or real
  datasets behind an explicit recipe and marker; keep the default suite independent of those inputs.
- Register custom markers and keep unknown markers or configuration options as errors.

Merge [`reference/pyproject.fragment.toml`](./reference/pyproject.fragment.toml) into `pyproject.toml`. The fragment
uses pytest 9's native `[tool.pytest]` table; merge or migrate existing pytest settings rather than keeping competing
configurations. Adapt the test paths before use.
Merge [`reference/just.fragment`](./reference/just.fragment) into the repository `justfile` using the command form
selected in the [Python index](../index.md#environment).

See [test integration](https://docs.pytest.org/en/stable/explanation/goodpractices.html) and
[configuration](https://docs.pytest.org/en/stable/reference/customize.html).
