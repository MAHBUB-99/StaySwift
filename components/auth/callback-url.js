// Only same-site paths are allowed, so a link can't send people to another site.
export function safeCallbackUrl(value, fallback = "/bookings") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}
