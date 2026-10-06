import { getHotelById, getRoomOptionsForHotel, ServiceError } from "@/database/queries";
import { parseStayParams } from "@/database/utils/stay";
import { handle, ok, queryObject } from "../../../_lib/http";

export const dynamic = "force-dynamic";

// GET /api/hotels/:id/rooms?checkin=&checkout=&rooms=&adults=&children=
// -> { stay, rooms: [room type with availability and price] }
export const GET = handle(async (request, { params: { id } }) => {
  const hotel = await getHotelById(id);
  if (!hotel) {
    throw new ServiceError(404, "Hotel not found");
  }
  const stay = parseStayParams(queryObject(request));
  return ok({ stay, rooms: await getRoomOptionsForHotel(hotel, stay) });
});
