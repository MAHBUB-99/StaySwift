import { scoreLabel } from "@/database/utils/stay";

export default function RatingBadge({ score, count, size = "md" }) {
  if (score == null) {
    return <p className="text-sm text-gray-500">No ratings yet</p>;
  }
  const large = size === "lg";
  return (
    <div className="flex items-center gap-2">
      <span
        className={`rounded-md bg-emerald-700 font-bold text-white ${
          large ? "px-2.5 py-1 text-lg" : "px-2 py-0.5 text-sm"
        }`}
      >
        {score.toFixed(1)}
      </span>
      <span className={large ? "text-lg font-semibold" : "text-sm font-semibold"}>
        {scoreLabel(score)}
      </span>
      {count != null && (
        <span className="text-sm text-gray-600">
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
}
