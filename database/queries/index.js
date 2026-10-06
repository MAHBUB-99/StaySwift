// Service layer: every read and write the app does. Pages call these
// directly; the REST endpoints in app/api wrap the same functions, so they
// are also the contract a future .NET API has to match (see docs/API.md).

import seed from "@/database/local/data";
import { getDb, newId, nowISO, saveDb } from "@/database/local/db";
import {
  calculatePrice,
  getRoomTypes,
  isValidDate,
  parseStayParams,
  toScore,
  todayISO,
} from "@/database/utils/stay";
import bcrypt from "bcryptjs";

// Thrown for anything the caller did wrong; `status` is the HTTP status the
// API returns for it.
export class ServiceError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const copy = (value) => structuredClone(value);
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Hotels

const CARD_FIELDS = [
  "id",
  "name",
  "city",
  "country",
  "locationDescription",
  "shortDescription",
  "propertyCategory",
  "lowRate",
  "highRate",
  "thumbNailUrl",
  "amenities",
];

const pick = (hotel, fields) =>
  Object.fromEntries(fields.map((field) => [field, copy(hotel[field] ?? null)]));

// Average score out of 10 and review count for each hotel id.
function getHotelStats(hotelIds) {
  const wanted = new Set(hotelIds);
  const totals = new Map();
  for (const review of getDb().reviews) {
    if (!wanted.has(review.hotelId)) continue;
    const entry = totals.get(review.hotelId) ?? { sum: 0, count: 0 };
    entry.sum += review.rating;
    entry.count += 1;
    totals.set(review.hotelId, entry);
  }
  const stats = new Map();
  for (const id of hotelIds) {
    const entry = totals.get(id);
    stats.set(id, {
      score: entry ? toScore(entry.sum / entry.count) : null,
      reviewCount: entry?.count ?? 0,
    });
  }
  return stats;
}

// Rooms already booked per hotel and room type for stays overlapping the
// dates. Every overlapping booking counts, even if those bookings don't
// overlap each other, so availability errs on the safe side.
function getBookedRooms(hotelIds, checkin, checkout) {
  const wanted = new Set(hotelIds);
  const booked = new Map();
  for (const booking of getDb().bookings) {
    if (
      !wanted.has(booking.hotelId) ||
      booking.status === "cancelled" ||
      booking.checkin >= checkout ||
      booking.checkout <= checkin
    ) {
      continue;
    }
    const byType = booked.get(booking.hotelId) ?? {};
    byType[booking.roomType] = (byType[booking.roomType] ?? 0) + booking.rooms;
    booked.set(booking.hotelId, byType);
  }
  return booked;
}

// Room types for a hotel, with whether each fits the group and is free.
function buildRoomOptions(hotel, bookedByType, stay) {
  const hasDates = !!(stay.checkin && stay.checkout);
  const guestsPerRoom = Math.ceil((stay.adults + stay.children) / stay.rooms);

  return getRoomTypes(hotel).map((room) => {
    const available = room.inventory - (bookedByType?.[room.key] ?? 0);
    const fits = guestsPerRoom <= room.sleeps;
    const isAvailable = !hasDates || available >= stay.rooms;
    return {
      ...room,
      available: Math.max(available, 0),
      fits,
      isAvailable,
      bookable: hasDates && fits && isAvailable,
      price: hasDates ? calculatePrice(room.pricePerNight, stay.nights, stay.rooms) : null,
    };
  });
}

function summarizeHotel(hotel, stats, bookedByType, stay) {
  const roomOptions = buildRoomOptions(hotel, bookedByType, stay);
  const matching = roomOptions.filter((room) => room.fits);
  const open = matching.filter((room) => room.isAvailable);
  const cheapest = open[0] ?? matching[0] ?? roomOptions[0];
  return {
    ...pick(hotel, CARD_FIELDS),
    ...stats,
    fitsGroup: matching.length > 0,
    isSoldOut: !!stay.checkin && matching.length > 0 && open.length === 0,
    fromPrice: cheapest.pricePerNight,
    price: cheapest.price,
  };
}

const NO_STAY = parseStayParams({});

