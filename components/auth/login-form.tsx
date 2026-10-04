"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Loader2 } from "lucide-react";

export function LoginForm() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
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
        <User size={23} />
      </div>
      <h1>Welcome back.</h1>
      <p>Sign in to your Binary Electronics account.</p>
      {error && (
        <div role="alert" className="sf-error">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="sf-form">
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
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </label>
        <Link href="/contact" className="sf-text-link">
          Need help signing in?
        </Link>
        <button className="sf-btn" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 size={17} className="animate-spin" />}
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <div className="sf-auth-footer">
        New to Binary? <Link href="/register">Create an account</Link>
      </div>
    </div>
  );
}
