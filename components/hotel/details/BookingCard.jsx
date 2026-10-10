import {
  formatDate,
  formatPrice,
  travelersLabel,
} from "@/database/utils/stay";
import { Icon } from "../icons";

const PERKS = [
  { icon: "cancel", text: "Free cancellation until the day before check-in" },
  { icon: "shield", text: "Instant confirmation" },
  { icon: "check", text: "Taxes and fees shown before you pay" },
];

// Price summary that stays in view beside the page content on large screens.
export default function BookingCard({ fromPrice, stay }) {
  const year = { year: "numeric" };
  return (
    <aside className="card overflow-hidden lg:sticky lg:top-24">
      <div className="bg-gradient-to-br from-navy to-[#173a63] p-5 text-white">
        <p className="text-sm text-white/75">From</p>
        <p className="mt-0.5 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight">{formatPrice(fromPrice)}</span>
          <span className="text-sm text-white/75">per night</span>
        </p>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-xl bg-surface px-4 py-3 text-sm">
          {stay.checkin ? (
            <>
              <p className="font-semibold">
                {formatDate(stay.checkin)} – {formatDate(stay.checkout, year)}
              </p>
              <p className="text-gray-600">
                {stay.nights} night{stay.nights === 1 ? "" : "s"} · {travelersLabel(stay)}
              </p>
            </>
          ) : (
            <p className="text-gray-600">Add your dates to see availability and total prices.</p>
          )}
        </div>

        <a href="#rooms" className="btn-primary w-full py-3 text-base">
          {stay.checkin ? "See rooms and prices" : "Choose dates and room"}
        </a>

        <ul className="space-y-2.5 text-sm text-gray-700">
          {PERKS.map((perk) => (
            <li key={perk.text} className="flex items-start gap-2.5">
              <Icon name={perk.icon} className="mt-0.5 h-[18px] w-[18px] shrink-0 text-emerald-600" />
              {perk.text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
