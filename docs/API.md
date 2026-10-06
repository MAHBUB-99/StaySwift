# StaySwift API

The REST API the StaySwift front end relies on. It is currently served by
Next.js route handlers (`app/api`) backed by a local JSON database
(`database/local`). A replacement backend (for example ASP.NET Core) should
expose the same routes, request bodies and response shapes.

## Conventions

- JSON in and out. Dates are `YYYY-MM-DD` strings; timestamps are ISO 8601.
- Ids are 24-character hex strings.
- Prices are whole US dollars. Taxes and fees are 10% of the room subtotal,
  rounded to the nearest dollar.
- Errors return the matching HTTP status with `{ "error": "message" }`:
  `400` invalid input, `401` not signed in, `403` not allowed, `404` not found,
  `409` conflict (duplicate or no longer available), `500` unexpected.
- "Signed in" endpoints identify the user from the Auth.js session cookie today.
  A .NET backend would use its own auth (for example a JWT bearer token).

## Data model

| Table | Fields |
|---|---|
| `hotels` | `id, name, address1, city, postalCode, countryCode, country, locationDescription, propertyCategory (stars 1-5), lowRate, highRate, thumbNailUrl, gallery[], shortDescription, overview, amenities[] (amenity ids)` |
| `amenities` | `id, name, hours, price, instructions` |
| `users` | `id, name, email, password (bcrypt hash, null for Google users), image, createdAt` |
| `bookings` | `id, hotelId, userId, checkin, checkout, roomType, rooms, adults, children, guestName, guestPhone, pricePerNight, nights, taxes, totalPrice, status ("confirmed" or "cancelled"), createdAt, cancelledAt` |
| `reviews` | `id, hotelId, userId, rating (1-5), text, createdAt` |

## Business rules

- **Room types** are derived from each hotel's rates (`database/utils/stay.js`):

  | key | name | sleeps | rooms per hotel | price per night |
  |---|---|---|---|---|
  | `standard` | Standard Room | 2 | 5 | `lowRate` |
  | `deluxe` | Deluxe Room | 3 | 3 | average of `lowRate` and `highRate`, rounded |
  | `suite` | Suite | 4 | 2 | `highRate` |

- **Availability:** rooms of a type left = rooms per hotel minus the rooms of
  every non-cancelled booking of that type whose stay overlaps the dates
  (`existing.checkin < checkout` and `existing.checkout > checkin`).
- **Group fit:** a room type fits when `ceil((adults + children) / rooms) <= sleeps`.
  Every room needs at least one adult (`adults >= rooms`). Limits: 8 rooms,
  16 adults, 8 children.
- **Dates:** check-in must be today or later and check-out after check-in.
  Invalid dates are ignored on searches and rejected on bookings.
- **Score:** average review rating × 2, shown out of 10 with one decimal.
  Labels: 9.5+ Exceptional, 9+ Wonderful, 8+ Very good, 7+ Good, 5+ Okay, else Poor.
- **Cancellation:** free until the day before check-in (`checkin > today`).
- **Reviews:** one per user per hotel, only with a non-cancelled booking whose
  check-in is today or earlier.

## Endpoints

### Catalogue (public)

| Method | Route | Returns |
|---|---|---|
| GET | `/api/destinations` | `[{ city, country, image, count }]`, most stays first |
| GET | `/api/amenities` | `[amenity]`, by name |
| GET | `/api/hotels` | `{ count, stay, results: [hotelSummary] }` |
| GET | `/api/hotels/featured?limit=4` | `[hotelSummary]`, best rated first (limit 1-20) |
| GET | `/api/hotels/:id` | `hotel` + `score, reviewCount, amenityDetails: [amenity]` |
| GET | `/api/hotels/:id/rooms` | `{ stay, rooms: [roomOption] }` |
| GET | `/api/hotels/:id/reviews` | `[{ id, text, author, rating, score, date }]`, newest first |

`GET /api/hotels` query parameters, all optional:

