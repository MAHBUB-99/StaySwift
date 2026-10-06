import { formatDate, scoreLabel } from "@/database/utils/stay";
import Link from "next/link";
import RatingBadge from "../RatingBadge";
import ReviewForm from "./ReviewForm";

const ELIGIBILITY_MESSAGES = {
  reviewed: "Thanks, you've already reviewed this property.",
  "no-stay": "Only guests who have stayed here can write a review.",
};

export default function Reviews({ hotel, reviews, eligibility, loginHref }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
      <div className="space-y-4">
        <div className="card p-5">
          <RatingBadge score={hotel.score} size="lg" />
          <p className="mt-2 text-sm text-gray-600">
            Based on {hotel.reviewCount} verified{" "}
            {hotel.reviewCount === 1 ? "review" : "reviews"}
          </p>
        </div>

        {eligibility.eligible ? (
          <ReviewForm hotelId={hotel.id} />
        ) : eligibility.reason === "signin" ? (
          <p className="text-sm">
            <Link href={loginHref} className="link">
              Sign in
            </Link>{" "}
            to review a property you stayed at.
          </p>
        ) : (
          <p className="text-sm text-gray-600">{ELIGIBILITY_MESSAGES[eligibility.reason]}</p>
        )}
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="card p-5 text-sm text-gray-600">
            No reviews yet. Guests can review this property after their stay.
          </p>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="card p-5">
              {review.score != null && (
                <p className="font-bold">
                  {review.score}/10 {scoreLabel(review.score)}
                </p>
              )}
              <p className="mt-2 whitespace-pre-line text-gray-800">{review.text}</p>
              <p className="mt-3 text-sm text-gray-600">
                {review.author} ·{" "}
                {formatDate(review.date, { weekday: undefined, year: "numeric" })}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
