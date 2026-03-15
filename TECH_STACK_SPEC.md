# Maase — Master Tech Stack Specification
**Version:** 1.0 | **Date:** March 2026 | **Status:** Active Development

---

## 1. Project Overview

**Maase** is India's hyperlocal home-cooked food marketplace. It connects home cooks (primarily homemakers) with nearby customers wanting authentic, daily home-cooked meals — within a 3km radius. Launching first in Bangalore.

**Business Model:** Home cooks list meals → customers pre-order → delivery partners fulfil — all within 3km.

---

## 2. Monorepo Structure

```
maase/
├── src/                        # Customer mobile app (root-level Expo)
├── apps/
│   ├── customer-app/           # (alias for root src/)
│   ├── cook-dashboard/         # Cook-facing web dashboard
│   ├── admin/                  # Internal admin panel
│   └── web/                    # Public marketing website (maaseindia.com)
├── services/
│   └── api/                    # REST API backend
├── packages/
│   ├── types/                  # Shared TypeScript types
│   ├── config/                 # Shared config (ESLint, TS, etc.)
│   └── ui/                     # Shared UI components
├── supabase/
│   └── schema.sql              # Full database schema
├── web-preview/                # Static landing page (Vercel)
│   ├── index.html              # Marketing landing page
│   ├── chef-profile.html       # Shareable chef profile page
│   └── supabase-schema.sql     # Pre-launch tables schema
└── turbo.json                  # Turborepo config
```

**Monorepo Tool:** Turborepo + pnpm workspaces

---

## 3. Application Breakdown

### 3.1 Customer Mobile App
**Path:** `/src/` (root) | **Bundle ID:** `com.maase.customerapp`

| Item | Detail |
|------|--------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Language | TypeScript 5.3 |
| Navigation | React Navigation 6 (NativeStack + BottomTabs) |
| Auth | Firebase Auth — Phone OTP + Google Sign-in |
| Database Client | Supabase JS v2 |
| Fonts | Playfair Display + Poppins (expo-google-fonts) |
| Location | expo-location |
| Storage | @react-native-async-storage/async-storage |
| Web Support | react-native-web (expo web) |

**Screens (11 total):**
- SplashScreen, LoginScreen, LocationScreen
- HomeScreen, MealDetailScreen, CartScreen
- PaymentScreen, OrderConfirmationScreen
- OrderTrackingScreen, OrdersScreen, ProfileScreen

**Key Features:**
- Phone OTP login (Firebase) + Google OAuth
- Hyperlocal meal feed (3km radius)
- Real-time batch availability (Supabase)
- Cart + payment flow (Razorpay)
- Order tracking
- "Feed a Neighbour" donation feature

---

### 3.2 Cook Dashboard
**Path:** `apps/cook-dashboard/` | **Stack:** Next.js 14 + Tailwind

| Item | Detail |
|------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.3 |
| Styling | Tailwind CSS 3.4 |
| Database Client | Supabase JS v2 |

**Purpose:** Web interface for home cooks to manage their daily menu, view orders, mark batches as ready, track earnings.

---

### 3.3 Admin Panel
**Path:** `apps/admin/`

Internal panel for the Maase operations team — cook verification, order oversight, metrics, dispute resolution.

---

### 3.4 Public Marketing Website
**Path:** `apps/web/` | **Stack:** Next.js 14 + Tailwind
**Live:** `maaseindia.com` (Vercel)

| Item | Detail |
|------|--------|
| Framework | Next.js 14 |
| Language | TypeScript 5.3 |
| Styling | Tailwind CSS 3.4 |

---

### 3.5 Pre-Launch Landing Page
**Path:** `web-preview/` | **Stack:** Pure HTML/CSS/Vanilla JS
**Live:** `web-preview-virid.vercel.app`

| Item | Detail |
|------|--------|
| Stack | Single-file HTML (no build step) |
| Database | Supabase JS v2 (CDN) |
| Fonts | Playfair Display + Poppins (Google Fonts) |
| Hosting | Vercel (auto-deploy via CLI) |
| Mobile | Fully responsive, bottom-sheet modal, iOS zoom fix |

**Purpose:** Marketing + pre-launch signups. Three live Supabase tables:
- `chef_applications` — 3-step chef onboarding form with referral codes
- `chef_nominations` — "Nominate Your Mom" form
- `waitlist` — Customer early access list

**Unique Features:**
- Referral code system (e.g. `SUNITA-7823`) — stored in Supabase, shareable via WhatsApp
- Shareable chef profile page (`chef-profile.html?name=...`) — URL-param based, fully static
- Live application count from Bangalore (real-time Supabase read)

---

## 4. Backend API
**Path:** `services/api/` | **Deployed on:** Railway

| Item | Detail |
|------|--------|
| Runtime | Node.js + TypeScript |
| Framework | Express 4 |
| ORM | Prisma 5 (PostgreSQL) |
| Auth | JWT (jsonwebtoken) |
| Validation | Zod |
| Payments | Razorpay SDK |
| Security | Helmet, CORS |
| Deploy | Railway (Nixpacks, auto-restart on failure) |
| Health Check | `GET /health` |

**API Route Groups:**

