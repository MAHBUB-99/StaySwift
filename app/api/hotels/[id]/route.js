import { getHotelById, ServiceError } from "@/database/queries";
import { handle, ok } from "../../_lib/http";

export const dynamic = "force-dynamic";

// GET /api/hotels/:id -> hotel with score, reviewCount and amenityDetails
export const GET = handle(async (request, { params: { id } }) => {
  const hotel = await getHotelById(id);
  if (!hotel) {
    throw new ServiceError(404, "Hotel not found");
  }
  return ok(hotel);
});
