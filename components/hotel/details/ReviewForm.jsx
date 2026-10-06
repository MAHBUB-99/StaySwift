"use client";

import { apiError } from "@/components/api-error";
import { toScore } from "@/database/utils/stay";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MIN_LENGTH = 10;

export default function ReviewForm({ hotelId }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!rating) {
      setError("Choose a rating.");
      return;
    }
    if (text.trim().length < MIN_LENGTH) {
      setError(`Write at least ${MIN_LENGTH} characters.`);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/hotels/${hotelId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review: text.trim() }),
      });
      if (res.status === 201) {
        setText("");
        setRating(0);
        router.refresh();
      } else {
        setError(await apiError(res));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-3 p-5">
      <h3 className="font-bold">Write a review</h3>
      <div>
        <p className="mb-1 text-sm font-medium">Your rating</p>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${toScore(value)} out of 10`}
              onClick={() => setRating(value)}
              className={`text-2xl leading-none ${
                value <= rating ? "text-amber-500" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 self-center text-sm text-gray-600">
              {toScore(rating)}/10
            </span>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="review-text" className="mb-1 block text-sm font-medium">
          Your review
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={4}
          maxLength={2000}
          className="input"
          placeholder="What did you like? What could be better?"
        />
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
