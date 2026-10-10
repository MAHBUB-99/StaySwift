import { formatPrice, scoreLabel, stayQuery } from "@/database/utils/stay";
import Link from "next/link";
import HotelImage from "./HotelImage";
import { AmenityIcon, Icon } from "./icons";

const MAX_AMENITIES = 4;

const HotelCard = ({ hotel, stay, amenityNames, priority = false }) => {
  const query = stayQuery(stay);
  const href = `/hotels/${hotel.id}${query ? `?${query}` : ""}`;
  const allAmenities = hotel.amenities.map((id) => amenityNames[id]).filter(Boolean);
  const amenities = allAmenities.slice(0, MAX_AMENITIES);
  const moreAmenities = allAmenities.length - amenities.length;

  return (
    <article className="group card overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:shadow-xl md:flex">
      <Link
        href={href}
        className="relative block h-56 shrink-0 overflow-hidden md:h-auto md:min-h-[260px] md:w-80"
        aria-label={`${hotel.name}, view details`}
      >
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          <HotelImage
            src={hotel.thumbNailUrl}
            alt={hotel.name}
            sizes="(max-width: 768px) 100vw, 320px"
            priority={priority}
          />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy shadow">
          <span className="text-amber-500">★</span> {hotel.propertyCategory}-star
        </span>
        {hotel.isSoldOut && (
          <span className="absolute inset-0 grid place-items-center bg-navy/55 text-lg font-bold text-white">
            Sold out for your dates
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="min-w-0 flex-1 p-5">
          <Link href={href}>
            <h2 className="text-xl font-bold leading-snug tracking-tight hover:text-primary">
              {hotel.name}
            </h2>
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
            <Icon name="pin" className="h-4 w-4 shrink-0 text-primary" />
            {hotel.locationDescription ?? hotel.city}
          </p>

          {hotel.shortDescription && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-700">
              {hotel.shortDescription}
            </p>
          )}

          {amenities.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {amenities.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium"
                >
                  <AmenityIcon name={name} className="h-3.5 w-3.5 text-primary" />
                  {name}
                </li>
              ))}
              {moreAmenities > 0 && (
                <li className="rounded-full px-1 py-1 text-xs font-medium text-gray-500">
                  +{moreAmenities} more
                </li>
              )}
            </ul>
          )}

          <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
            <Icon name="cancel" className="h-4 w-4" />
            Free cancellation
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-gray-100 p-5 lg:w-56 lg:flex-col lg:items-end lg:border-l lg:border-t-0">
          {hotel.score != null ? (
            <div className="flex items-center gap-3 lg:flex-row-reverse">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600 text-xl font-bold text-white">
                {hotel.score.toFixed(1)}
              </span>
              <span className="lg:text-right">
                <span className="block font-semibold leading-tight">{scoreLabel(hotel.score)}</span>
                <span className="text-xs text-gray-500">
                  {hotel.reviewCount} {hotel.reviewCount === 1 ? "review" : "reviews"}
                </span>
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No ratings yet</p>
          )}

          <div className="text-right">
            {!hotel.isSoldOut && (
              <>
                <p className="text-3xl font-bold tracking-tight">{formatPrice(hotel.fromPrice)}</p>
                <p className="text-xs text-gray-600">per night</p>
                {hotel.price && (
                  <p className="mt-1 text-sm">
                    <span className="font-semibold">{formatPrice(hotel.price.total)} total</span>
                    <span className="block text-xs text-gray-500">incl. taxes & fees</span>
                  </p>
                )}
              </>
            )}
            <Link href={href} className="btn-primary mt-3">
              {hotel.isSoldOut ? "See details" : "View rooms"}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
