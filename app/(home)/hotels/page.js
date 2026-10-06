import HotelList from "@/components/hotel/HotelList";
import Filters from "@/components/search/filter/Filters";
import SearchForm from "@/components/search/SearchForm";
import SortSelect from "@/components/search/sort/SortSelect";
import { getAmenities, getDestinations, searchHotels } from "@/database/queries";
import {
  formatDate,
  parseFilterParams,
  parseStayParams,
  travelersLabel,
} from "@/database/utils/stay";

export function generateMetadata({ searchParams }) {
  const destination = searchParams.destination?.trim();
  return { title: destination ? `Stays in ${destination}` : "Search stays" };
}

export default async function HotelListPage({ searchParams }) {
  const stay = parseStayParams(searchParams);
  const filters = parseFilterParams(searchParams);
  const [hotels, destinations, amenities] = await Promise.all([
    searchHotels(stay, filters),
    getDestinations(),
    getAmenities(),
  ]);
  const amenityNames = Object.fromEntries(
    amenities.map((amenity) => [amenity.id, amenity.name])
  );

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <div className="container py-4">
          <SearchForm
            key={JSON.stringify(stay)}
            destinations={destinations}
            initial={stay}
            keepFilters
            variant="compact"
          />
        </div>
      </section>

      <section className="container grid grid-cols-1 gap-6 py-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <Filters amenities={amenities} />
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">
                {stay.destination ? `Stays in ${stay.destination}` : "All stays"}
              </h1>
              <p className="text-sm text-gray-600">
                {hotels.length} {hotels.length === 1 ? "property" : "properties"}
                {stay.checkin &&
                  ` · ${formatDate(stay.checkin)} – ${formatDate(stay.checkout)}`}
                {` · ${travelersLabel(stay)}`}
              </p>
            </div>
            <SortSelect />
          </div>

          {!stay.checkin && (
            <p className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              Add your dates to see total prices and which rooms are available.
            </p>
          )}

          <HotelList hotels={hotels} stay={stay} amenityNames={amenityNames} />
        </div>
      </section>
    </>
  );
}
