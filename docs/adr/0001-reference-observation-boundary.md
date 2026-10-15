# ADR 0001: Reference observation and implementation boundary

- Status: accepted
- Date: 2026-10-14

## Context

The 222 reconstruction requires evidence about public behavior without importing private implementation details, credentials, personal conversations, or proprietary assets into Vento.

## Decision

Use REA for passive Chrome DevTools Protocol observation and Playwright only for repeatable interaction scripts against public pages or owner-controlled test accounts. Store raw captures outside version control, run the repository redactor before review, and commit only the minimum sanitized evidence needed to justify a behavior or contract.

The resulting product will be an independent Vento implementation. “iMessage interface” means an original, accessible conversation UI and a documented handoff to supported messaging channels. It does not imply an undocumented iMessage API, Apple impersonation, or copied Apple/222 assets.

## Adopt, adapt, reject

- Adopt REA's target inspection, screenshots, HAR inspection, and evidence export for passive observation.
- Adapt captured behavior into explicit route, state, and network contracts before implementation.
- Reject private endpoints, access-control bypasses, authenticated data not owned by the operator, copied source, session secrets, and automation presented as a supported messaging integration.

## Consequences

Observation and product code remain auditable and separable. A public UI can be reconstructed before provider approvals, while actual outbound messaging stays behind contract-faithful adapters and is marked externally blocked until a supported API and consent path are verified.

## References

- https://github.com/morluto/rea/blob/main/docs/browser-observation.md
- https://github.com/morluto/rea/blob/main/docs/web-network-captures.md
- https://github.com/morluto/rea/blob/main/docs/cli.md
