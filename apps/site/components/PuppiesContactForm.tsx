"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

interface Props {
  breederId?: string;
}

export function PuppiesContactForm({ breederId }: Props) {
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (breederId && supabaseBrowser) {
      const { error: err } = await supabaseBrowser
        .from("contact_messages")
        .insert({ breeder_id: breederId, contact, message });

      if (err) {
        setError("Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
    }

    setSent(true);
    setSubmitting(false);
  }

  if (sent) {
    return (
      <div className="puppies-form-success">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EC6B15" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="puppies-form-success-title">Thank you!</p>
        <p className="puppies-form-success-desc">We received your message and will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form className="puppies-form" onSubmit={handleSubmit}>
      <div className="puppies-form-field">
        <label className="puppies-form-label">Email or WhatsApp *</label>
        <input
          className="puppies-form-input"
          type="text"
          placeholder="your@email.com or +1 234 567 890"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      </div>
      <div className="puppies-form-field">
        <label className="puppies-form-label">Message *</label>
        <textarea
          className="puppies-form-input puppies-form-textarea"
          placeholder="Tell us about yourself and which litter you're interested in…"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: "#f87171", fontSize: "0.85rem", margin: 0 }}>{error}</p>}
      <button type="submit" className="puppies-form-btn" disabled={submitting}>
        {submitting ? "Sending…" : "Send Request"}
      </button>
    </form>
  );
}
