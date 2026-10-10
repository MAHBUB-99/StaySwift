// Golden-hour sea scene behind the home page search: the hero photo under a
// navy-to-sunset gradient, a dashed flight path with a plane, soft clouds and a
// wave edge that flows into the page. Purely decorative (aria-hidden); the
// animations are switched off for people who prefer reduced motion.

const TRUST_POINTS = ["Free cancellation", "Verified guest reviews", "Instant confirmation"];

function Scene() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Photo, slightly enlarged so the edges never show */}
      <div className="absolute inset-0 scale-105 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />

      {/* Deep navy at the top fading to teal, with a warm sunset glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/60 to-[#0f5c78]/70" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 88% 100%, rgba(255,106,40,0.55), transparent 70%), radial-gradient(45% 55% at 8% 0%, rgba(90,120,255,0.35), transparent 70%)",
        }}
      />

      {/* Sun */}
      <div className="absolute -right-24 -top-6 h-72 w-72 rounded-full bg-gradient-to-br from-amber-200 via-orange-400 to-primary opacity-80 blur-2xl motion-safe:animate-glow-pulse md:-right-10 md:top-0 lg:right-24 lg:top-4" />
      <div className="absolute right-4 top-20 hidden h-24 w-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-300 opacity-90 shadow-[0_0_80px_30px_rgba(255,170,90,0.45)] md:right-10 md:top-14 md:block lg:right-44 lg:top-16" />

      {/* Clouds */}
      <div className="absolute left-[8%] top-16 h-10 w-56 rounded-full bg-white/20 blur-xl motion-safe:animate-cloud-drift" />
      <div className="absolute left-[38%] top-40 h-8 w-72 rounded-full bg-white/15 blur-xl motion-safe:animate-cloud-drift-slow" />
      <div className="absolute right-[12%] top-56 hidden h-8 w-64 rounded-full bg-white/15 blur-xl motion-safe:animate-cloud-drift md:block" />

      {/* Flight path and plane */}
      <svg
        viewBox="0 0 1440 520"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="hero-path" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.68" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path
          d="M -20 420 C 300 120, 900 60, 1460 300"
          fill="none"
          stroke="url(#hero-path)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 14"
          className="motion-safe:animate-path-flow"
        />
        <g
          transform="translate(1122 192) rotate(102) scale(1.8) translate(-12 -12)"
          fill="#fff"
          opacity="0.95"
        >
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </g>
        {/* Starlike dots */}
        <g fill="#fff">
          <circle cx="160" cy="70" r="1.6" opacity="0.7" />
          <circle cx="420" cy="40" r="1.2" opacity="0.5" />
          <circle cx="760" cy="90" r="1.6" opacity="0.6" />
          <circle cx="980" cy="36" r="1.2" opacity="0.5" />
          <circle cx="1290" cy="84" r="1.6" opacity="0.7" />
        </g>
      </svg>

      {/* Fine film grain keeps the gradients from looking flat */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Layered waves that flow into the page background */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-16 w-full md:h-24"
      >
        <path
          d="M0 70 C 240 20, 480 110, 720 70 S 1200 20, 1440 66 L1440 120 L0 120 Z"
          fill="#F4F5F8"
          fillOpacity="0.35"
        />
        <path
          d="M0 88 C 260 50, 520 118, 800 84 S 1240 56, 1440 90 L1440 120 L0 120 Z"
          fill="#F4F5F8"
          fillOpacity="0.6"
        />
        <path
          d="M0 104 C 300 84, 600 122, 900 104 S 1260 90, 1440 106 L1440 120 L0 120 Z"
          fill="#F4F5F8"
        />
      </svg>
    </div>
  );
}

export default function Hero({ stayCount = 0, destinationCount = 0, children }) {
  return (
    <section className="relative isolate overflow-hidden">
      <Scene />
      <div className="container relative pb-24 pt-12 md:pb-32 md:pt-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/95 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {stayCount > 0
            ? `${stayCount} handpicked stays in ${destinationCount} destinations`
            : "Hotels, villas and apartments"}
        </p>

        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
          Find your next{" "}
          <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-primary bg-clip-text text-transparent">
            stay
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90">
          Compare rooms, see the total price for your dates and book in minutes.
        </p>

        <div className="mt-8">{children}</div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
          {TRUST_POINTS.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-amber-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12l5 5L20 6" />
              </svg>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
