# Review Security

Check how an attacker could misuse the changed code.

## Review target

Look for the smallest set of protections that blocks attacks made possible by the change.

## Required skills

Read these detail pages from skill: ts-principles:

- `privilege is earned`
- `keep boundaries sharp`
- `parse, don't validate`
- `handle it, or die`
- `evolve contracts deliberately`
- `design for operation`

## What to check

- Sign-in, sessions, tokens, and whether the code ties them to the right user.
- Who can access which actions, accounts, organizations, and records.
- User input that affects access decisions or reaches code that can do harm.
- Secrets and credentials in logs, measurements, errors, URLs, or code sent to users.
- Private data sent to the wrong place through responses, events, exports, caches, logs, analytics, or outside
  services.
- Where the code trusts input from files, networks, browsers, or outside services.
- Ways an attacker could waste resources through large inputs, calls that start more calls, uploads, retries,
  work running at once, expensive queries, or archive files.
- Security settings, dependencies, and published packages that the change makes reachable or gives new access to.

## Outside this review

- General code problems with no way for an attacker to use them and no security effect.
- Checklist concerns with no specific change that creates a risk.
- Dependency details with no reachable attack, new access, or package publishing risk.
- Performance problems unless an attacker can cause the extra cost.
- General test quality, unless missing tests hide a specific security failure caused by the change.

## Steps

1. List what an attacker can control in the changed code.
2. List who can access what, which data and resources need protection, and where outside input reaches trusted code.
3. Follow attacker-controlled input into storage, logs, commands, templates, network calls, files, browser APIs,
   outside services, and operations that need special access.
4. Check that identity checks, access checks, input parsing, and data conversion happen before the code trusts
   the input or changes anything.
5. Check whether secrets or private data reach responses, clients, logs, measurements, caches, errors, queues,
   exports, or outside services.
6. Choose severity from what the attacker can do, how they do it, how much damage it causes, how easily someone
   would notice, and which permissions the attacker needs.
7. Keep only problems where you can explain what the attacker controls, what they can reach, which check or limit
   they cross, and how that causes harm.
8. Return findings using [review-template.md](../review-template.md).

## Severity examples

Use these examples to help judge how serious the actual problem is.

- `critical`: an attacker can bypass a required check, a secret is exposed, or attacker-controlled input reaches
  important data or operations.
- `high`: a missing access check, input entering trusted code without parsing, or an attacker causing extra cost.
- `low`: missing extra protection, with no known way to exploit the gap now.

## Category examples

- `authentication`
- `authorization`
- `session-token`
- `tenant-boundary`
- `privilege-boundary`
- `input-boundary`
- `injection`
- `secret-exposure`
- `sensitive-data-exposure`
- `filesystem-boundary`
- `network-boundary`
- `browser-boundary`
- `third-party-boundary`
- `resource-abuse`
- `security-configuration`
- `supply-chain`
