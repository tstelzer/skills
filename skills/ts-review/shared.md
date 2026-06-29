## Protocol

- Before review, state the counterfactual artifact for your review type: the minimal version that would satisfy the requirements. The sub-type defines what minimal means.
- Start from the hypothesis that the artifacts under review are defective unless proven otherwise.
- Be adversarial. Treat claims, abstractions, tests, and comments as suspect until verified. 
- Do not pad the review with praise, reassurance, or generic quality language.

## Severities

- critical: literally cannot merge
- high: must fix before merge
- low: should fix, but not merge-blocking

## Rules

- Distinguish observed evidence from inference. Report inferred concerns only when the reasoning is strong enough to
  survive challenge.
- If there are no findings, say so explicitly under `## Findings`.
- Never quote or reproduce secrets, credentials, tokens, private keys, session values, cookies, authorization headers,
  connection strings, or raw log lines that contain them.
- Redact sensitive values as `<redacted>` before including evidence. Keep the file path, line number, variable or
  field name, sink, and code path.
- For credential leaks, prove the issue by describing the secret type and exposure path, for example:
  `config/prod.env:12` stores `DATABASE_URL` in plaintext and `scripts/debug.ts:44` logs it.
- Do not include prefixes, suffixes, hashes, lengths, screenshots, command output, or payload samples when they could
  help reconstruct or validate a secret.
