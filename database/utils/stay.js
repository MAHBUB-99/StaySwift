// Pure helpers shared by server and client code: search params, room types,
// pricing, ratings and formatting. Nothing here touches the database.

export const MAX_ROOMS = 8;
export const MAX_ADULTS = 16;
export const MAX_CHILDREN = 8;
export const TAX_RATE = 0.1;

export const PRICE_RANGES = [
  { key: "0-1000", label: "Less than $1,000", min: 0, max: 1000 },
  { key: "1000-2000", label: "$1,000 to $2,000", min: 1000, max: 2000 },
  { key: "2000-3000", label: "$2,000 to $3,000", min: 2000, max: 3000 },
  { key: "3000-4000", label: "$3,000 to $4,000", min: 3000, max: 4000 },
  { key: "4000-", label: "$4,000 and more", min: 4000, max: null },
];

export const GUEST_RATINGS = [
  { value: 9, label: "Wonderful 9+" },
  { value: 8, label: "Very good 8+" },
  { value: 7, label: "Good 7+" },
];

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Guest rating" },
  { value: "stars", label: "Star rating" },
];

// Rates come from the hotel's lowRate/highRate; inventory is rooms per type.
export const ROOM_TYPES = [
  {
    key: "standard",
    name: "Standard Room",
    beds: "1 Queen Bed",
    sleeps: 2,
    size: "22 m²",
    inventory: 5,
    features: ["Free WiFi", "Air conditioning", "Private bathroom"],
  },
  {
    key: "deluxe",
    name: "Deluxe Room",
    beds: "1 King Bed",
    sleeps: 3,
    size: "30 m²",
    inventory: 3,
    features: ["Free WiFi", "Air conditioning", "City view", "Minibar"],
  },
  {
    key: "suite",
    name: "Suite",
    beds: "1 King Bed and 1 Sofa Bed",
    sleeps: 4,
    size: "45 m²",
    inventory: 2,
    features: ["Free WiFi", "Separate living area", "Bathtub", "Minibar"],
  },
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const toInt = (value, fallback, min, max) => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
};

// Local calendar date as "YYYY-MM-DD".
export const todayISO = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

export const addDaysISO = (iso, days) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export const isValidDate = (iso) =>
  DATE_PATTERN.test(iso ?? "") && !isNaN(new Date(`${iso}T00:00:00Z`));

// Number of nights between two "YYYY-MM-DD" dates.
export const nightsBetween = (checkin, checkout) =>
  Math.round(
    (new Date(`${checkout}T00:00:00Z`) - new Date(`${checkin}T00:00:00Z`)) /
      (24 * 60 * 60 * 1000)
  );

// Dates, rooms and travelers from the URL. Dates are kept only when both are
// valid, check-in is not in the past and check-out is after check-in.
export function parseStayParams(searchParams = {}) {
  const get = (key) =>
    typeof searchParams.get === "function"
      ? searchParams.get(key)
      : searchParams[key];

  const rooms = toInt(get("rooms"), 1, 1, MAX_ROOMS);
  const adults = Math.max(toInt(get("adults"), 2, 1, MAX_ADULTS), rooms);
  const children = toInt(get("children"), 0, 0, MAX_CHILDREN);

  let checkin = get("checkin") ?? "";
  let checkout = get("checkout") ?? "";
  if (
    !isValidDate(checkin) ||
    !isValidDate(checkout) ||
    checkin < todayISO() ||
    checkout <= checkin
  ) {
    checkin = "";
    checkout = "";
  }

  return {
    destination: (get("destination") ?? "").trim(),
    checkin,
    checkout,
    nights: checkin ? nightsBetween(checkin, checkout) : 0,
    rooms,
    adults,
    children,
  };
}

export function parseFilterParams(searchParams = {}) {
  const list = (value) =>
    (value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const price = PRICE_RANGES.find((range) => range.key === searchParams.price);
  const rating = GUEST_RATINGS.find(
    (r) => String(r.value) === searchParams.rating
  );
  const sort = SORT_OPTIONS.find((s) => s.value === searchParams.sort);

  return {
    name: (searchParams.name ?? "").trim(),
    price: price ?? null,
    rating: rating?.value ?? null,
    stars: list(searchParams.stars)
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 5),
    amenities: list(searchParams.amenities),
    sort: sort?.value ?? "recommended",
  };
}

// Query string for dates and travelers, e.g. to carry a search to a hotel page.
export function stayQuery({ checkin, checkout, rooms, adults, children }) {
  const params = new URLSearchParams();
  if (checkin && checkout) {
    params.set("checkin", checkin);
    params.set("checkout", checkout);
  }
  if (rooms) params.set("rooms", rooms);
  if (adults) params.set("adults", adults);
  if (children) params.set("children", children);
  return params.toString();
}

export function getRoomTypes(hotel) {
  const low = hotel?.lowRate ?? hotel?.highRate ?? 0;
  const high = hotel?.highRate ?? low;
  const rates = {
    standard: low,
    deluxe: Math.round((low + high) / 2),
    suite: high,
  };
  return ROOM_TYPES.map((room) => ({ ...room, pricePerNight: rates[room.key] }));
}

export function calculatePrice(pricePerNight, nights, rooms = 1) {
  const subtotal = pricePerNight * nights * rooms;
  const taxes = Math.round(subtotal * TAX_RATE);
  return { pricePerNight, nights, rooms, subtotal, taxes, total: subtotal + taxes };
}

// Ratings are stored 1-5; guests see them out of 10.
export const toScore = (rating) => Math.round(rating * 2 * 10) / 10;

export function scoreLabel(score) {
  if (score == null) return "No ratings yet";
  if (score >= 9.5) return "Exceptional";
  if (score >= 9) return "Wonderful";
  if (score >= 8) return "Very good";
  if (score >= 7) return "Good";
  if (score >= 5) return "Okay";
  return "Poor";
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
export const formatPrice = (amount) => currency.format(amount ?? 0);

// Date-only strings are formatted in UTC so server and browser agree.
export const formatDate = (iso, options = {}) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
    ...options,
  });

export const travelersLabel = ({ rooms, adults, children }) => {
  const travelers = adults + children;
  return `${travelers} traveler${travelers === 1 ? "" : "s"}, ${rooms} room${
    rooms === 1 ? "" : "s"
  }`;
};
