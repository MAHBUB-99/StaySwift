import { handle, ok, requireUser } from "../../_lib/http";

export const dynamic = "force-dynamic";

// GET /api/users/me  (signed in) -> { id, name, email, image }
export const GET = handle(async () => ok(await requireUser()));
