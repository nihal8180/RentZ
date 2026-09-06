# RentZ — auth-service

Handles signup, login, JWT issuance, and role management (`OWNER`, `USER`, `ADMIN`) for the RentZ platform.

## Setup

```bash
cd services/auth-service
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

Runs on `PORT` from `.env` (default `5001`).

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | none | Register as OWNER or USER |
| POST | `/api/auth/login` | none | Login, returns JWT |
| GET | `/api/auth/me` | Bearer token | Get current user profile |
| GET | `/health` | none | Health check |

## Architecture note: repository pattern

`src/repositories/userRepository.js` is the **only** file that talks to Mongoose directly.
Controllers call the repository, never the model. When RentZ migrates this service
from MongoDB to MySQL later, only `userRepository.js` needs to be rewritten (e.g. with
Sequelize or Prisma) — as long as the exported function signatures
(`findByEmail`, `findById`, `createUser`, `updateUser`, `deactivateUser`) stay the same,
nothing else in the service changes.

## JWT payload

```json
{ "userId": "...", "role": "OWNER|USER|ADMIN" }
```

Other RentZ services (listing-service, inquiry-service, etc.) verify this same token
using the shared `JWT_SECRET` — copy `authMiddleware.js` into any service that needs
`requireAuth` / `requireRole`.
