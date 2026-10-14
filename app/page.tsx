"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const places = ["new york city.", "tokyo.", "berlin.", "paris.", "london.", "amsterdam.", "copenhagen."];

export default function Home() {
  const [place, setPlace] = useState(0);
  const [visible, setVisible] = useState(true);
  const [signup, setSignup] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const attribution = useMemo(() => typeof window === "undefined" ? {} : Object.fromEntries(new URLSearchParams(window.location.search)), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setVisible(false);
      timeout = setTimeout(() => { setPlace((current) => (current + 1) % places.length); setVisible(true); }, 360);
    }, 2600);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  useEffect(() => { if (attribution.join === "1") setSignup(true); }, [attribution.join]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = {
      email: form.get("email"), phone: form.get("phone") || null, smsConsent: form.get("smsConsent") === "on",
      website: form.get("website"), ref: attribution.ref || null, source: attribution.utm_source || null,
      campaign: attribution.utm_campaign || null, medium: attribution.utm_medium || null,
      content: attribution.utm_content || null, city: form.get("city") || null,
    };
    try {
      const result = await fetch("/api/waitlist", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error || "Please try again.");
      setStatus("success");
      setMessage(data.emailConfigured === false ? "you're saved. we'll confirm your place as soon as invitations open." : "check your inbox to confirm your invitation.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  return <main className="shell home-shell">
    <header className="top">
      <Link className="logo logo-image" href="/" aria-label="vento home"><Image src="/vento-mark.svg" alt="" width={54} height={54} priority /></Link>
      <Link href="/about">about</Link>
    </header>
    <section className="center" aria-live="polite">
      {!signup ? <>
        <h1 className="hero-title">Find your people in <span className="place-window"><span className="place-name" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-.22em)" }}>{places[place]}</span></span></h1>
        <button className="cta text-button" onClick={() => setSignup(true)}>join the waitlist.<span aria-hidden="true"> ↗</span></button>
      </> : <div className="panel">
        {status === "success" ? <div className="success-state"><p className="eyebrow">vento.</p><h1>almost there.</h1><p>{message}</p><p className="muted">good things happen offline.</p></div> : <>
          <p className="eyebrow">private beta</p><h1>you&apos;re invited.</h1><p>be first to hear when vento. opens in your city.</p>
          <form onSubmit={submit} noValidate>
            <label className="sr-only" htmlFor="email">Email address</label><input id="email" className="field" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="your email" />
            <label className="sr-only" htmlFor="phone">Phone number</label><input id="phone" className="field" name="phone" type="tel" autoComplete="tel" maxLength={32} placeholder="phone, optional (+12125550123)" />
            <label className="sr-only" htmlFor="city">Your city</label><input id="city" className="field" name="city" maxLength={100} placeholder="your city, optional" />
            <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label className="consent"><input type="checkbox" name="smsConsent" /><span>I agree to receive optional marketing texts from vento. Message frequency varies; message and data rates may apply. Reply STOP to opt out.</span></label>
            <p className="form-legal">By joining, you agree to our <Link href="/terms">terms</Link> and acknowledge our <Link href="/privacy">privacy policy</Link>.</p>
            <button className="cta text-button" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "joining…" : "join the waitlist."}</button>
            {message && <p className="form-message error" role="alert">{message}</p>}
          </form>
        </>}
        <button className="close-button" onClick={() => { setSignup(false); setStatus("idle"); setMessage(""); }}>close.</button>
      </div>}
    </section>
    <footer className="foot"><span>© 2026 vento.</span><span>good things happen offline.</span></footer>
  </main>;
}
