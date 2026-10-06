import HotelImage from "@/components/hotel/HotelImage";
import { addDaysISO, formatDate, formatPrice } from "@/database/utils/stay";
import Link from "next/link";
import CancelBookingButton from "./CancelBookingButton";

const STATUS_STYLES = {
  upcoming: "bg-emerald-50 text-emerald-800",
  past: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-50 text-red-700",
};
const STATUS_LABELS = { upcoming: "Confirmed", past: "Completed", cancelled: "Cancelled" };

export default function TripCard({ trip }) {
  const { hotel, price } = trip;
  const year = { year: "numeric" };
  const guests =
    trip.adults != null
      ? `${trip.adults} adult${trip.adults === 1 ? "" : "s"}${
          trip.children ? `, ${trip.children} child${trip.children === 1 ? "" : "ren"}` : ""
        }`
      : null;

  return (
    <article className="card flex flex-col overflow-hidden sm:flex-row">
      <div className="relative h-40 shrink-0 sm:h-auto sm:w-56">
        <HotelImage src={hotel?.thumbNailUrl} alt={hotel?.name ?? "Hotel"} sizes="224px" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 md:flex-row md:justify-between">
        <div className="space-y-1">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[trip.status]}`}
          >
            {STATUS_LABELS[trip.status]}
          </span>
          {hotel ? (
            <Link href={`/hotels/${hotel.id}`} className="block text-lg font-bold hover:underline">
              {hotel.name}
            </Link>
          ) : (
            <p className="text-lg font-bold">Hotel no longer listed</p>
          )}
          <p className="text-sm text-gray-600">{hotel?.locationDescription ?? hotel?.city}</p>
          <p className="pt-1 text-sm font-medium">
            {formatDate(trip.checkin, year)} – {formatDate(trip.checkout, year)}
          </p>
          <p className="text-sm text-gray-600">
            {trip.roomName} · {trip.rooms} room{trip.rooms === 1 ? "" : "s"}
            {guests && ` · ${guests}`}
          </p>
          <p className="text-xs text-gray-500">
            Itinerary #{trip.id.slice(-8).toUpperCase()} · booked{" "}
            {formatDate(trip.bookedOn, year)}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end md:text-right">
          <details className="text-sm">
            <summary className="cursor-pointer list-none text-xl font-bold">
              {formatPrice(price.total)}
              <span className="block text-xs font-normal text-blue-700 underline">
                Price details
              </span>
            </summary>
            <dl className="mt-2 space-y-1 text-left md:min-w-[220px]">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">
                  {price.rooms} × {price.nights} night{price.nights === 1 ? "" : "s"}
                </dt>
                <dd>{formatPrice(price.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Taxes & fees</dt>
                <dd>{formatPrice(price.taxes)}</dd>
              </div>
            </dl>
          </details>
          {trip.canCancel && (
            <>
              <p className="text-xs text-emerald-700">
                Free cancellation until {formatDate(addDaysISO(trip.checkin, -1), year)}
              </p>
              <CancelBookingButton bookingId={trip.id} hotelName={hotel?.name ?? "this hotel"} />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
