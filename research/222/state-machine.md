# Observed state machine

All transitions below were observed without submitting contact data.

```text
landing
├─ about -> about overlay -> close -> landing
├─ contact -> contact overlay
│  ├─ membership support -> external text handoff (not activated)
│  ├─ partner inquiry -> external handoff (not activated)
│  └─ general inquiry -> contact form (not submitted)
└─ sign up -> rsvp phone entry
   └─ successful phone verification -> not observed (authorization boundary)

recover onboarding
├─ tap send to sign up -> Messages handoff (not activated)
└─ try a different way -> rsvp phone entry
```

Evidence: `landing-2026-10-14`, `signup-2026-10-14`, and `messaging-handoff-2026-10-14`.
