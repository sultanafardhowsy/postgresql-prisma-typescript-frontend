# Stockroom — Storefront

A React (Vite) frontend for the SCIC/EJP-13 e-commerce backend. Full customer
shopping flow plus a role-gated admin dashboard, talking to your Express +
Prisma API over REST.

## Stack

- React 19 + Vite
- React Router 6
- Tailwind CSS v4
- Axios
- lucide-react (icons)

Plain JavaScript (JSX), no TypeScript.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Point it at your backend

Copy the example env file:

```bash
cp .env.example .env
```

By default it expects your API at `http://localhost:5000/api/v1`. Edit `.env`
if your backend runs somewhere else:

```
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Run it

Make sure your backend (`Level-1-Express-TypeScript-Prisma`) is running
first, then in a separate terminal:

```bash
npm run dev
```

Visit `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## How auth works

- Register/login store a JWT in `localStorage` (`stockroom_token`) via
  `AuthContext`.
- Every request through `src/lib/api.js` automatically attaches
  `Authorization: Bearer <token>`.
- `ProtectedRoute` guards logged-in-only pages (cart, checkout, orders).
- `AdminRoute` guards `/admin/*` — only visible/reachable for users whose
  `role` is `ADMIN`.

To test the admin dashboard: register a normal account, promote it to
`ADMIN` in Prisma Studio on the backend, then log in again in this app (a
fresh login re-issues a token with the updated role).

## Project Structure

```text
src/
├── lib/
│   └── api.js              # axios instance, injects JWT, normalizes errors
├── context/
│   ├── AuthContext.jsx      # login / register / logout / current user
│   ├── CartContext.jsx      # cart state, synced with the backend
│   └── ToastContext.jsx     # lightweight toast notifications
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── StarRating.jsx
│   ├── Modal.jsx
│   ├── AdminLayout.jsx      # sidebar shell for /admin/*
│   ├── ProtectedRoute.jsx
│   └── AdminRoute.jsx
└── pages/
    ├── Home.jsx              # catalog, search, category filter
    ├── ProductDetail.jsx     # product info, add to cart, reviews
    ├── Login.jsx / Register.jsx
    ├── Cart.jsx
    ├── Checkout.jsx
    ├── Orders.jsx / OrderDetail.jsx
    └── admin/
        ├── Dashboard.jsx
        ├── Products.jsx
        ├── Categories.jsx
        ├── Orders.jsx
        ├── Users.jsx
        └── Reviews.jsx
```

## Notes

- The cart is stored server-side (your `/cart-items` API), not in
  `localStorage` — `CartContext` just mirrors what the backend has for the
  logged-in user.
- Placing an order calls `POST /orders` with an empty body, which tells the
  backend to build the order from the user's saved cart, decrement stock,
  and clear the cart — matching how the API was built.
- Review submissions start as `PENDING` and only show on the product page
  once an admin sets them to `APPROVED` (via Admin → Reviews).
