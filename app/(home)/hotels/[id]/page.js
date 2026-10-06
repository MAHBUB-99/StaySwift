import { auth } from "@/auth";
import RatingBadge from "@/components/hotel/RatingBadge";
import StarRating from "@/components/hotel/StarRating";
import Gallery from "@/components/hotel/details/Gallery";
import Reviews from "@/components/hotel/details/Reviews";
import RoomCard from "@/components/hotel/details/RoomCard";
import SearchForm from "@/components/search/SearchForm";
import {
  getHotelById,
  getReviewEligibility,
  getReviewsForAHotel,
  getRoomOptionsForHotel,
  getUserByEmail,
} from "@/database/queries";
import { formatPrice, parseStayParams, stayQuery } from "@/database/utils/stay";
import Link from "next/link";
import { notFound } from "next/navigation";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "amenities", label: "Amenities" },
  { id: "rooms", label: "Rooms" },
  { id: "reviews", label: "Reviews" },
  { id: "policies", label: "Policies" },
];

export async function generateMetadata({ params: { id } }) {
  const hotel = await getHotelById(id);
  return { title: hotel?.name ?? "Hotel not found" };
}

export default async function HotelDetailsPage({ params: { id }, searchParams }) {
  const stay = parseStayParams(searchParams);
  const hotel = await getHotelById(id);
  if (!hotel) {
    notFound();
  }

  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);
  const [rooms, reviews, eligibility] = await Promise.all([
    getRoomOptionsForHotel(hotel, stay),
    getReviewsForAHotel(id),
    getReviewEligibility(user?.id, id),
  ]);

  const query = stayQuery(stay);
  const backHref = `/hotels?destination=${encodeURIComponent(hotel.city ?? "")}${
    query ? `&${query}` : ""
  }`;
  const loginHref = `/login?callbackUrl=${encodeURIComponent(`/hotels/${id}#reviews`)}`;
  const fromPrice = Math.min(...rooms.map((room) => room.pricePerNight));

  return (
    <div className="container space-y-8 py-6">
      <Link href={backHref} className="link text-sm">
        ← See all properties{hotel.city ? ` in ${hotel.city}` : ""}
      </Link>

      <Gallery images={hotel.gallery} name={hotel.name} />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <StarRating stars={hotel.propertyCategory} />
          <p className="mt-1 text-gray-600">
            {[hotel.address1, hotel.city, hotel.postalCode].filter(Boolean).join(", ")}
          </p>
          <div className="mt-3">
            <RatingBadge score={hotel.score} count={hotel.reviewCount} />
          </div>
        </div>
        <div className="md:text-right">
          <p className="text-sm text-gray-600">From</p>
          <p className="text-3xl font-bold">{formatPrice(fromPrice)}</p>
          <p className="text-sm text-gray-600">nightly</p>
          <a href="#rooms" className="btn-primary mt-3">
            Select a room
          </a>
        </div>
      </div>

      <nav
        aria-label="Hotel sections"
        className="sticky top-16 z-20 -mx-4 overflow-x-auto border-b border-gray-200 bg-surface/95 px-4 backdrop-blur"
      >
        <ul className="flex gap-6 text-sm font-semibold">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block whitespace-nowrap border-b-2 border-transparent py-3 hover:border-navy"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="overview" className="scroll-mt-32">
        <h2 className="text-2xl font-bold">About this property</h2>
        {hotel.shortDescription && (
          <p className="mt-3 font-medium text-gray-800">{hotel.shortDescription}</p>
        )}
        {hotel.overview && (
          <p className="mt-3 whitespace-pre-line leading-7 text-gray-700">{hotel.overview}</p>
        )}
      </section>

      <section id="amenities" className="scroll-mt-32">
        <h2 className="text-2xl font-bold">Amenities</h2>
        {hotel.amenityDetails.length === 0 ? (
          <p className="mt-3 text-gray-600">
            This property hasn&apos;t listed its amenities yet.
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hotel.amenityDetails.map((amenity) => (
              <li key={amenity.id} className="card p-4">
                <p className="font-semibold">{amenity.name}</p>
                <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                  {amenity.hours && <p>Hours: {amenity.hours}</p>}
                  {amenity.price && <p>Price: {amenity.price}</p>}
                  {amenity.instructions && <p>{amenity.instructions}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="rooms" className="scroll-mt-32 space-y-4">
        <h2 className="text-2xl font-bold">Choose your room</h2>
        <div id="availability" className="card scroll-mt-32 p-4">
          <SearchForm
            key={JSON.stringify(stay)}
            initial={stay}
            action={`/hotels/${id}`}
            hash="#rooms"
            showDestination={false}
            variant="compact"
          />
        </div>
        {!stay.checkin && (
          <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            Enter your dates to see availability and total prices.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {rooms.map((room, index) => (
            <RoomCard
              key={room.key}
              room={room}
              stay={stay}
              image={hotel.gallery?.[index + 1] ?? hotel.thumbNailUrl}
              reserveHref={`/hotels/${id}/payment?room=${room.key}&${query}`}
            />
          ))}
        </div>
      </section>

      <section id="reviews" className="scroll-mt-32 space-y-4">
        <h2 className="text-2xl font-bold">Guest reviews</h2>
        <Reviews
          hotel={hotel}
          reviews={reviews}
          eligibility={eligibility}
          loginHref={loginHref}
        />
      </section>

      <section id="policies" className="scroll-mt-32">
        <h2 className="text-2xl font-bold">Policies</h2>
        <dl className="card mt-4 grid grid-cols-1 gap-4 p-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold">Check-in</dt>
            <dd className="text-gray-700">From 3:00 PM</dd>
          </div>
          <div>
            <dt className="font-semibold">Check-out</dt>
            <dd className="text-gray-700">Before 11:00 AM</dd>
          </div>
          <div>
            <dt className="font-semibold">Cancellation</dt>
            <dd className="text-gray-700">
              Free cancellation until the day before check-in, from your Trips page.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Children</dt>
            <dd className="text-gray-700">
              Children are welcome. Every room needs at least one adult.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
