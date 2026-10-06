import { cancelBooking, getTripById, ServiceError } from "@/database/queries";
import { handle, ok, readJson, requireUser } from "../../_lib/http";

export const dynamic = "force-dynamic";

// GET /api/bookings/:id  (signed in, own bookings only) -> trip
export const GET = handle(async (request, { params: { id } }) => {
  const user = await requireUser();
  const trip = await getTripById(user.id, id);
  if (!trip) {
    throw new ServiceError(404, "Booking not found");
  }
  return ok(trip);
});

// PATCH /api/bookings/:id  { status: "cancelled" }  (signed in) -> trip
// Free cancellation until the day before check-in.
export const PATCH = handle(async (request, { params: { id } }) => {
  const user = await requireUser();
  const { status } = await readJson(request);
  if (status !== "cancelled") {
    throw new ServiceError(400, 'Only { "status": "cancelled" } is supported');
  }
  return ok(await cancelBooking(user.id, id));
});
