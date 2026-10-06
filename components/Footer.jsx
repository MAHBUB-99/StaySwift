import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="container flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-bold">StaySwift</p>
          <p className="mt-1 max-w-sm text-sm text-gray-600">
            Hotels and places to stay, with free cancellation on every room.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="space-y-2">
            <p className="font-semibold">Stays</p>
            <Link href="/hotels" className="block text-gray-600 hover:underline">
              Search hotels
            </Link>
            <Link href="/bookings" className="block text-gray-600 hover:underline">
              Your trips
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Account</p>
            <Link href="/login" className="block text-gray-600 hover:underline">
              Sign in
            </Link>
            <Link href="/register" className="block text-gray-600 hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} StaySwift
      </div>
    </footer>
  );
}
