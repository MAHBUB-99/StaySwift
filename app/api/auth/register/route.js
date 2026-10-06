import { createUser } from "@/database/queries";
import { handle, ok, readJson } from "../../_lib/http";

// POST /api/auth/register  { fname, lname, email, password } -> { id, name, email, image }
export const POST = handle(async (request) => {
  const body = await readJson(request);
  return ok(await createUser(body), 201);
});
