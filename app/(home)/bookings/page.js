import { auth } from "@/auth";
import TripCard from "@/components/user/booking/TripCard";
import { getTripsByUser, getUserByEmail } from "@/database/queries";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "Trips" };

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

const EMPTY_MESSAGES = {
  upcoming: "You have no upcoming trips.",
  past: "You have no past trips yet.",
  cancelled: "You have no cancelled trips.",
};

export default async function BookingsPage({ searchParams }) {
  const session = await auth();
  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/bookings")}`);
  }
  const user = await getUserByEmail(session.user.email);
  const trips = await getTripsByUser(user?.id);

  const tab = TABS.some((t) => t.key === searchParams.tab) ? searchParams.tab : "upcoming";
  const shown = trips.filter((trip) => trip.status === tab);
  // Upcoming trips read best soonest first; the others newest first.
  if (tab === "upcoming") shown.reverse();

  return (
    <div className="container py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Trips</h1>
          <p className="text-sm text-gray-600">Signed in as {session.user.email}</p>
        </div>
        <Link href="/hotels" className="btn-secondary">
          Book another stay
        </Link>
      </div>

      {searchParams.booked && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          Your booking is confirmed. You can see it below.
        </p>
      )}

      <nav aria-label="Trip status" className="mt-6 border-b border-gray-200">
        <ul className="flex gap-6 text-sm font-semibold">
          {TABS.map((t) => {
            const count = trips.filter((trip) => trip.status === t.key).length;
            return (
              <li key={t.key}>
                <Link
                  href={`/bookings?tab=${t.key}`}
                  aria-current={tab === t.key ? "page" : undefined}
                  className={`block border-b-2 py-3 ${
                    tab === t.key ? "border-primary text-navy" : "border-transparent text-gray-600 hover:text-navy"
                  }`}
                >
                  {t.label} ({count})
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 space-y-4">
        {shown.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="font-semibold">{EMPTY_MESSAGES[tab]}</p>
            <Link href="/hotels" className="btn-primary mt-4">
              Search stays
            </Link>
          </div>
        ) : (
          shown.map((trip) => <TripCard key={trip.id} trip={trip} />)
        )}
      </div>
    </div>
  );
}
