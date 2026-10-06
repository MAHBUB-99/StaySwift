import { getDestinations } from "@/database/queries";
import { handle, ok } from "../_lib/http";

export const dynamic = "force-dynamic";

// GET /api/destinations -> [{ city, country, image, count }]
export const GET = handle(async () => ok(await getDestinations()));
