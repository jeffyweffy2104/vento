# Messaging handoff

## Observed public behavior

The recovery page tells the user to return to the Messages app and presents a branded card labeled “tap send to sign up.” It also provides “try a different way,” which swaps to country-code and phone-number entry. The phone surface discloses SMS consent and “text STOP to cancel anytime.” No phone number was entered, handoff activated, or message sent during capture.

This is evidence of a web-to-Messages handoff, not evidence of a general iMessage API or a browser-based message inbox. The post-verification conversation, inbound commands, delivery receipts, and provider contract remain unobserved.

## Vento contract

Vento will implement an original conversation-style signup surface with:

- a supported deep link only where the platform permits it;
- an equivalent web/SMS fallback;
- explicit consent before recurring messages;
- STOP and HELP semantics;
- durable consent and delivery events;
- provider errors and retries visible to an operator;
- no claim that a message was sent until the provider confirms acceptance.

Actual outbound messaging remains blocked on supported-provider/API verification and legal review.
