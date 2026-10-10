import { scoreLabel } from "@/database/utils/stay";
import Link from "next/link";
import SceneBackdrop from "@/components/ui/SceneBackdrop";
import { Icon } from "../icons";
import StarRating from "../StarRating";

// Title area in the same navy-to-teal, sunset-glow style as the home hero.
export default function HeaderBand({ hotel, backHref }) {
  const address = [hotel.address1, hotel.city, hotel.postalCode].filter(Boolean).join(", ");

  return (
    <header className="relative isolate overflow-hidden">
      <SceneBackdrop />

      <div className="container pb-12 pt-5 md:pb-16">
        <Link href={backHref} className="text-sm font-medium text-white/80 hover:text-white">
          ← All stays{hotel.city ? ` in ${hotel.city}` : ""}
        </Link>

        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="[&_span]:!text-amber-300">
              <StarRating stars={hotel.propertyCategory} />
            </div>
            <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              {hotel.name}
            </h1>
            <p className="mt-3 flex items-start gap-2 text-white/85">
              <Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <span>{address}</span>
            </p>
          </div>

          {hotel.score != null ? (
            <a
              href="#reviews"
              className="flex items-center gap-3 self-start rounded-2xl bg-white/12 p-3 pr-5 ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20 md:self-auto"
            >
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-500 text-2xl font-bold text-white">
                {hotel.score.toFixed(1)}
              </span>
              <span className="text-white">
                <span className="block text-lg font-semibold leading-tight">
                  {scoreLabel(hotel.score)}
                </span>
                <span className="text-sm text-white/80">
                  {hotel.reviewCount} {hotel.reviewCount === 1 ? "review" : "reviews"}
                </span>
              </span>
            </a>
          ) : (
            <p className="text-sm text-white/80">No ratings yet</p>
          )}
        </div>
      </div>
    </header>
  );
}
