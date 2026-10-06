import HotelImage from "@/components/hotel/HotelImage";
import RatingBadge from "@/components/hotel/RatingBadge";
import StarRating from "@/components/hotel/StarRating";
import { formatPrice } from "@/database/utils/stay";
import Link from "next/link";

export default function FeaturedStays({ hotels }) {
  if (hotels.length === 0) return null;
  return (
    <section className="container mt-14">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold">Top-rated stays</h2>
        <Link href="/hotels?sort=rating" className="link text-sm">
          See all
        </Link>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {hotels.map((hotel) => (
          <Link key={hotel.id} href={`/hotels/${hotel.id}`} className="card group overflow-hidden">
            <div className="relative h-48">
              <HotelImage
                src={hotel.thumbNailUrl}
                alt={hotel.name}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="space-y-1 p-4">
              <p className="line-clamp-1 font-semibold group-hover:underline">{hotel.name}</p>
              <p className="text-sm text-gray-600">{hotel.city}</p>
              <StarRating stars={hotel.propertyCategory} />
              <RatingBadge score={hotel.score} count={hotel.reviewCount} />
              <p className="pt-2 text-sm">
                From <span className="text-lg font-bold">{formatPrice(hotel.fromPrice)}</span>{" "}
                <span className="text-gray-600">nightly</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
