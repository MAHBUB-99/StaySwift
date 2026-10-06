import { auth } from "@/auth";
import { getUserByEmail, ServiceError } from "@/database/queries";
import { NextResponse } from "next/server";

// Shared helpers for the REST endpoints. Successful responses are JSON;
// errors are { "error": "message" } with a matching HTTP status.

export const ok = (data, status = 200) => NextResponse.json(data, { status });

export const fail = (status, message) => NextResponse.json({ error: message }, { status });

// The signed-in user, or a ServiceError(401).
export async function requireUser() {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);
  if (!user) {
    throw new ServiceError(401, "You must be signed in");
  }
  return user;
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new ServiceError(400, "Request body must be valid JSON");
  }
}

// Wraps a route handler: ServiceErrors become their status, anything else 500.
export const handle = (handler) => async (request, context) => {
  try {
    return await handler(request, context);
  } catch (error) {
    if (error instanceof ServiceError) {
      return fail(error.status, error.message);
    }
    console.error(error);
    return fail(500, "Something went wrong");
  }
};

// URLSearchParams -> plain object, for the stay/filter parsers.
export const queryObject = (request) =>
  Object.fromEntries(new URL(request.url).searchParams.entries());
