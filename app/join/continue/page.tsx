import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ContinuePage() {
  const number = process.env.VENTO_SMS_NUMBER?.replace(/[^+\d]/g, "");
  const body = encodeURIComponent("Hi Vento — I'd like to continue my signup.");
  const messagesHref = number ? `sms:${number}?&body=${body}` : null;

  return <main className="handoff-page"><section className="handoff-card" aria-labelledby="handoff-title">
    <Link className="logo logo-image" href="/" aria-label="vento home"><Image src="/vento-mark.svg" alt="" width={54} height={54} priority /></Link>
    <p className="eyebrow">continue your signup</p>
    <h1 id="handoff-title">pick up where you left off.</h1>
    <p>Open your messaging app and review the prefilled note before choosing send. Nothing is sent automatically.</p>
    {messagesHref ? <a className="handoff-action" href={messagesHref}>open messages</a> : <p className="handoff-unavailable" role="status">text signup is not available yet.</p>}
    <Link className="handoff-fallback" href="/messages">continue on the web</Link>
    <p className="handoff-legal">Recurring texts require separate consent. Message and data rates may apply. Reply STOP to opt out or HELP for help.</p>
  </section></main>;
}
