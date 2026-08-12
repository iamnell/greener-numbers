"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [consent, setConsent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      setMessage("Please confirm that you agree to receive the weekly brief.");
      return;
    }
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    setSending(true);
    setMessage("");
    try {
      const response = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, consent }) });
      const body = await response.json();
      setMessage(body.message);
      if (response.ok) {
        form.reset();
        setConsent(false);
      }
    } catch {
      setMessage("We could not save your subscription. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return <form className="newsletter-form" onSubmit={submit} noValidate>
    <label className="sr-only" htmlFor="newsletter-email">Email address</label>
    <input id="newsletter-email" name="email" type="email" required autoComplete="email" placeholder="Your email address" />
    <label className="newsletter-consent"><input type="checkbox" name="consent" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /> I agree to receive the weekly brief from Greener Numbers.</label>
    <button type="submit" disabled={sending}>{sending ? "Joining…" : "Subscribe ↗"}</button>
    <p className="form-message" role="status" aria-live="polite">{message}</p>
  </form>;
}
