# Hi-Zer Pharma & Nutraceutical — Frontend

React + TypeScript + Vite + Tailwind storefront and admin panel for Hi-Zer Pharma & Nutraceutical.

## Setup

```bash
npm install
```

## Run

This project talks to a separate backend API in the sibling `Hi-Zer-Pharma-Nutraceutical backend/` folder. Start both:

```bash
# terminal 1 — backend (from Hi-Zer-Pharma-Nutraceutical backend/)
npm run dev

# terminal 2 — frontend (from this folder)
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api/*` requests to the backend on `http://localhost:5000` (see `vite.config.ts`). No CORS setup needed in dev.

## Other scripts

```bash
npm run build       # production build
npm run typecheck   # TypeScript check with no emit
```

## Structure

```
src/app/
  App.tsx              # providers + router mount
  routes/router.tsx     # all route definitions (storefront + admin)
  pages/storefront/     # Home, Shop, ProductDetail, Cart, Checkout, OrderTracking, About
  pages/admin/           # Login, Dashboard, Products, Categories, Orders, Customers, Settings
  components/layout/     # Navbar, Footer, Logo, StorefrontLayout
  components/admin/      # AdminLayout, AdminSidebar, AdminGuard, StatWidget
  components/storefront/ # ProductCard
  components/common/     # StatusBadge, RxBadge
  components/ui/         # shadcn/radix primitives (unchanged)
  context/                # AuthContext (admin-only), CartContext (localStorage)
  api/                    # typed fetch client + one module per resource
  hooks/                  # useAuth, useCart, useDebounce
  types/                  # shared TypeScript interfaces
  lib/constants.ts        # fmt(), fonts, delivery threshold
```

## Notes

- **No customer accounts** — checkout is guest-only. Cart lives in `localStorage`, cleared on successful order.
- **Admin** is only reachable at `/admin` (never linked from the storefront nav/footer), gated by `AdminGuard` + a real JWT-backed login.
- `@mui/material` / `@emotion/*` are installed but unused (all UI uses the Radix-based `components/ui/*` kit) — safe to remove if you want to trim dependencies.
