"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/app/(customer)/product/[slug]/actions";

interface ReviewFormProps {
  productId: string;
  productSlug: string;
  loggedInName?: string;
}

export function ReviewForm({
  productId,
  productSlug,
  loggedInName,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setStatus("error");
      setMessage("Please select a rating.");
      return;
    }

    setStatus("loading");
    try {
      const result = await submitReview({
        productId,
        productSlug,
        rating,
        comment,
        reviewerName,
        honeypot,
      });

      if ("error" in result && result.error) {
        setStatus("error");
        setMessage(result.error);
        return;
      }

      setStatus("success");
      setMessage("Thank you! Your review is pending approval by the store.");
      setRating(0);
      setComment("");
      setReviewerName("");
    } catch {
      setStatus("error");
      setMessage("Could not submit your review. Please retry.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="sf-review-form sf-form">
      <div>
        <h3>Write a review</h3>
        <p>Your review appears after the store approves it.</p>
      </div>
      <div className="sf-review-stars" aria-label="Product rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
            aria-pressed={rating === value}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              size={25}
              fill={value <= (hover || rating) ? "currentColor" : "none"}
            />
          </button>
        ))}
        {rating > 0 && <span>{rating} / 5</span>}
      </div>
      {!loggedInName && (
        <label className="sf-field">
          Your name (optional)
          <input
            value={reviewerName}
            onChange={(event) => setReviewerName(event.target.value)}
            maxLength={60}
            placeholder="Your name"
            autoComplete="name"
          />
        </label>
      )}
      <label className="sf-field">
        Your review
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="Share your experience with this product…"
        />
      </label>
      <input
        type="text"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        hidden
        aria-hidden
      />
      {message && (
        <p
          role={status === "error" ? "alert" : "status"}
          className={status === "error" ? "sf-error" : "sf-success"}
        >
          {message}
        </p>
      )}
      <button type="submit" className="sf-btn" disabled={status === "loading"}>
        {status === "loading" ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
