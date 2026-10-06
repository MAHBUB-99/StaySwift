import { formatPrice } from "@/database/utils/stay";
import Link from "next/link";
import HotelImage from "../HotelImage";

export default function RoomCard({ room, image, reserveHref, stay }) {
  const hasDates = !!stay.checkin;
  const roomsLabel = `${stay.rooms} room${stay.rooms === 1 ? "" : "s"}`;
  const nightsLabel = `${stay.nights} night${stay.nights === 1 ? "" : "s"}`;

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
  } else if (!room.isAvailable) {
    action = <p className="text-sm font-semibold text-red-600">Sold out for your dates</p>;
  } else {
    action = (
      <Link href={reserveHref} className="btn-primary">
        Reserve
      </Link>
    );
  }

  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="relative h-44">
        <HotelImage src={image} alt={room.name} sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold">{room.name}</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          <li>Sleeps {room.sleeps}</li>
          <li>{room.beds}</li>
          <li>{room.size}</li>
          {room.features.map((feature) => (
            <li key={feature}>{feature}</li>
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

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-2xl font-bold">{formatPrice(room.pricePerNight)}</p>
            <p className="text-xs text-gray-600">nightly</p>
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
