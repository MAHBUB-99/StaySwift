import HotelList from "@/components/hotel/HotelList";
import ActiveFilters from "@/components/search/filter/ActiveFilters";
import Filters from "@/components/search/filter/Filters";
import ResultsBand from "@/components/search/ResultsBand";
import SearchForm from "@/components/search/SearchForm";
import SortSelect from "@/components/search/sort/SortSelect";
import { getAmenities, getDestinations, searchHotels } from "@/database/queries";
import { parseFilterParams, parseStayParams } from "@/database/utils/stay";

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
      <ResultsBand stay={stay} count={hotels.length}>
        <SearchForm
          key={JSON.stringify(stay)}
          destinations={destinations}
          initial={stay}
          keepFilters
        />
      </ResultsBand>

      <section className="container grid grid-cols-1 gap-6 pb-10 pt-4 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-8">
        <aside className="lg:self-start">
          <Filters amenities={amenities} />
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-semibold">
              {hotels.length} {hotels.length === 1 ? "property" : "properties"} found
            </p>
            <SortSelect />
          </div>

          <ActiveFilters amenities={amenities} />

          {!stay.checkin && hotels.length > 0 && (
            <p className="mb-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              <span aria-hidden="true" className="mt-px">
                📅
              </span>
              Add your dates to see total prices and which rooms are available.
            </p>
          )}

          <HotelList hotels={hotels} stay={stay} amenityNames={amenityNames} />
        </div>
      </section>
    </>
  );
}
