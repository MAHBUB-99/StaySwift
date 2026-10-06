import HotelImage from "@/components/hotel/HotelImage";
import Link from "next/link";

export default function TrendingDestinations({ destinations }) {
  if (destinations.length === 0) return null;
  return (
    <section className="container mt-14">
      <h2 className="text-2xl font-bold">Explore stays in trending destinations</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        {destinations.map((item) => (
          <Link
            key={item.city}
            href={`/hotels?destination=${encodeURIComponent(item.city)}`}
            className="card group overflow-hidden"
          >
            <div className="relative h-36 overflow-hidden md:h-44">
              <HotelImage
                src={item.image}
                alt={item.city}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="p-3">
              <p className="font-semibold group-hover:underline">{item.city}</p>
              <p className="text-sm text-gray-600">
                {item.count} {item.count === 1 ? "stay" : "stays"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
