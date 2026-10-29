# GoKart — Full Stack Grocery E-commerce Platform

A production-shaped MERN grocery store: role-based authentication, a full admin
catalogue workflow, cart and checkout, and an AI store assistant that answers
shopper questions by querying the database in plain English.

---

## 1. Project Overview

GoKart is a two-package application — a React storefront (`client/`) and an
Express + MongoDB API (`server/`) — that together cover the whole lifecycle of an
online grocery: an admin uploads categories, sub categories and products; a
shopper browses or searches them, builds a cart, saves delivery addresses and
places an order; the order then appears in their order history.

Three things distinguish it from a standard MERN CRUD app:

- **Role-based admin dashboard.** Product, category and sub category management
  lives behind an `ADMIN` role, with image uploads streamed to Cloudinary.
- **A token pair auth model.** Short-lived access tokens with long-lived refresh
  tokens, delivered as httpOnly cookies and mirrored in `localStorage` for
  cross-origin API calls.
- **An AI store assistant.** A chat widget that converts questions like
  *"eatables under 100 rs"* into a validated MongoDB query, runs it, and answers
  from the rows — with product cards you can add to the cart directly. It uses no
  embeddings and no vector database: the schema itself is the model's context.

The interface uses a custom design system — **Ink & Saffron** — with a full dark
mode, driven entirely by CSS custom properties.

---

## 2. Features

### Shopper

- Browse products by category and sub category, with weighted full-text search
- Product detail pages with image gallery, discount pricing and stock state
- Cart with live quantity control, running totals and savings breakdown
- Multiple saved delivery addresses
- Cash-on-delivery checkout, plus order history
- Register / login, email OTP password reset
- Light and dark theme, persisted per browser

### Admin

- Create, edit and delete categories, sub categories and products
- Multi-image product upload to Cloudinary, with custom key/value product fields
- Paginated, searchable product table
- Access gated by an `ADMIN` role on both the UI and the API

### AI store assistant

- Natural language → MongoDB query → grounded answer, in two model calls
- Answers about products, prices, stock, categories, and *your own* orders
- Renders real product cards inside the chat, each with a working Add button
- Declines anything off-topic (code, general knowledge, other stores)
- Hard security boundary: collection/field/operator allowlists, forced user
  scoping, and a `users` collection that is simply unreachable

---

