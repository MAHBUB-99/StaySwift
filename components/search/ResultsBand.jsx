import SceneBackdrop from "@/components/ui/SceneBackdrop";
import { formatDate, travelersLabel } from "@/database/utils/stay";

// Header of the search results page: title, summary and the search form.
export default function ResultsBand({ stay, count, children }) {
  const summary = [
    `${count} ${count === 1 ? "property" : "properties"}`,
    stay.checkin && `${formatDate(stay.checkin)} – ${formatDate(stay.checkout)}`,
    travelersLabel(stay),
  ].filter(Boolean);

  return (
    <section className="relative isolate">
      <SceneBackdrop waveClass="h-8 md:h-12" />
      <div className="container pb-14 pt-8 md:pb-16 md:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
          Search results
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-5xl">
          {stay.destination ? `Stays in ${stay.destination}` : "All stays"}
        </h1>
        <p className="mt-2 text-white/85">{summary.join(" · ")}</p>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
