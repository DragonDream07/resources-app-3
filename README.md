# Shop — Frontend

A React + Vite storefront with Tailwind CSS, React Query, and React Router.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 18 |
| npm | >= 9 |

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template
cp .env.example .env

# 3. Fill in the values in .env (see Environment Variables below)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.  
All requests to `/api/*` are proxied to the backend dev server at `http://localhost:4000`.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Full base URL of the backend API, e.g. `http://localhost:4000/api` |
| `VITE_APP_TITLE` | No | Browser tab title. Defaults to `Shop` |
| `VITE_PAYMENT_KEY` | No | Public key for the payment gateway (Razorpay) |
| `VITE_MOCK_PAYMENTS` | No | Set to `true` to use the mock payment adapter in development |

All variables must be prefixed with `VITE_` to be exposed to the browser bundle.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all JS/JSX files |
| `npm test` | Run Jest unit tests |
| `npm run test:coverage` | Run tests with coverage report |

---

## Design Tokens

Design tokens live in `src/config/tailwind.config.js` and are merged into the root `tailwind.config.js`.

### Using tokens in components

```jsx
// Tailwind utility classes (preferred)
<button className="bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700">
  Add to cart
</button>

// Combining classes conditionally with clsx + tailwind-merge
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

<div className={cn('base-class', isActive && 'active-class')} />
```

Token categories defined in the theme extension:

- **Colors** — `primary`, `secondary`, `neutral`, `success`, `warning`, `error`
- **Typography** — font families, sizes, weights via Tailwind `font-*` utilities
- **Spacing** — extended spacing scale
- **Border radius** — `rounded-*` utilities
- **Shadows** — `shadow-*` utilities

---

## Route Map

| Path | Component | Auth |
|------|-----------|------|
| `/` | `Home` | Public |
| `/products` | `ProductListing` | Public |
| `/categories/:categoryId` | `CategoryProductListing` | Public |
| `/categories/:categoryId/products` | `CategoryProductListing` | Public |
| `/search` | `SearchResults` | Public |
| `/products/:productId` | `ProductDetail` | Public |
| `/cart` | `Cart` | Public |
| `/checkout/address` | `CheckoutAddress` | Public |
| `/checkout/review` | `CheckoutReview` | Public |
| `/checkout/payment` | `CheckoutPayment` | Public |
| `/checkout/confirmation` | `CheckoutConfirmation` | Public |
| `/checkout/guest-register` | `GuestPostCheckoutRegister` | Guest |
| `/auth/login` | `Login` | Guest |
| `/auth/register` | `Register` | Guest |
| `/auth/forgot-password` | `ForgotPassword` | Guest |
| `/auth/reset-password` | `ResetPassword` | Guest |
| `/account` | `AccountOverview` | Protected |
| `/account/profile` | `AccountProfile` | Protected |
| `/account/addresses` | `AccountAddresses` | Protected |
| `/account/addresses/new` | `AddressNew` | Protected |
| `/account/addresses/:addressId` | `AddressEdit` | Protected |
| `/account/orders` | `OrderHistory` | Protected |
| `/account/orders/:orderId` | `OrderDetail` | Protected |
| `/account/orders/:orderId/return` | `ReturnRequest` | Protected |
| `/account/notifications` | `Notifications` | Protected |
| `/admin` | `AdminDashboard` | Admin |
| `/admin/reports` | `AdminReports` | Admin |
| `/admin/orders` | `AdminOrderList` | Admin |
| `/admin/orders/:orderId` | `AdminOrderDetail` | Admin |
| `/admin/products` | `AdminProductList` | Admin |
| `/admin/products/new` | `AdminProductNew` | Admin |
| `/admin/products/:productId/edit` | `AdminProductEdit` | Admin |
| `/admin/categories` | `AdminCategoryList` | Admin |
| `/admin/categories/new` | `AdminCategoryNew` | Admin |
| `/admin/categories/:categoryId/edit` | `AdminCategoryEdit` | Admin |
| `/admin/brands` | `AdminBrandList` | Admin |
| `/admin/brands/new` | `AdminBrandNew` | Admin |
| `/admin/brands/:brandId/edit` | `AdminBrandEdit` | Admin |
| `/admin/promotions` | `AdminPromotionList` | Admin |
| `/admin/promotions/new` | `AdminPromotionNew` | Admin |
| `/admin/promotions/:promoId/edit` | `AdminPromotionEdit` | Admin |
| `/admin/returns` | `AdminReturnList` | Admin |
| `/admin/returns/:returnRequestId` | `AdminReturnDetail` | Admin |
| `/admin/users` | `AdminUserList` | Admin |
| `/admin/users/:userId` | `AdminUserDetail` | Admin |
| `*` | `NotFound` | Public |