## 3. Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│  BROWSER — React 18 SPA (Vite build, deployed on Vercel)                  │
│  Redux Toolkit store · React Router · Tailwind (Ink & Saffron tokens)     │
│  Axios instance: baseURL = VITE_API_URL, withCredentials, Bearer token    │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ HTTPS  /api/*
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  EXPRESS API (server/)                                                    │
│  cors(credentials) · express.json · cookie-parser · morgan · helmet       │
│                                                                          │
│  route/  ──►  middleware/  ──►  controllers/  ──►  models/               │
│               auth · admin        business logic     Mongoose schemas     │
│               optionalAuth                                                │
└───┬──────────────┬───────────────┬───────────────┬───────────────┬───────┘
    │              │               │               │               │
    ▼              ▼               ▼               ▼               ▼
┌────────┐   ┌───────────┐   ┌──────────┐   ┌───────────┐   ┌──────────────┐
│MongoDB │   │Cloudinary │   │  Stripe  │   │Gmail SMTP │   │  Gemini API  │
│ Atlas  │   │  images   │   │ payments │   │ OTP mail  │   │  assistant   │
└────────┘   └───────────┘   └──────────┘   └───────────┘   └──────────────┘
```

### The assistant pipeline (`/api/chat`)

```
"eatables under 100 rs"
        │
        ▼
┌─────────────────────────────────────────────┐
│ chat.controller.js                          │
│ rate limit · history · optional auth        │
└───────────────┬─────────────────────────────┘
                ▼
      ┌──────────────────────────┐   system prompt =
      │ Gemini (function calling)│   schema card + live category
      │ proposes a query         │   vocabulary + rules + few-shots
      └───────────┬──────────────┘
                  │ { collection, filter, sort, limit }
                  ▼
      ┌──────────────────────────────────────────┐
      │ chat/guardrail.js   ◄── SECURITY BOUNDARY│
      │ • collection + field + operator allowlist│
      │ • userId forced from JWT on personal data│
      │ • $where / $function / $lookup rejected  │
      │ • $regex escaped to a literal substring  │
      │ • limit capped at 20                     │
      │ rejected ──► reason returned to the model│
      │              which corrects and retries  │
      └───────────┬──────────────────────────────┘
                  ▼
      ┌──────────────────────────┐
      │ chat/executeQuery.js     │──► MongoDB (read-only)
      │ adds _effectivePrice     │
      └───────────┬──────────────┘
                  ▼ rows
      ┌──────────────────────────┐
      │ Gemini phrases the answer│──► reply text + product cards
      └──────────────────────────┘
```

`_effectivePrice` is a computed field — `price - ceil(price × discount / 100)` —
so "under 100 rupees" means the price the shopper actually sees, not the
pre-discount price.

---

## 4. Technology

| Layer | Technology | Version | Role |
|---|---|---|---|
| **Frontend** | React | ^18.3.1 | UI library |
| | Vite | ^6.0.5 | Dev server and build |
| | Redux Toolkit | ^2.5.1 | User, cart, product, address, order state |
| | React Router | ^7.1.3 | Routing, nested dashboard layout |
| | Tailwind CSS | ^3.4.17 | Token-driven styling, class-based dark mode |
| | Axios | ^1.7.9 | HTTP client with auth interceptors |
| | React Hook Form | ^7.54.2 | Address and product forms |
| | TanStack Table | ^8.21.2 | Admin sub category table |
| | react-hot-toast / SweetAlert2 | ^2.5.1 / ^11.17.2 | Notifications |
| **Backend** | Node.js | ≥ 18 | Runtime (global `fetch` required) |
| | Express | ^4.21.2 | HTTP framework |
| | Mongoose | ^8.9.5 | ODM and schema validation |
| | jsonwebtoken | ^9.0.2 | Access and refresh tokens |
| | bcryptjs | ^2.4.3 | Password hashing |
| | Multer | ^1.4.5 | In-memory file uploads |
| | Helmet / CORS / Morgan | ^8 / ^2.8.5 / ^1.10 | Headers, origin policy, logging |
| **Data** | MongoDB Atlas | — | Primary datastore, weighted text index |
| **Services** | Cloudinary | ^2.5.1 | Image hosting |
| | Stripe | ^17.7.0 | Card payments (checkout session) |
| | Nodemailer | ^6.9.16 | OTP and verification email |
| | Google Gemini | 2.5 Flash | Natural language → MongoDB query |
| **Hosting** | Vercel | — | Client and API deployment |

---

## 5. Installation

### Prerequisites

- Node.js 18 or newer (the assistant uses the global `fetch` API)
- A MongoDB database — Atlas or a local `mongod`
- Accounts for Cloudinary, Stripe and Google AI Studio (all have free tiers)
- A Gmail account with an **app password** for outgoing mail

### Clone

```bash
git clone <your-repo-url> GoKart
cd GoKart
```

### Backend

```bash
cd server
npm install
```

Create `server/.env`:

```ini
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/gokart
FRONTEND_URL=http://localhost:5173

SECRET_KEY_ACCESS_TOKEN=any-long-random-string
SECRET_KEY_REFRESH_TOKEN=another-long-random-string

CLODINARY_CLOUD_NAME=your-cloud-name
CLODINARY_API_KEY=your-api-key
CLODINARY_API_SECRET_KEY=your-api-secret

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_ENPOINT_WEBHOOK_SECRET_KEY=whsec_xxx

SEND_GMAIL=your-gmail-app-password
GEMINI_API_KEY=your-gemini-api-key
```

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URL` | **Yes** | The server exits on startup if this is missing |
| `FRONTEND_URL` | **Yes** | Exact origin allowed by CORS; no trailing slash |
| `SECRET_KEY_ACCESS_TOKEN` | **Yes** | Signs the 1-hour access token |
| `SECRET_KEY_REFRESH_TOKEN` | **Yes** | Signs the 7-day refresh token |
| `CLODINARY_*` | For uploads | Note the spelling — the code reads `CLODINARY`, not `CLOUDINARY` |
| `STRIPE_SECRET_KEY` | **Yes** | `config/stripe.js` throws at import if absent, so the server will not boot without it — use any `sk_test_` value in development |
| `STRIPE_ENPOINT_WEBHOOK_SECRET_KEY` | No | Spelling matches the code (`ENPOINT`), currently unused |
| `SEND_GMAIL` | For email | Gmail **app password**, not the account password. The sender address is hardcoded in `config/sendEmail.js` — change it to your own |
| `GEMINI_API_KEY` | For chat | Without it the chat route returns 503 and the rest of the store runs normally |
| `GEMINI_MODEL` | No | Defaults to `gemini-2.5-flash` |
| `PORT` | No | Ignored — `index.js` always listens on **8080** |

Start it:

```bash
npm run dev     # nodemon
npm start       # plain node
```

### Frontend

```bash
cd ../client
npm install
```

Create `client/.env`:

```ini
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
```

> Only `VITE_`-prefixed variables reach the browser, and everything that does is
> **public**. Never put the Gemini key, the Stripe secret key or any other
> credential in `client/.env`.

```bash
npm run dev       # http://localhost:5173
npm run build     # production bundle into dist/
npm run preview   # serve the built bundle
```

### Create your first admin

Roles are not editable from the UI. Register through the app, then flip the role
in the database:

```bash
mongosh "<your MONGODB_URL>" --eval '
  db.users.updateOne({ email: "you@example.com" }, { $set: { role: "ADMIN" } })
'
```

Log out and back in — the admin menu items appear in the account dropdown.

---

## 6. Usage

### As a shopper

1. **Browse** — the home page lists every category; click one to open its product
   list, or use the search bar in the header.
2. **Add to cart** — the Add button turns into a quantity stepper. Cart totals and
   savings update live in the header and in the cart drawer.
3. **Checkout** — open the cart, press *Checkout*, choose or add a delivery
   address, then *Pay on delivery*. The order lands in
   **Account → My orders**.
4. **Theme** — the sun/moon button in the header toggles dark mode; the choice is
   remembered per browser and defaults to your OS setting.

### As an admin

Open the account menu → **Store admin**:

| Page | What you can do |
|---|---|
| Categories | Add, rename, re-image, delete (blocked while products still use it) |
| Sub categories | Same, plus assign each to one or more parent categories |
| Upload product | Name, description, images, category, sub category, unit, stock, price, discount, plus custom fields |
| Products | Paginated grid with debounced search, inline edit and delete |

### Using the assistant

Click the chat button at the bottom-right. It understands, for example:

| Question | What happens |
|---|---|
| "eatables under 100 rs" | Maps *eatables* to every edible category, filters on discounted price, sorts cheapest first |
| "do you have paneer?" | Case-insensitive name search |
| "cheapest cold drink" | Category filter + price sort, limit 1 |
| "show me my last orders" | Reads **your** orders only — asks you to log in if you are not |
| "do you deliver same day?" | Answered from store facts, no database call |
| "write me a python script" | Politely declined |

Product results appear as cards inside the chat and can be added to the cart
without leaving the conversation.

> **Free-tier quota.** A free Gemini key allows roughly **20 requests per day per
> model**, and each chat message costs two (one to build the query, one to phrase
> the answer) — about 10 messages a day in total. Enable billing on the Google
> Cloud project before real traffic; until then users see "I'm handling a lot of
> questions right now".

---

## 7. Project Structure

```
GoKart/
├── client/                            React storefront
│   ├── index.html                     Pre-paint theme script, favicon, title
│   ├── tailwind.config.js             Semantic colour tokens, fonts, shadows
│   └── src/
│       ├── main.jsx                   Root: ThemeProvider → Redux → Router
│       ├── App.jsx                    Shell: header, outlet, footer, chat widget
│       ├── index.css                  Design tokens (light/dark) + component classes
│       ├── route/index.jsx            All routes, incl. nested dashboard
│       ├── common/SummaryApi.js       Central endpoint map used by every call
│       ├── utils/                     Axios instance, price/discount, formatting
│       ├── store/                     Redux slices: user, product, cart, address, order
│       ├── provider/
│       │   ├── GlobalProvider.jsx     Cart/address/order fetching and totals
│       │   └── ThemeProvider.jsx      Dark mode state and persistence
│       ├── layout/                    Dashboard shell, AdminPermission gate
│       ├── components/                Header, cards, modals, ChatWidget, …
│       └── pages/                     Home, product list/detail, auth, admin pages
│
├── server/                            Express API
│   ├── index.js                       App setup and route mounting
│   ├── config/
│   │   ├── connectDB.js               Mongoose connection
│   │   ├── gemini.js                  Gemini key, model, retry/timeout handling
│   │   ├── stripe.js                  Stripe client
│   │   └── sendEmail.js               Nodemailer transport
│   ├── middleware/
│   │   ├── auth.js                    Requires a valid access token
│   │   ├── optionalAuth.js            Allows guests; attaches userId when present
│   │   ├── Admin.js                   Requires role ADMIN
│   │   └── multer.js                  In-memory upload handling
│   ├── models/                        user, product, category, subCategory,
│   │                                  cartproduct, address, order
│   ├── route/                         One router per resource
│   ├── controllers/                   Business logic per resource
│   ├── chat/                          ── the AI assistant ──
│   │   ├── schema.js                  Schema card, store facts, few-shots, tool spec
│   │   ├── vocabulary.js              Live category names → ids (1 hour cache)
│   │   ├── guardrail.js               Validates every model-authored query
│   │   └── executeQuery.js            Runs the validated plan, adds _effectivePrice
│   ├── utils/                         Tokens, OTP, Cloudinary upload, email templates
│   └── vercel.json                    Deployment config
│
└── README.md
```

### API reference

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/user/register` | — | Create account, send verification mail |
| POST | `/api/user/login` | — | Issue access + refresh tokens |
| GET | `/api/user/logout` | User | Clear cookies, wipe stored refresh token |
| GET | `/api/user/user-details` | User | Current profile |
| PUT | `/api/user/update-details` | User | Update name, email, mobile, password |
| PUT | `/api/user/upload-avatar` | User | Avatar → Cloudinary |
| PUT | `/api/user/forgot-password` | — | Email a 6-digit OTP |
| PUT | `/api/user/verify-forgot-password-otp` | — | Verify that OTP |
| PUT | `/api/user/reset-password` | — | Set a new password |
| POST | `/api/user/refresh` | Refresh token | Issue a new access token |
| GET | `/api/category/get-category` | — | List categories |
| POST/PUT/DELETE | `/api/category/*` | User¹ | Create, update, delete |
| POST | `/api/subcategory/get` | — | List sub categories |
| POST/PUT/DELETE | `/api/subcategory/*` | User¹ | Create, update, delete |
| POST | `/api/product/get` | — | Paginated products, optional text search |
| POST | `/api/product/get-product-by-category` | — | Products in a category |
| POST | `/api/product/get-pruduct-by-category-and-subcategory` | — | Products in both |
| POST | `/api/product/get-product-details` | — | One product |
| POST | `/api/product/search-product` | — | Full-text search |
| POST/PUT/DELETE | `/api/product/*` | **Admin** | Create, update, delete |
| POST | `/api/cart/create` | User | Add item |
| GET | `/api/cart/get` | User | Read cart |
| PUT | `/api/cart/update-qty` | User | Change quantity |
| DELETE | `/api/cart/delete-cart-item` | User | Remove item |
| POST | `/api/address/create` | User | Save address |
| GET | `/api/address/get` | User | List addresses |
| PUT | `/api/address/update` | User | Edit address |
| DELETE | `/api/address/disable` | User | Soft-delete address |
| POST | `/api/order/cash-on-delivery` | User | Place a COD order |
| POST | `/api/order/checkout` | User | Create a Stripe checkout session |
| POST | `/api/order/webhook` | Stripe | Payment callback |
| GET | `/api/order/order-list` | User | Order history |
| POST | `/api/file/upload` | User | Image → Cloudinary |
| POST | `/api/chat` | Optional | Store assistant |

¹ These routes currently check only that you are logged in — see *Known limitations*.

---

## 8. Workflows

### Authentication

```
register ──► bcrypt hash (10 rounds) ──► user saved ──► verification email sent
                                                              │
login ──► compare password ──► sign access token (1 h)         │
                            └─ sign refresh token (7 d), stored on the user doc
                               │
                               ├─ both set as httpOnly, secure, SameSite=None cookies
                               └─ both returned in the body → localStorage
                                  (Axios sends the access token as a Bearer header,
                                   which is what makes cross-origin calls work)

every protected request ──► middleware/auth.js verifies the token ──► request.userId
admin-only request      ──► middleware/Admin.js loads the user, checks role
```

### Ordering

```
Add to cart ──► cartProduct row (userId + productId + quantity)
     │           GlobalProvider refetches and recomputes totals
     ▼
Checkout ──► choose address ──► POST /api/order/cash-on-delivery
     │                            │
     │                            ├─ one order document per cart line
     │                            ├─ cart rows deleted
     │                            └─ user.shopping_cart emptied
     ▼
Success page ──► order visible under My orders
```

Prices shown anywhere in the UI come from `pricewithDiscount(price, discount)` —
`price - ceil(price × discount / 100)` — and the assistant mirrors that exact
formula in the database so both agree to the rupee.

### Catalogue management

```
Admin picks an image ──► multer holds it in memory ──► Cloudinary upload_stream
                                                            │
                                                    secure URL returned
                                                            ▼
                                     saved on the product / category document
```

Deleting a category first counts the sub categories and products referencing it
and refuses if any exist, so the catalogue cannot be orphaned.

### Assistant

1. The shopper's message, the last six turns, and the system prompt (schema card +
   live category vocabulary + rules + examples) go to Gemini.
2. Gemini either answers directly (store facts, refusals) or calls `queryStore`
   with a proposed collection, filter, sort and limit.
3. `guardrail.js` validates that proposal. If it fails, the reason is handed back
   to the model, which corrects itself and retries — capped at two tool calls.
4. `executeQuery.js` runs the approved plan against MongoDB, read-only, with a
   2.5-second server-side time limit and `_effectivePrice` computed in the pipeline.
5. The rows return to Gemini, which phrases a short answer; product rows are also
   sent to the browser as cards.

Every executed query is logged as `question → filter → row count`, which is the
first place to look when an answer seems wrong.

---

## Design System

The UI runs on a token-driven theme called **Ink & Saffron**: ink-navy chrome,
warm cream surfaces, a saffron accent, Sora for display type and Inter for body.

- Colours are CSS custom properties in `client/src/index.css`, exposed to Tailwind
  as semantic names (`bg-surface`, `text-fg-muted`, `border-line`, `bg-brand`).
- Reusable primitives — `.btn-primary`, `.card`, `.panel`, `.input`, `.chip`,
  `.modal` — live in the `@layer components` block of the same file.
- Dark mode is class-based. The toggle sits in the header, persists to
  `localStorage` under `gokart-theme`, defaults to the OS preference, and is
  applied before first paint by an inline script in `index.html`.

To restyle the entire application, change the token values — not the components.

---

## Deployment

Both packages deploy to Vercel from the same repository, as two projects:

- **client** — build `npm run build`, output `dist`. Set `VITE_API_URL` to the
  deployed API origin and `VITE_STRIPE_PUBLIC_KEY`.
- **server** — deployed via `server/vercel.json`. Set every backend variable from
  the table above as project environment variables.

Secrets belong in Vercel's environment settings, never in the repository — the
code reads `GEMINI_API_KEY` from the environment and has no hardcoded fallback.
After changing a variable, redeploy for it to take effect.

---

## Known Limitations

Tracked in `Bugs.txt`, and worth knowing before you build on this:

| Area | Issue |
|---|---|
| Authorisation | Category, sub category and upload routes check only `auth`, not `admin`, so any logged-in user can modify the catalogue through the API |
| Stock | Ordering does not decrement `stock`, so "in stock" can be wrong — and the assistant repeats that inaccuracy |
| Payments | The Stripe path is implemented but not surfaced in the checkout UI; the webhook does not verify its signature and receives a parsed rather than raw body |
| Order totals | Amounts come from the client request body, and each per-product order row stores the whole cart total |
| Email | Verification links are generated but login does not require a verified address |
| Password reset | OTP expiry compares a `Date` with a string, and the reset step does not re-check that the OTP was verified |
| Token refresh | The refresh controller reads `_id` from a payload signed with `id`, so refreshed tokens carry no user id |
| Home page | Editing a category does not refresh the storefront until reload; category URLs assume a product's first category |

---

*Built in 2025.*
