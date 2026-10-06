import { createBooking, getTripsByUser } from "@/database/queries";
import { handle, ok, queryObject, readJson, requireUser } from "../_lib/http";

export const dynamic = "force-dynamic";

const STATUSES = ["upcoming", "past", "cancelled"];

// GET /api/bookings?status=upcoming|past|cancelled  (signed in)
// -> the user's trips, latest check-in first
export const GET = handle(async (request) => {
  const user = await requireUser();
  const { status } = queryObject(request);
  const trips = await getTripsByUser(user.id);
  return ok(STATUSES.includes(status) ? trips.filter((t) => t.status === status) : trips);
});

// POST /api/bookings  (signed in)
// { hotelId, roomType, checkin, checkout, rooms, adults, children, guestName, guestPhone }
// -> the new trip. The price is always worked out on the server.
export const POST = handle(async (request) => {
  const user = await requireUser();
  const body = await readJson(request);
  return ok(await createBooking(user.id, body), 201);
});
