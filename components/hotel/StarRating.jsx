export default function StarRating({ stars }) {
  if (!stars) return null;
  return (
    <span
      className="text-sm tracking-tight text-amber-500"
      role="img"
      aria-label={`${stars}-star property`}
    >
      {"★".repeat(stars)}
    </span>
  );
}