export async function searchHotels(stay, filters) {
  const { hotels } = getDb();
  const destination = stay.destination
    ? new RegExp(escapeRegex(stay.destination), "i")
    : null;
  const name = filters.name ? new RegExp(escapeRegex(filters.name), "i") : null;

  const matches = hotels.filter(
    (hotel) =>
      (!destination ||
        destination.test(hotel.city) ||
        destination.test(hotel.locationDescription) ||
        destination.test(hotel.name)) &&
      (!name || name.test(hotel.name)) &&
      (filters.stars.length === 0 || filters.stars.includes(hotel.propertyCategory)) &&
      filters.amenities.every((id) => hotel.amenities.includes(id))
  );

  const ids = matches.map((hotel) => hotel.id);
  const stats = getHotelStats(ids);
  const booked = stay.checkin ? getBookedRooms(ids, stay.checkin, stay.checkout) : new Map();

  let results = matches
    .map((hotel) => summarizeHotel(hotel, stats.get(hotel.id), booked.get(hotel.id), stay))
    .filter((hotel) => hotel.fitsGroup);

  if (filters.price) {
    const { min, max } = filters.price;
    results = results.filter(
      (hotel) => hotel.fromPrice >= min && (max == null || hotel.fromPrice < max)
    );
  }
  if (filters.rating) {
    results = results.filter((hotel) => (hotel.score ?? 0) >= filters.rating);
  }

  const byScore = (a, b) => (b.score ?? -1) - (a.score ?? -1);
  const sorters = {
    price_asc: (a, b) => a.fromPrice - b.fromPrice,
    price_desc: (a, b) => b.fromPrice - a.fromPrice,
    rating: (a, b) => byScore(a, b) || b.reviewCount - a.reviewCount,
    stars: (a, b) => b.propertyCategory - a.propertyCategory || byScore(a, b),
    // Available first, then best rated, then most stars.
    recommended: (a, b) =>
      Number(a.isSoldOut) - Number(b.isSoldOut) ||
      byScore(a, b) ||
      b.propertyCategory - a.propertyCategory,
  };
  return results.sort(sorters[filters.sort] ?? sorters.recommended);
}

// Cities with how many stays they have and a photo, most stays first.
export async function getDestinations() {
  const byCity = new Map();
  for (const hotel of getDb().hotels) {
    const entry = byCity.get(hotel.city) ?? {
      city: hotel.city,
      country: hotel.country,
      image: null,
      count: 0,
    };
    entry.count += 1;
    // A chosen destination photo wins; otherwise the first hotel with a photo.
    // The chosen photos are catalogue data, so they come from the seed file.
    entry.image =
      seed.destinationImages?.[hotel.city] ?? entry.image ?? hotel.thumbNailUrl;
    byCity.set(hotel.city, entry);
  }
  return [...byCity.values()].sort(
    (a, b) => b.count - a.count || a.city.localeCompare(b.city)
  );
}

export async function getFeaturedHotels(limit = 4) {
  const { hotels } = getDb();
  const stats = getHotelStats(hotels.map((hotel) => hotel.id));
  return hotels
    .map((hotel) => summarizeHotel(hotel, stats.get(hotel.id), {}, NO_STAY))
    .sort(
      (a, b) =>
        (b.score ?? -1) - (a.score ?? -1) ||
        b.reviewCount - a.reviewCount ||
        b.propertyCategory - a.propertyCategory
    )
    .slice(0, limit);
}

