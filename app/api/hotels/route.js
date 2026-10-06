import { searchHotels } from "@/database/queries";
import { parseFilterParams, parseStayParams } from "@/database/utils/stay";
import { handle, ok, queryObject } from "../_lib/http";

export const dynamic = "force-dynamic";

// GET /api/hotels?destination=&checkin=&checkout=&rooms=&adults=&children=
//                &name=&price=&rating=&stars=&amenities=&sort=
// -> { count, stay, results: [hotel summary] }
export const GET = handle(async (request) => {
  const query = queryObject(request);
  const stay = parseStayParams(query);
  const results = await searchHotels(stay, parseFilterParams(query));
  return ok({ count: results.length, stay, results });
});
