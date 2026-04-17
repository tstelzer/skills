# Security Review

Use this for exploitability and trust boundaries. Report security findings only
when you can tie them to a concrete boundary, capability, or exposure path.

## Focus

- Authentication and authorization checks
- Input validation and boundary enforcement
- Secret handling, credential leaks, and sensitive logging
- Injection risks in SQL, shell, templates, file paths, URLs, or queries
- Cross-tenant or privilege boundary violations
- Dangerous defaults, insecure fallbacks, and unsafe debug behavior
- Exposure created by third-party calls, file access, or network access

## Workflow

1. Map inputs, identities, privileges, and side effects.
2. Identify trust boundaries and ask what an attacker can control on each side.
3. Follow data to sensitive sinks: storage, logs, commands, templates, network,
   filesystem, and privileged operations.
4. Prefer findings with a plausible exploit path and clear blast radius.

## Category Hints

- `authentication`
- `authorization`
- `input-validation`
- `secret-handling`
- `injection`
- `data-exposure`
- `filesystem-boundary`
- `network-boundary`

## Do Not Drift Into

- Generic robustness nits with no security consequence
- Speculative OWASP checklist items without a concrete path to exploitation
