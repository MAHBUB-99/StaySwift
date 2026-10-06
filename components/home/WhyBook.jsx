const REASONS = [
  {
    title: "Free cancellation",
    text: "Change of plans? Cancel any booking for free until the day before check-in.",
    icon: "M4 12l5 5L20 6",
  },
  {
    title: "Rooms for every group",
    text: "Pick standard rooms, deluxe rooms or suites, up to 8 rooms at once.",
    icon: "M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 18h18M7 10V7a2 2 0 012-2h6a2 2 0 012 2v3",
  },
  {
    title: "Real guest reviews",
    text: "Reviews come only from guests who booked and stayed.",
    icon: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z",
  },
  {
    title: "All your trips in one place",
    text: "See upcoming and past stays with the full price breakdown.",
    icon: "M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z",
  },
];

export default function WhyBook() {
  return (
    <section className="container mt-14">
      <h2 className="text-2xl font-bold">Why book with StaySwift</h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((reason) => (
          <div key={reason.title} className="card p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={reason.icon} />
              </svg>
            </span>
            <p className="mt-3 font-semibold">{reason.title}</p>
            <p className="mt-1 text-sm text-gray-600">{reason.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
