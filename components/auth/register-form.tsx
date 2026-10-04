"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="sf-auth-card">
      <div className="sf-auth-icon">
        <UserPlus size={23} />
      </div>
      <h1>Make yourself at home.</h1>
      <p>Create an account to save your order details.</p>
      {error && (
        <div role="alert" className="sf-error">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="sf-form">
        <label className="sf-field">
          Full name
          <input
            aria-label="Name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </label>
        <label className="sf-field">
          Phone number
          <input
            aria-label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
            required
          />
        </label>
        <label className="sf-field">
          Email address
          <input
            aria-label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="sf-field">
          Password
          <input
            aria-label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </label>
        <button className="sf-btn" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 size={17} className="animate-spin" />}
          {isLoading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <div className="sf-auth-footer">
        Already have an account? <Link href="/login">Sign in</Link>
      </div>
    </div>
  );
}
