import HotelImage from "@/components/hotel/HotelImage";
import {
  addDaysISO,
  formatDate,
  formatPrice,
  travelersLabel,
} from "@/database/utils/stay";

export default function PriceSummary({ hotel, room, stay, price }) {
  const year = { year: "numeric" };
  return (
    <aside className="card overflow-hidden lg:sticky lg:top-24">
      <div className="relative h-36">
        <HotelImage src={hotel.thumbNailUrl} alt={hotel.name} sizes="400px" />
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="font-bold">{hotel.name}</p>
          <p className="text-sm text-gray-600">{hotel.locationDescription ?? hotel.city}</p>
        </div>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Room</dt>
            <dd className="font-medium">{room.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Check-in</dt>
            <dd className="font-medium">{formatDate(stay.checkin, year)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Check-out</dt>
            <dd className="font-medium">{formatDate(stay.checkout, year)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Guests</dt>
            <dd className="font-medium">{travelersLabel(stay)}</dd>
          </div>
        </dl>
        <dl className="space-y-1 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">
              {price.rooms} room × {price.nights} night{price.nights === 1 ? "" : "s"} ×{" "}
              {formatPrice(price.pricePerNight)}
            </dt>
            <dd>{formatPrice(price.subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Taxes & fees</dt>
            <dd>{formatPrice(price.taxes)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 text-base font-bold">
            <dt>Total</dt>
            <dd>{formatPrice(price.total)}</dd>
          </div>
        </dl>
        <p className="text-sm font-medium text-emerald-700">
          Free cancellation until {formatDate(addDaysISO(stay.checkin, -1), year)}
          {" "}(the day before check-in).
        </p>
      </div>
    </aside>
  );
}
