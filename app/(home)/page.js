import FeaturedStays from "@/components/home/FeaturedStays";
import Hero from "@/components/home/Hero";
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
      <Hero
        stayCount={destinations.reduce((total, item) => total + item.count, 0)}
        destinationCount={destinations.length}
      >
        <SearchForm destinations={destinations} />
      </Hero>

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
