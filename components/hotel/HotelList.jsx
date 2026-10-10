import Link from "next/link";
import HotelCard from "./HotelCard";
import { Icon } from "./icons";

const HotelList = ({ hotels, stay, amenityNames }) => {
  if (hotels.length === 0) {
    return (
      <div className="card px-6 py-14 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon name="pin" className="h-8 w-8" />
        </span>
        <p className="mt-5 text-xl font-bold">No properties match your search</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          Try another destination, remove some filters or choose different dates. Every
          StaySwift room includes free cancellation.
        </p>
        <Link href="/hotels" className="btn-primary mt-6">
          See all stays
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-5">
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
