import Link from "next/link";
import HotelCard from "./HotelCard";

const HotelList = ({ hotels, stay, amenityNames }) => {
  if (hotels.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-lg font-semibold">No properties match your search</p>
        <p className="mt-1 text-sm text-gray-600">
          Try another destination, fewer filters or different dates.
        </p>
        <Link href="/hotels" className="btn-secondary mt-5">
          See all stays
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {hotels.map((hotel, index) => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          stay={stay}
          amenityNames={amenityNames}
          priority={index === 0}
        />
      ))}
    </div>
  );
};

export default HotelList;
