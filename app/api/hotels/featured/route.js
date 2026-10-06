import { getFeaturedHotels } from "@/database/queries";
import { handle, ok, queryObject } from "../../_lib/http";

export const dynamic = "force-dynamic";

// GET /api/hotels/featured?limit=4 -> [hotel summary], best rated first
export const GET = handle(async (request) => {
  const limit = Math.min(Math.max(parseInt(queryObject(request).limit, 10) || 4, 1), 20);
  return ok(await getFeaturedHotels(limit));
});
