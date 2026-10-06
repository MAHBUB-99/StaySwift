import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container grid min-h-[60vh] place-items-center py-16 text-center">
        <div>
          <p className="text-sm font-semibold text-primary">404</p>
          <h1 className="mt-2 text-3xl font-bold">We couldn&apos;t find that page</h1>
          <p className="mt-2 text-gray-600">
            The hotel or page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/hotels" className="btn-primary mt-6">
            Search stays
          </Link>
        </div>
      </main>
    </>
  );
}
