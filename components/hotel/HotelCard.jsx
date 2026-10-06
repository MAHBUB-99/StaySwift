import { formatPrice, stayQuery } from "@/database/utils/stay";
import Link from "next/link";
import HotelImage from "./HotelImage";
import RatingBadge from "./RatingBadge";
import StarRating from "./StarRating";

const HotelCard = ({ hotel, stay, amenityNames, priority = false }) => {
  const query = stayQuery(stay);
  const href = `/hotels/${hotel.id}${query ? `?${query}` : ""}`;
  const amenities = hotel.amenities
    .map((id) => amenityNames[id])
    .filter(Boolean)
    .slice(0, 4);

  return (
    <article className="card flex flex-col overflow-hidden transition-shadow hover:shadow-md sm:flex-row">
      <Link
        href={href}
        className="relative h-52 shrink-0 sm:h-auto sm:min-h-[220px] sm:w-72"
        aria-label={hotel.name}
      >
        <HotelImage
          src={hotel.thumbNailUrl}
          alt={hotel.name}
          sizes="(max-width: 640px) 100vw, 288px"
          priority={priority}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:flex-row">
        <div className="min-w-0 flex-1">
          <Link href={href}>
            <h2 className="text-lg font-bold leading-snug hover:underline">
              {hotel.name}
            </h2>
          </Link>
          <p className="text-sm text-gray-600">
            {hotel.locationDescription ?? hotel.city}
          </p>
          <StarRating stars={hotel.propertyCategory} />
          {hotel.shortDescription && (
            <p className="mt-2 line-clamp-2 text-sm text-gray-700">
              {hotel.shortDescription}
            </p>
          )}
          {amenities.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {amenities.map((name) => (
                <li key={name} className="rounded-full bg-surface px-2.5 py-0.5 text-xs">
                  {name}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-sm font-medium text-emerald-700">
            Fully refundable
          </p>
          <div className="mt-3">
            <RatingBadge score={hotel.score} count={hotel.reviewCount} />
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-gray-100 pt-3 sm:w-44 sm:flex-col sm:justify-end sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 sm:text-right">
          {hotel.isSoldOut ? (
            <p className="text-sm font-semibold text-red-600">
              Sold out for your dates
            </p>
          ) : (
            <div>
              <p className="text-2xl font-bold">{formatPrice(hotel.fromPrice)}</p>
              <p className="text-xs text-gray-600">nightly</p>
              {hotel.price && (
                <>
                  <p className="mt-1 text-sm font-semibold">
                    {formatPrice(hotel.price.total)} total
                  </p>
                  <p className="text-xs text-gray-500">includes taxes & fees</p>
                </>
              )}
            </div>
          )}
          <Link href={href} className="btn-primary shrink-0">
            {hotel.isSoldOut ? "Details" : "View rooms"}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
