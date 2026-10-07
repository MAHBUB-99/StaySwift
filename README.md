# StaySwift

A hotel booking web app modelled on the stays experience of large travel sites. Guests search by destination, dates and party size, compare rooms and prices, book, leave reviews and manage their trips.

Built with Next.js 14 (App Router). It runs on a local JSON database with a documented REST API, so the data layer can later be replaced by a real database and backend without changing the UI.

## Features

**Search and discovery**
- Destination search with suggestions, date picker and a travelers and rooms selector
- Results with filters (property name, price per night, guest rating, star rating, amenities) and sorting (recommended, price, guest rating, stars)
- Filters and search live in the URL, so any result page can be shared or reloaded
- Home page with trending destinations and top-rated stays

**Hotel pages**
- Photo gallery, description, amenities and policies
- Standard, Deluxe and Suite rooms with live availability and total price for the chosen dates
- Guest reviews with a score out of 10

**Booking and trips**
- Checkout with guest details, a price breakdown (rooms, nights, taxes and fees) and the cancellation deadline
- Availability is checked again on the server when a booking is made, so a room cannot be double-booked
- Trips page with Upcoming, Past and Cancelled tabs, price details and free cancellation until the day before check-in
- Reviews from guests whose stay has started (one per hotel)

**Accounts**
- Email and password sign-up and sign-in (passwords hashed with bcrypt)
- Google sign-in (optional)
- After signing in, you return to the page you came from

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 14 (App Router, Server Components, Route Handlers) |
| UI | React 18, Tailwind CSS |
| Authentication | Auth.js (`next-auth` v5) with credentials and Google providers |
| Data | Local JSON database (`database/local`) |
| Passwords | bcryptjs |
| Tooling | ESLint |

## Getting started

### Prerequisites

- Node.js 18.17 or later
- npm

### Install and run

```bash
git clone https://github.com/your-username/stayswift.git
cd stayswift
npm install
```

Create a `.env` file in the project root:

```env
# Required: signs session tokens. Generate one with: npx auth secret
AUTH_SECRET=replace-with-a-long-random-string

# Optional: only needed for "Continue with Google"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo account

The seed data includes a demo guest with upcoming, past and cancelled trips and a past stay you can review:

| Email | Password |
|---|---|
| `demo@stayswift.com` | `password123` |

Every `@example.com` user in the seed data uses the same password.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
app/
  (home)/          Public pages: home, hotel search, hotel details, checkout, trips
  (auth)/          Sign in and register pages
  api/             REST endpoints (see docs/API.md)
components/        UI components, grouped by feature (hotel, search, payment, auth, ...)
database/
  local/           data.js (seed data) and db.js (JSON storage)
  queries/         Service layer: all reads, writes and business rules
  utils/stay.js    Shared helpers: dates, room types, pricing, scores, formatting
docs/API.md        REST API reference
auth.js            Auth.js configuration
```

Pages and API routes both call the functions in `database/queries`, so the business rules (availability, pricing, cancellation, who may review) exist in one place.

## Data and API

- **Seed data:** `database/local/data.js` holds 28 hotels, 12 amenities, 15 users, 168 reviews and 172 bookings.
- **Runtime changes:** sign-ups, bookings, cancellations and reviews are saved to `.data/db.json`, which is git-ignored. Delete that file, or increase `version` in `data.js`, to reset to the seed data.
- **REST API:** the endpoints, request and response shapes and business rules are documented in [docs/API.md](docs/API.md). The document is written so another backend (for example ASP.NET Core) can implement the same contract.

## Limitations

- **Storage:** the local database writes to the `.data` folder, so it needs a writable disk. It is suited to development and demos, not to serverless hosts with a read-only file system, and it is not safe for several server instances at once. Production use needs a real database.
- **Payments:** checkout is a demo. Card details are checked for format in the browser only and are never sent or stored.
- **Room types:** Standard, Deluxe and Suite are derived from each hotel's low and high rates and have fixed inventory. A real backend would store them per hotel.
- **Photos:** hotel photos are hosted externally (Airbnb CDN, allowed in `next.config.mjs`). Some links have expired; those hotels show a placeholder.
- **Tests:** there is no automated test suite yet.

## Roadmap

- Replace the local database with a real database and backend, following [docs/API.md](docs/API.md)
- Per-hotel room types and inventory
- Real payment provider
- Automated tests

## Contributing

Issues and pull requests are welcome. Please run `npm run lint` before submitting a change.
