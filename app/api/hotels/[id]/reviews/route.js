import {
  createReview,
  getHotelById,
  getReviewsForAHotel,
  ServiceError,
} from "@/database/queries";
import { handle, ok, readJson, requireUser } from "../../../_lib/http";

export const dynamic = "force-dynamic";

// GET /api/hotels/:id/reviews -> [{ id, text, author, rating, score, date }]
export const GET = handle(async (request, { params: { id } }) => {
  if (!(await getHotelById(id))) {
    throw new ServiceError(404, "Hotel not found");
  }
  return ok(await getReviewsForAHotel(id));
});

// POST /api/hotels/:id/reviews  { rating: 1-5, review: "text" }  (signed in)
// Only for guests whose stay has started, once per hotel.
export const POST = handle(async (request, { params: { id } }) => {
  const user = await requireUser();
  const body = await readJson(request);
  return ok(await createReview(user.id, id, body), 201);
});
