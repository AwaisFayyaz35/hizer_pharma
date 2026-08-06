# Hi-Zer Pharma & Nutraceutical — Backend

Node.js + Express + MongoDB (Mongoose) API for the Hi-Zer Pharma storefront and admin panel.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` (already done) and fill in real values:

- `MONGO_URI` — a local MongoDB instance (`mongodb://localhost:27017/hizer_pharma`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string.
- `JWT_SECRET` — replace with a long random string.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your [Cloudinary](https://cloudinary.com) dashboard (used for product images and prescription uploads).
- `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` — the first admin account's credentials.

## Run

```bash
npm run dev          # starts the API on http://localhost:5000 (nodemon)
```

The frontend (`Hi-Zer-Pharma-Nutraceutical frontend/`) proxies `/api/*` to this server in dev — start both.

## Seed data

```bash
npm run seed:admin     # creates the first admin account from .env
npm run seed:catalog   # seeds the 8 starter categories + 8 starter products
```

## Project structure

```
src/
  config/       # db, cloudinary, constants
  models/       # Mongoose schemas
  controllers/  # request handlers
  routes/       # route definitions, mounted under /api
  middleware/   # auth (JWT), error handling, file upload
  utils/        # helpers + one-off seed scripts
  app.js        # Express app (middleware + routes)
  server.js     # entry point (connects DB, starts listening)
```

## Notes

- **Auth**: there are no customer accounts. Checkout is guest-only (name/email/phone/address captured per order). Only `/api/auth/login` exists, for admin/staff. The JWT is stored in an httpOnly cookie.
- **Payments**: Cash on Delivery only.
- **Order tracking**: public lookup via `GET /api/orders/track?orderNumber=...&contact=email-or-phone` — no login required.
