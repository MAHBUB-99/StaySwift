import Link from "next/link";

// Gradient plane mark with a two-tone wordmark.
export default function Logo({ className = "" }) {
  return (
    <Link
      href="/"
      aria-label="StaySwift home"
      className={`group flex items-center gap-2.5 ${className}`}
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary via-orange-500 to-amber-400 shadow-md shadow-primary/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 rotate-45 text-white"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </span>
      <span className="text-xl font-extrabold tracking-tight text-navy">
        Stay
        <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
          Swift
        </span>
      </span>
    </Link>
  );
}
