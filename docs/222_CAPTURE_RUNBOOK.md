# 222 public-reference capture runbook

## Safety boundary

Capture only public pages and owner-authorized test identities. Never capture another person's messages, reuse production cookies, bypass access controls, or commit credentials, raw HAR files, email addresses, phone numbers, or message bodies.

## Browser setup

1. Create a dedicated temporary browser profile with no personal accounts.
2. Bind Chrome's remote debugging endpoint to loopback only.
3. Confirm tooling with `npx -y rea-agents@latest doctor --json` and list the intended target with `npx -y rea-agents@latest list-browser-targets http://127.0.0.1:9222 --json`.
4. Record URL, viewport, timestamp, consent state, and expected interaction before capture.

## Passive capture

Use the official REA commands documented in its browser-observation guide. Save raw output beneath `research/222/raw/`, which is ignored by Git. A typical public-page inspection is:

```sh
npx -y rea-agents@latest inspect-web-page http://127.0.0.1:9222 --json
npx -y rea-agents@latest capture-web-screenshot http://127.0.0.1:9222 --output research/222/raw/page.png --json
```

For HAR files, inspect offline with `inspect-web-network-capture`; do not fetch captured bodies or replay state-changing requests.

## Sanitization and promotion

Run `npm run evidence:redact -- research/222/raw/input.json research/222/sanitized/output.json`. The command refuses to overwrite an existing destination. Manually review images and JSON for identities, tokens, cookies, message content, GPS data, and non-public URLs before adding an entry to `evidence-manifest.json`.

Only evidence linked to an explicit parity decision is promoted. Delete the temporary browser profile after the authorized capture session.
