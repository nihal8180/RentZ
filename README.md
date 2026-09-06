# RentZ

A MagicBricks-style rental listing platform, built as microservices so it can scale later.
Two frontends sit in front of the same backend:

- **Owner app** (`apps/owner-app`, port 3001) — property owners list/manage houses, rooms, PGs, flats
- **Public app** (`apps/public-app`, port 3000) — anyone searches for a rental by locality

**Testing-phase setup**: Docker and RabbitMQ have been stripped out for now to keep this fast
to run and iterate on. Everything runs as plain Node processes against a single MongoDB
instance. Async eventing (RabbitMQ) and containerization can be reintroduced later once the
core listing flow is validated — see "What's next" at the bottom.

## Services

| Service | Port | Purpose |
|---|---|---|
| `gateway` | 8080 | Single entry point, routes to services, rate limiting |
| `auth-service` | 5001 | Signup/login, JWT issuance, roles |
| `listing-service` | 5002 | Listing CRUD + public search |
| `media-service` | 5003 | Image uploads (local disk) |
| `location-service` | 5004 | City/locality master data |
| `inquiry-service` | 5005 | User-to-owner leads |

Listings go straight to `ACTIVE` on creation for now (no moderation queue yet), so whatever
an owner lists shows up in search immediately — intentional for fast testing.

## Prerequisites

- Node.js 20+
- MongoDB running somewhere reachable — either:
  - **Local install**: install MongoDB Community Server and it'll run on `mongodb://localhost:27017` by default (no config needed), or
  - **MongoDB Atlas** (free tier, no local install): create a free cluster at mongodb.com/atlas, then swap `MONGO_URI` in each service's `.env` to your Atlas connection string.

## Running everything with one command

```bash
npm run install:all   # installs dependencies for every service + both apps
npm run dev            # starts all 5 services, the gateway, and both frontends together
```

`.env` files are already created in every service/app folder (copied from `.env.example`)
so this works immediately with a local MongoDB. If you're using Atlas instead, edit the
`MONGO_URI` line in each of: `auth-service/.env`, `listing-service/.env`,
`location-service/.env`, `inquiry-service/.env`.

Once running:
- Public site: http://localhost:3000
- Owner dashboard: http://localhost:3001
- Gateway (API root): http://localhost:8080

## Seed a city/locality (needed once, before search works)

```bash
curl -X POST http://localhost:8080/api/locations \
  -H "Content-Type: application/json" \
  -d '{"city":"Lucknow","locality":"Gomti Nagar","pincode":"226010"}'
```

## Running a single service on its own

```bash
cd services/auth-service   # or whichever service/app
npm install
npm run dev
```

## Before pushing to GitHub

- `.env` files are gitignored on purpose — only `.env.example` is committed. Don't force-add
  the real `.env` files.
- Change `JWT_SECRET` to the same real random value in `auth-service`, `listing-service`,
  `media-service`, and `inquiry-service` before this goes anywhere beyond your machine —
  right now they all share the placeholder from `.env.example`.

## API surface (through the gateway, `http://localhost:8080`)

| Method | Path | Auth | Service |
|---|---|---|---|
| POST | `/api/auth/signup` | — | auth |
| POST | `/api/auth/login` | — | auth |
| GET | `/api/auth/me` | Bearer | auth |
| POST | `/api/listings` | Bearer (OWNER) | listing |
| GET | `/api/listings/search?city=&locality=&minRent=&maxRent=&bhk=&bathrooms=&furnishing=&type=` | — | listing |
| GET | `/api/listings/:id` | — | listing |
| GET | `/api/listings/mine/all` | Bearer (OWNER) | listing |
| PUT | `/api/listings/:id` | Bearer (OWNER) | listing |
| DELETE | `/api/listings/:id` | Bearer (OWNER) | listing |
| POST | `/api/media/upload` | Bearer | media |
| GET | `/api/locations/cities` | — | location |
| GET | `/api/locations/localities?city=` | — | location |
| GET | `/api/locations/search?q=` | — | location |
| POST | `/api/inquiries` | Bearer (USER) | inquiry |
| GET | `/api/inquiries/owner` | Bearer (OWNER) | inquiry |
| GET | `/api/inquiries/mine` | Bearer (USER) | inquiry |

## Frontends

### `apps/public-app` — the search site (port 3000)

Built for SEO and speed: server-rendered search/listing/locality pages, dynamic meta tags +
JSON-LD on listing pages, `/locality/[city]/[locality]` SEO landing pages auto-included in
`app/sitemap.js`, plain GET-form search (no JS required), self-hosted fonts via `next/font`.

### `apps/owner-app` — the listing dashboard (port 3001)

Plain client-rendered dashboard behind login: JWT in `localStorage`, listing CRUD with photo
upload, inquiries/leads view. Not indexed (`robots: noindex`) since it's gated anyway.

## What's next (reintroduce once the core flow is validated)

- **Docker**: containerize each service again once you're ready to deploy or want a
  one-command environment that matches production.
- **RabbitMQ + notification-service**: async events (e.g. email the owner when a new inquiry
  comes in) were removed for now — inquiries still save to the database, they just don't
  trigger a notification yet.
- **Admin moderation**: `listing.status` currently always starts `ACTIVE`; add a
  `PENDING_APPROVAL` review step before going live for real.
- **`auth-service` / `location-service` → MySQL**: both already isolate DB access behind a
  `repository` file (`userRepository.js`, `locationRepository.js`) so the migration touches
  one file per service.
- **Elasticsearch-backed search** once listing volume makes MongoDB filtering too slow.
- Swap `media-service`'s local disk storage for S3 before deploying anywhere without a
  persistent filesystem.
