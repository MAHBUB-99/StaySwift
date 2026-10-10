import { formatDate, scoreLabel } from "@/database/utils/stay";
import Link from "next/link";
import ReviewForm from "./ReviewForm";

const ELIGIBILITY_MESSAGES = {
  reviewed: "Thanks, you've already reviewed this property.",
  "no-stay": "Only guests who have stayed here can write a review.",
};

const STAR_ROWS = [5, 4, 3, 2, 1];

function ScoreSummary({ hotel, reviews }) {
  const total = reviews.length;
  const counts = Object.fromEntries(
    STAR_ROWS.map((star) => [star, reviews.filter((r) => r.rating === star).length])
  );

  return (
    <div className="card grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="text-center sm:text-left">
        <span className="inline-grid h-20 w-20 place-items-center rounded-2xl bg-emerald-600 text-4xl font-bold text-white">
          {hotel.score != null ? hotel.score.toFixed(1) : "–"}
        </span>
        <p className="mt-2 text-lg font-semibold">{scoreLabel(hotel.score)}</p>
        <p className="text-sm text-gray-600">
          {hotel.reviewCount} verified {hotel.reviewCount === 1 ? "review" : "reviews"}
        </p>
      </div>

      <ul className="space-y-2" aria-label="Reviews by rating">
        {STAR_ROWS.map((star) => {
          const share = total ? (counts[star] / total) * 100 : 0;
          return (
            <li key={star} className="flex items-center gap-3 text-sm">
              <span className="w-10 shrink-0 text-gray-700">{star} ★</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-primary"
                  style={{ width: `${share}%` }}
                />
              </span>
              <span className="w-6 shrink-0 text-right text-gray-600">{counts[star]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Reviews({ hotel, reviews, eligibility, loginHref }) {
  return (
    <div className="space-y-5">
      <ScoreSummary hotel={hotel} reviews={reviews} />

      {eligibility.eligible ? (
        <ReviewForm hotelId={hotel.id} />
      ) : eligibility.reason === "signin" ? (
        <p className="rounded-xl bg-white px-5 py-4 text-sm ring-1 ring-black/5">
          <Link href={loginHref} className="link">
            Sign in
          </Link>{" "}
          to review a property you stayed at.
        </p>
      ) : (
        <p className="rounded-xl bg-white px-5 py-4 text-sm text-gray-600 ring-1 ring-black/5">
          {ELIGIBILITY_MESSAGES[eligibility.reason]}
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="card p-5 text-sm text-gray-600">
          No reviews yet. Guests can review this property after their stay.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="card flex flex-col p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-sm font-bold text-white">
                  {review.author.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{review.author}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(review.date, { weekday: undefined, year: "numeric" })}
                  </p>
                </div>
                {review.score != null && (
                  <span className="ml-auto rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700">
                    {review.score.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="mt-3 whitespace-pre-line text-gray-800">{review.text}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
