"use client";

import { whatsappNumber } from "@/lib/commerce";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

interface ContactFormProps {
  settings: Record<string, string>;
}

export function ContactForm({ settings }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");
  const [followup, setFollowup] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Could not save your message.");
      const phone = whatsappNumber(settings.whatsapp || settings.phone || "");
      if (phone)
        setFollowup(
          `https://wa.me/${phone}?text=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`)}`,
        );
      setStatus("success");
      form.reset();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save your message. Please retry.",
      );
      setStatus("idle");
    }
  };

  return (
    <div className="sf-contact-grid">
      <div>
        <div className="sf-page-head">
          <h1>
            Let’s get your
            <br />
            project moving.
          </h1>
          <p>
            Questions about a product, compatibility or an order? Tell us what
            you have in mind.
          </p>
        </div>
        <div className="sf-contact-details">
          {settings.address && (
            <div>
              <MapPin size={21} />
              <div>
                <small>Find us</small>
                <span>{settings.address}</span>
              </div>
            </div>
          )}
          {settings.phone && (
            <div>
              <Phone size={21} />
              <div>
                <small>Call the store</small>
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </div>
            </div>
          )}
          {settings.email && (
            <div>
              <Mail size={21} />
              <div>
                <small>Email us</small>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="sf-contact-panel">
        <h2>Send us a message</h2>
        {error && (
          <p role="alert" className="sf-error">
            {error}
          </p>
        )}
        {status === "success" && (
          <p role="status" className="sf-success">
            Your message is saved for the store team.{" "}
            {followup && (
              <a href={followup} target="_blank" rel="noopener noreferrer">
                Continue on WhatsApp
              </a>
            )}
          </p>
        )}
        <form onSubmit={handleSubmit} className="sf-form">
          <div className="sf-form-pair">
            <label className="sf-field">
              Your name
              <input
                aria-label="Name"
                name="name"
                autoComplete="name"
                required
                placeholder="Full name"
              />
            </label>
            <label className="sf-field">
              Email address
              <input
                aria-label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label className="sf-field">
            Subject
            <input
              aria-label="Subject"
              name="subject"
              required
              placeholder="How can we help?"
            />
          </label>
          <label className="sf-field">
            Message
            <textarea
              aria-label="Message"
              name="message"
              required
              rows={5}
              placeholder="Tell us about the product or project…"
            />
          </label>
          <button
            type="submit"
            className="sf-btn"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Send size={17} />
            )}
            {status === "loading" ? "Sending…" : "Send message"}
          </button>
          <p className="sf-results-note">
            Please include your order reference if you’re asking about an
            existing order.
          </p>
        </form>
      </div>
    </div>
  );
}
