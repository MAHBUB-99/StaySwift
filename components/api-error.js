// The API answers errors with { "error": "message" }.
export async function apiError(response) {
  try {
    const body = await response.json();
    if (body?.error) return body.error;
  } catch {
    // Not JSON; fall through to a generic message.
  }
  return `Something went wrong (${response.status})`;
}
