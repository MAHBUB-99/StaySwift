import { auth } from "@/auth";
import Link from "next/link";
import Logout from "./auth/Logout";

const Navbar = async ({ minimal = false }) => {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" aria-label="StaySwift home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-bold text-white">
            S
          </span>
          <span className="text-xl font-bold tracking-tight text-navy">
            StaySwift
          </span>
        </Link>

        {!minimal && (
          <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
            <Link
              href="/hotels"
              className="hidden rounded-full px-4 py-2 hover:bg-surface sm:inline-block"
            >
              Stays
            </Link>
            <Link
              href="/bookings"
              className="rounded-full px-4 py-2 hover:bg-surface"
            >
              Trips
            </Link>
            {session?.user ? (
              <div className="flex items-center gap-2 pl-2">
                <span className="hidden text-gray-600 md:inline">
                  Hi, {firstName}
                </span>
                <Logout />
              </div>
            ) : (
              <Link href="/login" className="btn-primary !px-5 !py-2">
                Sign in
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