---

## API Endpoints Reference

All requests go through the axios client configured in `src/api/client.js`. The base URL is read from `VITE_API_BASE_URL`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/search` | Full-text product search |
| GET | `/search/suggest` | Autocomplete suggestions |
| GET | `/products` | List products |
| GET | `/products/:productId` | Get single product |
| POST | `/products` | Create product (Admin) |
| PUT | `/products/:productId` | Update product (Admin) |
| DELETE | `/products/:productId` | Delete product (Admin) |
| POST | `/products/:productId/images` | Upload product images (Admin) |
| GET | `/products/:productId/images` | List product images |
| POST | `/products/:productId/skus` | Create SKU (Admin) |
| GET | `/products/:productId/skus` | List SKUs |
| PUT | `/products/:productId/skus/:skuId` | Update SKU (Admin) |
| GET | `/categories` | List categories |
| GET | `/categories/:categoryId` | Get category |
| GET | `/categories/:categoryId/products` | Products by category |
| POST | `/categories` | Create category (Admin) |
| PUT | `/categories/:categoryId` | Update category (Admin) |
| DELETE | `/categories/:categoryId` | Delete category (Admin) |
| GET | `/brands` | List brands |
| GET | `/brands/:brandId` | Get brand |
| POST | `/brands` | Create brand (Admin) |
| GET | `/carts/:cartId` | Get cart |
| POST | `/carts/:cartId/items` | Add item to cart |
| PATCH | `/carts/:cartId/items/:itemId` | Update cart item |
| DELETE | `/carts/:cartId/items/:itemId` | Remove cart item |
| POST | `/carts/:cartId/promo` | Apply promo code |
| GET | `/checkout/review` | Checkout review |
| POST | `/checkout/address` | Save checkout address |
| GET | `/serviceability` | Check pin-code serviceability |
| POST | `/checkout/place-order` | Place order |
| POST | `/payments/initiate` | Initiate payment |
| GET | `/orders` | List orders |
| GET | `/orders/:orderId` | Get order |
| POST | `/orders/:orderId/cancel` | Cancel order |
| POST | `/orders/:orderId/advance` | Advance order status (Admin) |
| GET | `/orders/:orderId/timeline` | Order status timeline |
| GET | `/orders/:orderId/tracking` | Order tracking info |
| GET | `/orders/:orderId/refunds` | Order refunds |
| POST | `/orders/:orderId/return-requests` | Create return request |
| GET | `/return-requests` | List return requests (Admin) |
| GET | `/return-requests/:returnRequestId` | Get return request |
| POST | `/return-requests/:returnRequestId/review` | Review return request (Admin) |
| GET | `/promo-codes` | List promo codes (Admin) |
| POST | `/auth/guest-register` | Register as guest |
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Register |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| GET | `/users/me` | Get current user |
| PATCH | `/users/me` | Update current user |
| POST | `/users/me/change-password` | Change password |
| GET | `/users/me/addresses` | List addresses |
| POST | `/users/me/addresses` | Create address |
| GET | `/users/me/addresses/:addressId` | Get address |
| PUT | `/users/me/addresses/:addressId` | Update address |
| DELETE | `/users/me/addresses/:addressId` | Delete address |
| GET | `/notifications` | List notifications |
| POST | `/notifications/read-all` | Mark all notifications read |
| POST | `/notifications/:notificationId/read` | Mark notification read |
| GET | `/admin/reports` | Admin reports |

---

## Project Structure

```
src/
  api/           # Axios client and per-resource API functions
  assets/        # Static images and icons
  components/    # Reusable UI components
  config/        # Tailwind token extensions, app config
  hooks/         # Custom React hooks
  pages/         # Route-level page components
  routes/        # Route guards and route definitions
  store/         # Global state (context / zustand)
  utils/         # Utility functions
  main.jsx       # App entry point
  App.jsx        # Root component with router and providers
  index.css      # Global styles / Tailwind directives
```