| Route Prefix | Module |
|---|---|
| `/api/profiles` | User profiles |
| `/api/cooks` | Cook management |
| `/api/meals` | Meal listings + batch |
| `/api/orders` | Order lifecycle |
| `/api/payments` | Razorpay webhook + verification |
| `/api/reviews` | Ratings + reviews |
| `/api/donations` | Feed a Neighbour |

---

## 5. Database
**Provider:** Supabase (PostgreSQL) | **Project:** `aaixsytygsjilgvebnfv`

### Core Tables

| Table | Purpose |
|---|---|
| `profiles` | Customer accounts (linked to Firebase auth) |
| `cooks` | Home cook profiles, locality, rating, online status |
| `meals` | Daily meal listings with batch_total, batch_remaining, cooked_at |
| `orders` | Full order lifecycle (placed → confirmed → ready → delivered) |
| `addresses` | Customer delivery addresses |
| `reviews` | Star ratings + comments |
| `donations` | "Feed a Neighbour" transactions |

### Pre-Launch Tables (landing page)

| Table | Purpose |
|---|---|
| `chef_applications` | Chef signup form with referral_code + referred_by |
| `chef_nominations` | Nominations submitted by community |
| `waitlist` | Customer early access list |

**Security:** Row Level Security (RLS) enabled on all tables. Anonymous insert/read policies on pre-launch tables.

**ORM:** Prisma schema (`services/api/prisma/schema.prisma`) maps all models with snake_case → camelCase mapping.

---

## 6. Authentication

| App | Method |
|---|---|
| Customer App | Firebase Auth — Phone OTP (primary) + Google OAuth |
| Cook Dashboard | Supabase Auth (email/password) |
| Admin Panel | Supabase Auth (role-based) |
| API | JWT tokens (signed with `JWT_SECRET`) |

**Firebase config files:** `google-services.json` (Android), `GoogleService-Info.plist` (iOS)

---

## 7. Payments
**Provider:** Razorpay

- Order payments via Razorpay SDK (mobile + web)
- Webhook endpoint: `POST /api/payments/webhook`
- Payment verification on server-side before order confirmation
- Cook payouts: UPI ID or bank account stored on Cook model

---

## 8. Infrastructure & DevOps

| Component | Provider |
|---|---|
| Mobile builds | Expo EAS Build |
| Landing page hosting | Vercel |
| Marketing website | Vercel |
| Cook Dashboard | Vercel |
| Backend API | Railway |
| Database | Supabase (hosted PostgreSQL) |
| Auth | Firebase (phone OTP) + Supabase Auth |
| File Storage | Supabase Storage (meal photos, cook avatars) |
| CDN/Assets | Supabase CDN |

---

## 9. Design System

**Brand Fonts:**
- Headlines: Playfair Display (serif, italic for quotes)
- Body: Poppins (400, 500, 600, 700)

**Brand Colors:**

| Token | Hex | Usage |
|---|---|---|
| Turmeric | `#F4A300` | Primary CTA, accents |
| Turmeric Deep | `#D98D00` | Button hover states |
| Ivory | `#F8F3E8` | Page background |
| Mocha | `#5C3A21` | Primary text |
| Mocha Soft | `#7b573e` | Secondary text |

**Design Principles:**
- Mobile-first (majority of users on Android/iOS)
- Minimum touch target: 48px
- Input font-size ≥ 16px (prevents iOS auto-zoom)
- Bottom-sheet modals on mobile
- 3km hyperlocal framing — never generic "India" language

---

## 10. Unique Product Features

| Feature | Description |
|---|---|
| **Cook's Kitchen Live** | Real cook timing shown to customer — when food was started today |
| **Maa's Batch** | True scarcity: 2 portions available = only 2 sold. No fake urgency |
| **Feed a Neighbour** | One-tap ₹120 donation to feed someone nearby, anonymously |
| **Referral System** | Each chef gets a unique code (e.g. `SUNITA-7823`) to invite others |
| **Shareable Chef Profile** | Static public URL per chef for WhatsApp sharing |
| **Nominate Your Mom** | Community-driven chef onboarding through nominations |

---

## 11. Environment Variables

### Customer App (`.env` / `app.config.js`)
```
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
EXPO_PUBLIC_RAZORPAY_KEY_ID
```

### API Service (`.env`)
```
DATABASE_URL           # Supabase pooled connection (Prisma)
DIRECT_URL             # Supabase direct connection (migrations)
JWT_SECRET
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
SUPABASE_SERVICE_ROLE_KEY
```

---

## 12. Development Setup

```bash
# Prerequisites
node 22+, pnpm, expo-cli, vercel-cli

# Install all workspaces
pnpm install

# Run customer app (tunnel for physical device)
./start-expo.sh            # or: npx expo start --tunnel

# Run API
cd services/api && npm run dev

# Run cook dashboard
cd apps/cook-dashboard && npm run dev

# Deploy landing page
cd web-preview && npx vercel --prod --yes
```

---

## 13. Launch Plan

| Phase | Scope |
|---|---|
| **Now** | Pre-launch landing page live, collecting chef applications + nominations + waitlist |
| **Phase 1** | Bangalore pilot — 5 areas (Koramangala, HSR, Whitefield, Indiranagar, BTM) |
| **Phase 2** | Scale Bangalore to 20 areas, onboard 50 verified home chefs |
| **Phase 3** | Second city expansion based on waitlist demand |

---

*Maase India · connect.maase@gmail.com · maaseindia.com*