export async function getAmenities() {
  return copy(getDb().amenities).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getHotelById(hotelId) {
  const { hotels, amenities } = getDb();
  const hotel = hotels.find((item) => item.id === hotelId);
  if (!hotel) return null;
  return {
    ...copy(hotel),
    ...getHotelStats([hotel.id]).get(hotel.id),
    amenityDetails: copy(amenities.filter((amenity) => hotel.amenities.includes(amenity.id))),
  };
}

export async function getRoomOptionsForHotel(hotel, stay) {
  const booked = stay.checkin
    ? getBookedRooms([hotel.id], stay.checkin, stay.checkout)
    : new Map();
  return buildRoomOptions(hotel, booked.get(hotel.id), stay);
}

// ---------------------------------------------------------------------------
// Reviews

export async function getReviewsForAHotel(hotelId) {
  const { reviews, users } = getDb();
  const names = new Map(users.map((user) => [user.id, user.name]));
  return reviews
    .filter((review) => review.hotelId === hotelId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((review) => ({
      id: review.id,
      text: review.text,
      author: names.get(review.userId) ?? "Verified guest",
      rating: review.rating,
      score: toScore(review.rating),
      date: review.createdAt.slice(0, 10),
    }));
}

// Guests can review a hotel once, after their stay has started.
export async function getReviewEligibility(userId, hotelId) {
  if (!userId) return { eligible: false, reason: "signin" };
  const { reviews, bookings } = getDb();
  if (reviews.some((r) => r.hotelId === hotelId && r.userId === userId)) {
    return { eligible: false, reason: "reviewed" };
  }
  const today = todayISO();
  const stayed = bookings.some(
    (b) =>
      b.hotelId === hotelId &&
      b.userId === userId &&
      b.status !== "cancelled" &&
      b.checkin <= today
  );
  return stayed ? { eligible: true, reason: null } : { eligible: false, reason: "no-stay" };
}

export async function createReview(userId, hotelId, { rating, review }) {
  const text = String(review ?? "").trim();
  if (!getDb().hotels.some((hotel) => hotel.id === hotelId)) {
    throw new ServiceError(404, "Hotel not found");
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ServiceError(400, "Choose a rating from 1 to 5");
  }
  if (text.length < 10 || text.length > 2000) {
    throw new ServiceError(400, "Reviews must be between 10 and 2000 characters");
  }
  const eligibility = await getReviewEligibility(userId, hotelId);
  if (eligibility.reason === "reviewed") {
    throw new ServiceError(409, "You've already reviewed this property");
  }
  if (!eligibility.eligible) {
    throw new ServiceError(403, "Only guests who have stayed here can write a review");
  }

  const created = { id: newId(), hotelId, userId, rating, text, createdAt: nowISO() };
  getDb().reviews.push(created);
  saveDb();
  return copy(created);
}

// ---------------------------------------------------------------------------
// Users

const publicUser = (user) =>
  user && { id: user.id, name: user.name, email: user.email, image: user.image ?? null };

const findUserByEmail = (email) => {
  const wanted = String(email ?? "").trim().toLowerCase();
  return getDb().users.find((user) => user.email.toLowerCase() === wanted);
};

export async function getUserByEmail(email) {
  return email ? publicUser(findUserByEmail(email)) ?? null : null;
}

export async function createUser({ fname, lname, email, password }) {
  const first = String(fname ?? "").trim();
  const last = String(lname ?? "").trim();
  const address = String(email ?? "").trim();
  if (!first || !address || !password) {
    throw new ServiceError(400, "First name, email and password are required");
  }
  if (!EMAIL_PATTERN.test(address)) {
    throw new ServiceError(400, "Enter a valid email address");
  }
  if (String(password).length < 6) {
    throw new ServiceError(400, "Password must be at least 6 characters");
  }
  if (findUserByEmail(address)) {
    throw new ServiceError(409, "An account with this email already exists");
  }

  const user = {
    id: newId(),
    name: `${first} ${last}`.trim(),
    email: address,
    password: await bcrypt.hash(String(password), 10),
    image: null,
    createdAt: nowISO(),
  };
  getDb().users.push(user);
  saveDb();
  return publicUser(user);
}

// Returns the user for a correct email and password, otherwise null.
export async function verifyCredentials(email, password) {
  const user = findUserByEmail(email);
  if (!user?.password || !password) return null;
  const isMatch = await bcrypt.compare(String(password), user.password);
  return isMatch ? publicUser(user) : null;
}

// Google sign-in: make sure the user exists locally (no password).
export async function upsertOAuthUser({ name, email, image }) {
  const existing = findUserByEmail(email);
  if (existing) {
    if (image && existing.image !== image) {
      existing.image = image;
      saveDb();
    }
    return publicUser(existing);
  }
  const user = {
    id: newId(),
    name: name || email.split("@")[0],
    email,
    password: null,
    image: image ?? null,
    createdAt: nowISO(),
  };
  getDb().users.push(user);
  saveDb();
  return publicUser(user);
}

// ---------------------------------------------------------------------------
// Bookings (trips)

function toTrip(booking, hotelsById, today) {
  const hotel = hotelsById.get(booking.hotelId);
  const roomType =
    getRoomTypes(hotel).find((room) => room.key === booking.roomType) ?? getRoomTypes(hotel)[0];

  let status = "upcoming";
  if (booking.status === "cancelled") status = "cancelled";
  else if (booking.checkout < today) status = "past";

  return {
    id: booking.id,
    hotel: hotel ? pick(hotel, CARD_FIELDS) : null,
    checkin: booking.checkin,
    checkout: booking.checkout,
    roomType: booking.roomType,
    roomName: roomType.name,
    rooms: booking.rooms,
    adults: booking.adults,
    children: booking.children,
    guestName: booking.guestName,
    guestPhone: booking.guestPhone,
    price: {
      pricePerNight: booking.pricePerNight,
      nights: booking.nights,
      rooms: booking.rooms,
      subtotal: booking.totalPrice - booking.taxes,
      taxes: booking.taxes,
      total: booking.totalPrice,
    },
    status,
    canCancel: status === "upcoming" && booking.checkin > today,
    bookedOn: booking.createdAt.slice(0, 10),
    cancelledOn: booking.cancelledAt?.slice(0, 10) ?? null,
  };
}

// The user's bookings, latest check-in first.
export async function getTripsByUser(userId) {
  if (!userId) return [];
  const { bookings, hotels } = getDb();
  const hotelsById = new Map(hotels.map((hotel) => [hotel.id, hotel]));
  const today = todayISO();
  return bookings
    .filter((booking) => booking.userId === userId)
    .sort((a, b) => b.checkin.localeCompare(a.checkin))
    .map((booking) => toTrip(booking, hotelsById, today));
}

export async function getTripById(userId, bookingId) {
  const { bookings, hotels } = getDb();
  const booking = bookings.find((b) => b.id === bookingId && b.userId === userId);
  if (!booking) return null;
  return toTrip(booking, new Map(hotels.map((hotel) => [hotel.id, hotel])), todayISO());
}

export async function createBooking(userId, input) {
  const stay = parseStayParams({
    checkin: input.checkin,
    checkout: input.checkout,
    rooms: input.rooms,
    adults: input.adults,
    children: input.children,
  });
  if (!isValidDate(input.checkin) || !isValidDate(input.checkout) || !stay.checkin) {
    throw new ServiceError(400, "Choose valid dates: check-in from today, check-out after check-in");
  }
  const guestName = String(input.guestName ?? "").trim();
  const guestPhone = String(input.guestPhone ?? "").trim();
  if (!guestName) {
    throw new ServiceError(400, "Enter the name of the main guest");
  }
  if (!PHONE_PATTERN.test(guestPhone)) {
    throw new ServiceError(400, "Enter a valid phone number");
  }

  const hotel = await getHotelById(input.hotelId);
  if (!hotel) {
    throw new ServiceError(404, "Hotel not found");
  }
  const rooms = await getRoomOptionsForHotel(hotel, stay);
  const room = rooms.find((option) => option.key === input.roomType);
  if (!room) {
    throw new ServiceError(400, "Choose a room type: standard, deluxe or suite");
  }
  if (!room.fits) {
    throw new ServiceError(
      400,
      `${room.name} sleeps ${room.sleeps} per room. Add more rooms for your group.`
    );
  }
  if (!room.isAvailable) {
    throw new ServiceError(409, `Sorry, the ${room.name} is no longer available for these dates`);
  }

  const booking = {
    id: newId(),
    hotelId: hotel.id,
    userId,
    checkin: stay.checkin,
    checkout: stay.checkout,
    roomType: room.key,
    rooms: stay.rooms,
    adults: stay.adults,
    children: stay.children,
    guestName,
    guestPhone,
    pricePerNight: room.price.pricePerNight,
    nights: room.price.nights,
    taxes: room.price.taxes,
    totalPrice: room.price.total,
    status: "confirmed",
    createdAt: nowISO(),
    cancelledAt: null,
  };
  getDb().bookings.push(booking);
  saveDb();
  return getTripById(userId, booking.id);
}

// Free cancellation runs until the day before check-in.
export async function cancelBooking(userId, bookingId) {
  const booking = getDb().bookings.find((b) => b.id === bookingId && b.userId === userId);
  if (!booking) {
    throw new ServiceError(404, "Booking not found");
  }
  if (booking.status === "cancelled") {
    throw new ServiceError(400, "This booking is already cancelled");
  }
  if (booking.checkin <= todayISO()) {
    throw new ServiceError(400, "Bookings can only be cancelled before the day of check-in");
  }
  booking.status = "cancelled";
  booking.cancelledAt = nowISO();
  saveDb();
  return getTripById(userId, booking.id);
}
