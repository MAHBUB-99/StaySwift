import FeaturedStays from "@/components/home/FeaturedStays";
import TrendingDestinations from "@/components/home/TrendingDestinations";
import WhyBook from "@/components/home/WhyBook";
import SearchForm from "@/components/search/SearchForm";
import { getDestinations, getFeaturedHotels } from "@/database/queries";

// The banner and search box should show even when the database is down.
async function loadHomeData() {
  try {
    const [destinations, featured] = await Promise.all([
      getDestinations(),
      getFeaturedHotels(4),
    ]);
    return { destinations, featured, failed: false };
  } catch (error) {
    console.error("Home page data failed to load:", error.message);
    return { destinations: [], featured: [], failed: true };
  }
}

export default async function Home() {
  const { destinations, featured, failed } = await loadHomeData();

  return (
    <>
      <section className="relative overflow-hidden bg-[url('/hero-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-navy/50" aria-hidden="true" />
        <div className="container relative pb-12 pt-14 md:pb-16 md:pt-20">
          <h1 className="max-w-2xl text-3xl font-bold text-white md:text-5xl">
            Find your next stay
          </h1>
          <p className="mt-3 text-lg text-white/90">
            {destinations.length > 0
              ? `Search hotels in ${destinations.length} destinations, with free cancellation on every room.`
              : "Search hotels, with free cancellation on every room."}
          </p>
          <div className="mt-8">
            <SearchForm destinations={destinations} />
          </div>
        </div>
      </section>

      {failed && (
        <p
          role="alert"
          className="container mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          We couldn&apos;t load destinations and top-rated stays right now. Please
          try again in a moment.
        </p>
      )}

      <TrendingDestinations destinations={destinations.slice(0, 8)} />
      <FeaturedStays hotels={featured} />
      <WhyBook />
    </>
  );
}
