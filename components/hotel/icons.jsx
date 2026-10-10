// Small stroke icons (24 x 24 grid) used on the hotel pages.

const PATHS = {
  check: "M4 12l5 5L20 6",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  shield: "M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6zM9 12l2 2 4-4",
  users:
    "M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 19v-1a3.5 3.5 0 0 0-2.5-3.3M15.5 4.2a3.5 3.5 0 0 1 0 6.6",
  cancel:
    "M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM10 13l4 4M14 13l-4 4",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  bed: "M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M3 21v-3M21 21v-3M7 9V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2",
  size: "M4 8h16v8H4zM8 8v3M12 8v4M16 8v3",
  wifi: "M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01",
  pool: "M3 17c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1M3 21c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1M9 13V5.5a2 2 0 0 1 4 0M15 13V5.5a2 2 0 0 0-4 0M9 9h6",
  gym: "M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11",
  golf: "M9 20V4l8 4-8 4M6 20h7",
  spa: "M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19l7-7",
  restaurant: "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-3 4-3 7h3v11",
  bar: "M5 4h14l-7 8zM12 12v8M8 20h8",
  parking: "M8 21V4h5a4 4 0 0 1 0 8H8",
  shuttle:
    "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10H4zM4 11h16M7.5 19.5V16M16.5 19.5V16M7.5 14h.01M16.5 14h.01",
  ac: "M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  calendar:
    "M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  logout: "M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9",
  search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.3-4.3",
  chevron: "M6 9l6 6 6-6",
  breakfast: "M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5zM16 9h1.5a2.5 2.5 0 0 1 0 5H16M8 3v2M12 3v2",
};

export function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "pet" ? (
        <>
          <circle cx="6.5" cy="10" r="1.7" />
          <circle cx="10" cy="6.5" r="1.7" />
          <circle cx="14" cy="6.5" r="1.7" />
          <circle cx="17.5" cy="10" r="1.7" />
          <path d="M12 12c-3 0-5.5 2.5-5.5 5 0 1.5 1.2 2.5 2.7 2.5 1 0 1.8-.5 2.8-.5s1.8.5 2.8.5c1.5 0 2.7-1 2.7-2.5 0-2.5-2.5-5-5.5-5z" />
        </>
      ) : (
        <path d={PATHS[name] ?? PATHS.check} />
      )}
    </svg>
  );
}

const AMENITY_KEYWORDS = [
  ["wifi", "wifi"],
  ["pool", "pool"],
  ["fitness", "gym"],
  ["gym", "gym"],
  ["golf", "golf"],
  ["spa", "spa"],
  ["restaurant", "restaurant"],
  ["bar", "bar"],
  ["parking", "parking"],
  ["shuttle", "shuttle"],
  ["air conditioning", "ac"],
  ["pet", "pet"],
  ["breakfast", "breakfast"],
];

export function amenityIconName(name = "") {
  const text = name.toLowerCase();
  return AMENITY_KEYWORDS.find(([keyword]) => text.includes(keyword))?.[1] ?? "check";
}

export function AmenityIcon({ name, className }) {
  return <Icon name={amenityIconName(name)} className={className} />;
}
