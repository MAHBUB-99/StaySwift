import { formatPrice } from "@/database/utils/stay";
import Link from "next/link";
import HotelImage from "../HotelImage";
import { Icon } from "../icons";

export default function RoomCard({ room, image, fallbackImage, reserveHref, stay, badge }) {
  const hasDates = !!stay.checkin;
  const roomsLabel = `${stay.rooms} room${stay.rooms === 1 ? "" : "s"}`;
  const nightsLabel = `${stay.nights} night${stay.nights === 1 ? "" : "s"}`;
  const soldOut = hasDates && room.fits && !room.isAvailable;

  let action;
  if (!room.fits) {
    action = (
      <p className="text-sm font-medium text-gray-600">
        Sleeps {room.sleeps} per room. Add rooms for your group.
      </p>
    );
  } else if (!hasDates) {
    action = (
      <a href="#availability" className="btn-secondary">
        Select dates
      </a>
    );
  } else if (soldOut) {
    action = <p className="text-sm font-semibold text-red-600">Sold out for your dates</p>;
  } else {
    action = (
      <Link href={reserveHref} className="btn-primary">
        Reserve
      </Link>
    );
  }

  return (
    <article
      className={`card flex flex-col overflow-hidden transition-shadow hover:shadow-md sm:flex-row ${
        soldOut ? "opacity-75" : ""
      }`}
    >
      <div className="relative h-48 shrink-0 sm:h-auto sm:min-h-[220px] sm:w-60">
        <HotelImage
          src={image}
          fallbackSrc={fallbackImage}
          alt={room.name}
          sizes="(max-width: 640px) 100vw, 240px"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy shadow">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 lg:flex-row">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold">{room.name}</h3>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-700">
            <li className="flex items-center gap-1.5">
              <Icon name="users" className="h-4 w-4 text-gray-500" />
              Sleeps {room.sleeps}
            </li>
            <li className="flex items-center gap-1.5">
              <Icon name="bed" className="h-4 w-4 text-gray-500" />
              {room.beds}
            </li>
            <li className="flex items-center gap-1.5">
              <Icon name="size" className="h-4 w-4 text-gray-500" />
              {room.size}
            </li>
          </ul>
          <ul className="mt-3 grid grid-cols-1 gap-1.5 text-sm text-gray-700 sm:grid-cols-2">
            {room.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 shrink-0 text-emerald-600" />
                {feature}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-medium text-emerald-700">
            Free cancellation until the day before check-in
          </p>
          {hasDates && room.isAvailable && room.available <= 2 && (
            <p className="mt-1 text-sm font-semibold text-red-600">
              Only {room.available} left
            </p>
          )}
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-gray-100 pt-4 lg:w-48 lg:flex-col lg:items-end lg:justify-end lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 lg:text-right">
          <div>
            <p className="text-3xl font-bold tracking-tight">{formatPrice(room.pricePerNight)}</p>
            <p className="text-xs text-gray-600">per night</p>
            {room.price && (
              <p className="mt-1 text-sm">
                <span className="font-semibold">{formatPrice(room.price.total)} total</span>
                <span className="block text-xs text-gray-500">
                  {roomsLabel}, {nightsLabel}, incl. taxes & fees
                </span>
              </p>
            )}
          </div>
          {action}
        </div>
      </div>
    </article>
  );
}