| Param | Example | Meaning |
|---|---|---|
| `destination` | `Paris` | matches city, location or hotel name (case-insensitive) |
| `checkin`, `checkout` | `2026-11-12` | stay dates; needed for totals and availability |
| `rooms`, `adults`, `children` | `1`, `2`, `0` | defaults 1, 2, 0 |
| `name` | `villa` | hotel name contains |
| `price` | `1000-2000` | `0-1000`, `1000-2000`, `2000-3000`, `3000-4000`, `4000-` (cheapest fitting room per night) |
| `rating` | `8` | minimum score: `7`, `8` or `9` |
| `stars` | `4,5` | star ratings, comma separated |
| `amenities` | `id1,id2` | hotel must have all of them |
| `sort` | `price_asc` | `recommended` (default), `price_asc`, `price_desc`, `rating`, `stars` |

`/api/hotels/:id/rooms` takes the same `checkin`, `checkout`, `rooms`, `adults`, `children`.

`hotelSummary`:

```json
{
  "id": "66263526f50c2e548501f285",
  "name": "Charme villa",
  "city": "Puglia",
  "country": "Italy",
  "locationDescription": "Puglia, Italy",
  "shortDescription": "Holiday villa in the heart of Salento...",
  "propertyCategory": 4,
  "lowRate": 390,
  "highRate": 650,
  "thumbNailUrl": "https://...",
  "amenities": ["66271646c2cac047ced8fe30"],
  "score": 8.4,
  "reviewCount": 6,
  "fitsGroup": true,
  "isSoldOut": false,
  "fromPrice": 390,
  "price": { "pricePerNight": 390, "nights": 3, "rooms": 1, "subtotal": 1170, "taxes": 117, "total": 1287 }
}
```

`price` is `null` without dates. `roomOption` is a room type (table above, plus
`beds, size, features[]`) with `available, fits, isAvailable, bookable, pricePerNight, price`.

### Account

| Method | Route | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/register` | `{ fname, lname, email, password }` (password 6+ chars) | `201 user` |
| GET | `/api/users/me` | signed in | `{ id, name, email, image }` |

Sign-in itself is handled by Auth.js (`/api/auth/...`, credentials or Google).

### Bookings (signed in, own bookings only)

| Method | Route | Body | Returns |
|---|---|---|---|
| GET | `/api/bookings?status=upcoming` | `status` optional: `upcoming`, `past`, `cancelled` | `[trip]`, latest check-in first |
| POST | `/api/bookings` | `{ hotelId, roomType, checkin, checkout, rooms, adults, children, guestName, guestPhone }` | `201 trip` |
| GET | `/api/bookings/:id` | | `trip` |
| PATCH | `/api/bookings/:id` | `{ "status": "cancelled" }` | `trip` |

The server always works out the price; clients never send it. Card details
are never sent to the API (the checkout is a demo).

`trip`:

```json
{
  "id": "…",
  "hotel": { "id": "…", "name": "…", "city": "…", "thumbNailUrl": "…" },
  "checkin": "2026-11-12",
  "checkout": "2026-11-15",
  "roomType": "deluxe",
  "roomName": "Deluxe Room",
  "rooms": 1,
  "adults": 2,
  "children": 0,
  "guestName": "Demo Guest",
  "guestPhone": "+44 20 7946 0000",
  "price": { "pricePerNight": 520, "nights": 3, "rooms": 1, "subtotal": 1560, "taxes": 156, "total": 1716 },
  "status": "upcoming",
  "canCancel": true,
  "bookedOn": "2026-09-20",
  "cancelledOn": null
}
```

`status` is `cancelled` for cancelled bookings, `past` once check-out has
passed, otherwise `upcoming`.

### Reviews

| Method | Route | Body | Returns |
|---|---|---|---|
| POST | `/api/hotels/:id/reviews` | `{ rating: 1-5, review: "10-2000 chars" }` (signed in) | `201 review` |

## Local database

- Seed data: `database/local/data.js` (28 hotels, 12 amenities, 15 users,
  168 reviews, 172 bookings).
- Changes made while the app runs are saved to `.data/db.json` (git-ignored).
  Delete that file, or bump `version` in `data.js`, to reset to the seed.
- Demo sign-in: `demo@stayswift.com` / `password123`. Every `@example.com`
  user has the same password.
