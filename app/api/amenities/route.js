import { getAmenities } from "@/database/queries";
import { handle, ok } from "../_lib/http";

export const dynamic = "force-dynamic";

// GET /api/amenities -> [{ id, name, hours, price, instructions }]
export const GET = handle(async () => ok(await getAmenities()));
