## How to review

- Before starting, describe the smallest result that would meet the requirements for your review type.
- Assume the work has problems until your checks show otherwise.
- Question claims, designs, tests, comments, and findings. Check them before relying on them.
- Do not fill the report with praise, reassurance, or vague claims about quality.

## Severity

Workers propose how serious each problem is. The judge sets its final severity after checking when it can happen
and what it would do.

- critical: cannot merge
- high: must fix before merging
- low: should fix, but need not block merging

## Rules

- Say what you checked directly. Explain what those checks tell you and which facts you have not checked.
  If you did not reproduce the failure, show why you expect it to happen. Report only claims you can support.
  Use [review-template.md](./review-template.md) for finding entries.
- If no upheld findings need action, say so under `## Upheld findings`. Keep open decisions visible.
- Never include secrets, credentials, tokens, private keys, session values, cookies, authorization headers,
  connection strings, or raw log lines that contain them.
- Replace private values with `<redacted>`. Keep the file path, line number, variable or field name, the steps
  through the code, and where the value ends up.
- For a leaked secret, show what kind of secret it is and how it can be seen. For example:
  `config/prod.env:12` stores `DATABASE_URL` in plaintext and `scripts/debug.ts:44` logs it.
- Do not show parts of a secret, its hash or length, screenshots, command output, or sample data that could help
  someone recover or check the secret.
