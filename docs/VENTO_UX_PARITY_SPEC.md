# Vento UX parity design

Status: approved implementation contract for PR-4 onward. Date: 2026-10-14.

## Translation principles

Vento adopts the observed strengths—one-screen focus, a small number of clear actions, editorial type, event/match anticipation, an explicit Messages handoff, and a web fallback—while using original copy, components, assets, data, and interaction details. It does not reproduce 222's logo, illustrations, photos, source, or hidden behavior.

## Information architecture

- `/`: campaign landing with a quiet atmospheric layer, fixed navigation, approved hero, city availability, and the existing durable waitlist flow.
- `/about`: Vento's philosophy and safety/expectations, preserving the existing standalone route.
- `/join`: phone/email onboarding entry with explicit channel consent and a recoverable web path.
- `/join/continue`: supported Messages/SMS deep-link handoff with a visible fallback and no automatic send.
- `/messages`: an original conversation-style onboarding view that works as a web experience first and can mirror supported provider events later.
- Existing `/verify`, `/admin`, `/privacy`, and `/terms` remain stable.

## Approved landing copy

- Eyebrow: `nyc first. everywhere next.`
- Hero: `this night has potential.`
- Supporting line: `vento brings the right people together for nights worth remembering.`
- Primary CTA: `join the waitlist.`
- Closing line: `good things happen offline.`

The CTA is lowercase, plain text, single-line, and has no arrow, underline, icon, or pill treatment. Legal/consent copy remains unchanged unless counsel approves a revision.

## Landing layout

Desktop uses a full-viewport editorial composition: navigation at the top, the hero within the middle third, and the CTA/availability/closing line near the lower edge. Mobile keeps the same hierarchy, reserves at least 96 px above the bottom edge for the future mascot, and never hides the CTA behind video or animation. Background media is optional and feature-gated; the page is complete with its poster/gradient alone.

## Conversation UI

The web conversation is recognizably message-like but not an Apple Messages clone. It uses Vento's charcoal/cream/lime palette, editorial section labels, asymmetric bubbles, time/status metadata, and a composer-like choice tray.

States:

1. `intro`: Vento explains what the flow will ask and why.
2. `prompt`: one question at a time with text or constrained choices.
3. `saving`: input locks and an announced progress state appears.
4. `saved`: server checkpoint is durable before the next prompt.
5. `error`: the last response stays visible and retry is bounded.
6. `handoff`: a supported Messages/SMS link is offered; nothing sends automatically.
7. `fallback`: the same flow remains usable in the browser.
8. `complete`: summary, consent preferences, and next action are explicit.

Accessibility requirements:

- transcript is a semantic ordered list inside a labelled live region;
- new agent prompts use polite announcements; saved/error states use status/alert roles;
- all choices and composer actions are keyboard reachable with visible focus;
- bubbles are not distinguished by color alone;
- reduced-motion removes typing animation and sliding transitions;
- minimum 44 px targets; no autoplay audio; no forced focus jumps.

## Join and handoff contract

The primary channel choice is explicit. Email continues to work independently. Phone entry validates country and number format server-side, captures a versioned consent event, and shows frequency/STOP/help terms before any recurring message. `/join/continue` displays destination, prefilled-message intent, and a user-triggered open action plus `continue on the web` fallback. A successful deep-link open is never recorded as delivery.

## Responsive contract

- `>=1200 px`: centered 1280 px page grid; conversation max-width 720 px.
- `768–1199 px`: 32 px gutters; overlays/panels max-width 640 px.
- `<768 px`: 20 px gutters; full-width conversation; safe-area padding; sticky choice tray only when it does not cover transcript content.
- Test viewports: 1440x900, 1920x1080, 768x1024, 390x844, and 375x812.

## Performance and rollout

The initial server HTML contains the hero and CTA. Background media cannot gate LCP and is disabled for reduced motion/data. Conversation JavaScript is route-split. Landing media and mascot each have independent kill switches. Existing waitlist, UTM/referral capture, verification, admin, legal, and webhook behavior are release invariants.
