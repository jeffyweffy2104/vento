"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Step = "intro" | "city" | "email" | "phone" | "consent" | "saving" | "complete";
type Message = { id: string; sender: "vento" | "you"; text: string };

const prompts = {
  city: "first, what city feels like home right now?",
  email: "where should we send your invitation?",
  phone: "want to add a phone number? it’s optional.",
  consent: "would you like occasional Vento texts? you can say no and still join.",
};

export function ConversationOnboarding() {
  const [step, setStep] = useState<Step>("intro");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", sender: "vento", text: "hey, we’re vento. we’re building better ways to find your people offline." },
    { id: "expectation", sender: "vento", text: "i’ll ask for your city and contact details, then save your place in the private beta." },
  ]);
  const [answers, setAnswers] = useState({ city: "", email: "", phone: "", smsConsent: false });
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const attribution = useMemo(() => typeof window === "undefined" ? {} : Object.fromEntries(new URLSearchParams(window.location.search)), []);

  function append(answer: string, next: "email" | "phone" | "consent") {
    setMessages((current) => [...current, { id: `you-${current.length}`, sender: "you", text: answer }, { id: `vento-${current.length + 1}`, sender: "vento", text: prompts[next] }]);
    setValue(""); setError(""); setStep(next);
  }

  function start() {
    setMessages((current) => [...current, { id: "city-prompt", sender: "vento", text: prompts.city }]);
    setStep("city");
  }

  async function save(consent: boolean, answerLabel: string) {
    const finalAnswers = { ...answers, smsConsent: consent };
    setAnswers(finalAnswers);
    setMessages((current) => [...current, { id: `you-${current.length}`, sender: "you", text: answerLabel }]);
    setError(""); setStep("saving");
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
        email: finalAnswers.email, phone: finalAnswers.phone || null, city: finalAnswers.city, smsConsent: consent, website: "",
        ref: attribution.ref || null, source: attribution.utm_source || "conversation", campaign: attribution.utm_campaign || null,
        medium: attribution.utm_medium || null, content: attribution.utm_content || null,
      }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "we couldn’t save your place.");
      setMessages((current) => [...current, { id: "complete", sender: "vento", text: result.emailConfigured === false ? "you’re on the list. we’ll be in touch when invitations open." : "you’re on the list. check your inbox to confirm your invitation." }]);
      setStep("complete");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "we couldn’t save your place.");
      setStep(finalAnswers.phone ? "consent" : "phone");
    }
  }

  function submitText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const cleaned = value.trim();
    if (step === "city") {
      if (cleaned.length < 2) return setError("tell us your city so we know where to start.");
      setAnswers((current) => ({ ...current, city: cleaned })); append(cleaned, "email");
    } else if (step === "email") {
      if (!/^\S+@\S+\.\S+$/.test(cleaned)) return setError("enter a valid email address.");
      setAnswers((current) => ({ ...current, email: cleaned })); append(cleaned, "phone");
    } else if (step === "phone") {
      if (!cleaned) return void save(false, "skip phone for now.");
      const phone = cleaned.replace(/[\s().-]/g, "");
      if (!/^\+?[1-9]\d{7,14}$/.test(phone)) return setError("use a full phone number, including country code.");
      setAnswers((current) => ({ ...current, phone })); append(phone, "consent");
    }
  }

  const activeTextStep = step === "city" || step === "email" || step === "phone";
  return <section className="conversation" aria-labelledby="conversation-title">
    <div className="conversation-title-row"><div><p className="eyebrow">vento concierge</p><h1 id="conversation-title">let’s make something happen.</h1></div><span className="conversation-presence"><i aria-hidden="true" /> online</span></div>
    <ol className="transcript" aria-live="polite" aria-label="signup conversation">
      {messages.map((message) => <li className={`message ${message.sender}`} key={message.id}><span className="message-sender">{message.sender === "vento" ? "vento" : "you"}</span><p>{message.text}</p></li>)}
      {step === "saving" && <li className="message vento saving" role="status"><span className="message-sender">vento</span><p>saving your place…</p></li>}
    </ol>
    <div className="choice-tray">
      {step === "intro" && <button className="choice-primary" onClick={start}>start</button>}
      {activeTextStep && <form onSubmit={submitText}>
        <label className="sr-only" htmlFor="conversation-answer">{prompts[step]}</label>
        <input id="conversation-answer" value={value} onChange={(event) => setValue(event.target.value)} autoComplete={step === "email" ? "email" : step === "phone" ? "tel" : "address-level2"} inputMode={step === "email" ? "email" : step === "phone" ? "tel" : "text"} placeholder={step === "city" ? "your city" : step === "email" ? "you@example.com" : "+1 212 555 0123 (optional)"} autoFocus />
        <button type="submit">send</button>{step === "phone" && <button type="button" className="choice-link" onClick={() => void save(false, "skip phone for now.")}>skip</button>}
      </form>}
      {step === "consent" && <div className="consent-choices"><p>By choosing yes, you agree to receive optional recurring marketing texts from Vento. Message frequency varies; message and data rates may apply. Reply STOP to opt out or HELP for help.</p><button className="choice-primary" onClick={() => void save(true, "yes, occasional texts are okay.")}>yes, text me</button><button className="choice-secondary" onClick={() => void save(false, "email only, please.")}>email only</button></div>}
      {error && <div className="conversation-error" role="alert"><span>{error}</span></div>}
      {step === "complete" && <div className="conversation-complete"><Link href="/join/continue">messaging options</Link><Link href="/">back home</Link></div>}
    </div>
  </section>;
}
