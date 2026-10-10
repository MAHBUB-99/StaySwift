import { auth } from "@/auth";
import { AmenityIcon, Icon } from "@/components/hotel/icons";
import BookingCard from "@/components/hotel/details/BookingCard";
import ExpandableText from "@/components/hotel/details/ExpandableText";
import Gallery from "@/components/hotel/details/Gallery";
import HeaderBand from "@/components/hotel/details/HeaderBand";
import Reviews from "@/components/hotel/details/Reviews";
import RoomCard from "@/components/hotel/details/RoomCard";
import SectionHeading from "@/components/hotel/details/SectionHeading";
import SearchForm from "@/components/search/SearchForm";
import {
  getHotelById,
  getReviewEligibility,
  getReviewsForAHotel,
  getRoomOptionsForHotel,
  getUserByEmail,
} from "@/database/queries";
import { hqImage, parseStayParams, stayQuery } from "@/database/utils/stay";
import { notFound } from "next/navigation";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "amenities", label: "Amenities" },
  { id: "rooms", label: "Rooms" },
  { id: "reviews", label: "Reviews" },
  { id: "policies", label: "Policies" },
];

const POLICIES = [
  { icon: "clock", title: "Check-in", text: "From 3:00 PM" },
  { icon: "clock", title: "Check-out", text: "Before 11:00 AM" },
  {
    icon: "cancel",
    title: "Cancellation",
    text: "Free until the day before check-in, from your Trips page.",
  },
  {
    icon: "users",
    title: "Children",
    text: "Children are welcome. Every room needs at least one adult.",
  },
];

// Short labels shown on rooms; only claims that are true for every hotel.
const ROOM_BADGES = { standard: "Lowest price", suite: "Most space" };

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
  // Photos for the gallery; a hotel with no gallery still shows its main photo.
  const photos = hotel.gallery.length > 0 ? hotel.gallery : hotel.thumbNailUrl ? [hotel.thumbNailUrl] : [];
  const highlights = hotel.amenityDetails.slice(0, 6);

  return (
    <>
      <HeaderBand hotel={hotel} backHref={backHref} />

      <div className="container pb-8">
        <Gallery images={photos} name={hotel.name} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
          <div className="lg:col-start-2 lg:row-start-1">
            <BookingCard fromPrice={fromPrice} stay={stay} />
          </div>

          <div className="min-w-0 space-y-12 lg:col-start-1 lg:row-start-1">
            <nav
              aria-label="Hotel sections"
              className="sticky top-16 z-20 -mx-4 overflow-x-auto border-b border-gray-200 bg-surface/90 px-4 backdrop-blur"
            >
              <ul className="flex gap-6 text-sm font-semibold">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block whitespace-nowrap border-b-2 border-transparent py-3.5 transition-colors hover:border-primary hover:text-primary"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <section id="overview" className="scroll-mt-32">
              <SectionHeading kicker="Overview">About this property</SectionHeading>
              <div className="card space-y-4 p-6">
                {hotel.shortDescription && (
                  <p className="text-lg font-medium leading-8 text-navy">{hotel.shortDescription}</p>
                )}
                {hotel.overview && <ExpandableText text={hotel.overview} />}
                {highlights.length > 0 && (
                  <ul className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    {highlights.map((amenity) => (
                      <li
                        key={amenity.id}
                        className="flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-sm font-medium"
                      >
                        <AmenityIcon name={amenity.name} className="h-4 w-4 text-primary" />
                        {amenity.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section id="amenities" className="scroll-mt-32">
              <SectionHeading kicker="Facilities">Amenities</SectionHeading>
              {hotel.amenityDetails.length === 0 ? (
                <p className="text-gray-600">
                  This property hasn&apos;t listed its amenities yet.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {hotel.amenityDetails.map((amenity) => (
                    <li key={amenity.id} className="card flex gap-4 p-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <AmenityIcon name={amenity.name} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold">{amenity.name}</p>
                        <div className="mt-0.5 space-y-0.5 text-sm text-gray-600">
                          {amenity.hours && <p>{amenity.hours}</p>}
                          {amenity.price && (
                            <p className="font-medium text-gray-800">{amenity.price}</p>
                          )}
                          {amenity.instructions && <p>{amenity.instructions}</p>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section id="rooms" className="scroll-mt-32">
              <SectionHeading kicker="Stay with us">Choose your room</SectionHeading>
              <div id="availability" className="card mb-4 scroll-mt-32 p-4">
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
                <p className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                  Enter your dates to see availability and total prices.
                </p>
              )}
              <div className="space-y-4">
                {rooms.map((room, index) => {
                  const photo = photos[index + 1] ?? photos[0];
                  return (
                    <RoomCard
                      key={room.key}
                      room={room}
                      stay={stay}
                      image={hqImage(photo)}
                      fallbackImage={photo}
                      badge={ROOM_BADGES[room.key]}
                      reserveHref={`/hotels/${id}/payment?room=${room.key}&${query}`}
                    />
                  );
                })}
              </div>
            </section>

            <section id="reviews" className="scroll-mt-32">
              <SectionHeading kicker="Guest feedback">Guest reviews</SectionHeading>
              <Reviews
                hotel={hotel}
                reviews={reviews}
                eligibility={eligibility}
                loginHref={loginHref}
              />
            </section>

            <section id="policies" className="scroll-mt-32">
              <SectionHeading kicker="Good to know">Policies</SectionHeading>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {POLICIES.map((policy) => (
                  <div key={policy.title} className="card flex gap-4 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy/5 text-navy">
                      <Icon name={policy.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <dt className="font-semibold">{policy.title}</dt>
                      <dd className="mt-0.5 text-sm text-gray-600">{policy.text}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
