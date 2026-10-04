"use client";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not subscribe. Please try again.");
      setStatus("success");
      setMessage("You’re subscribed. Thank you!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not subscribe. Please try again.",
      );
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="sf-newsletter-form">
        <input
          className="sf-input"
          type="email"
          autoComplete="email"
          aria-label="Newsletter email"
          placeholder="Your email address"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "success") setStatus("idle");
          }}
          required
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="sf-btn"
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? (
            <Loader2 className="animate-spin" size={16} />
          ) : status === "success" ? (
            <Check size={16} />
          ) : null}
          {status === "success"
            ? "Subscribed"
            : status === "loading"
              ? "Subscribing…"
              : "Subscribe"}
        </button>
      </form>
      {message && (
        <p
          role={status === "error" ? "alert" : "status"}
          className={status === "error" ? "sf-error" : "sf-live-message"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
