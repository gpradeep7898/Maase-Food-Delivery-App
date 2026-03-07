# 🍛 Maase — Home-cooked meals from your neighbourhood

> Order authentic home-cooked meals from verified local home cooks. Fresh, affordable, made with love.

[![Live Demo](https://img.shields.io/badge/demo-web--preview-F4A300)](https://web-preview-virid.vercel.app)
[![GitHub](https://img.shields.io/badge/github-Maase--Food--Delivery--App-5C3A21)](https://github.com/gpradeep7898/Maase-Food-Delivery-App)

---

## Architecture

```
maase-monorepo/
├── apps/
│   ├── customer-app/      # React Native + Expo (iOS & Android)
│   ├── cook-dashboard/    # Next.js 14 — Cook management portal
│   ├── admin/             # Next.js 14 — Admin dashboard (planned)
│   └── web/               # Next.js 14 — maaseindia.com public site
├── services/
│   └── api/               # Node/Express/TypeScript/Prisma backend
├── packages/
│   ├── types/             # Shared TypeScript types
│   ├── config/            # Shared config & utilities
│   └── ui/                # Shared UI components (planned)
├── supabase/
│   └── schema.sql         # Production Supabase schema + RLS
└── web-preview/           # Investor demo (deployed on Vercel)
```

## Tech Stack

| Layer | Tech |
|---|---|
| Customer App | React Native 0.76, Expo SDK 54 |
| Cook Dashboard | Next.js 14 (App Router) + Tailwind |
| Public Website | Next.js 14 + Tailwind |
| Backend API | Node.js + Express + TypeScript + Prisma |
| Database | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| Payments | Razorpay (UPI, cards) |
| Deployment | Vercel (web/dashboard), Railway (API), EAS (mobile) |
| Monorepo | pnpm workspaces + Turborepo |

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- Supabase account
- Razorpay account (test mode)

### 1. Install dependencies
```bash
corepack enable pnpm
pnpm install
```

### 2. Configure environment

**API** (`services/api/.env`):
```env
PORT=4000
DATABASE_URL=postgresql://postgres:PASSWORD@db.YOUR_PROJECT.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your-secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Cook Dashboard** (`apps/cook-dashboard/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Set up database
```bash
# Run the Supabase schema
# Go to Supabase dashboard -> SQL Editor -> paste supabase/schema.sql

# Generate Prisma client
pnpm --filter @maase/api run db:generate

# Push Prisma schema to DB
pnpm --filter @maase/api run db:push
```

### 4. Run all services
```bash
# Run everything in parallel
pnpm dev

# Or individually:
pnpm dev:api        # http://localhost:4000
pnpm dev:cook       # http://localhost:3001
pnpm dev:web        # http://localhost:3002
pnpm dev:app        # Expo Dev Server
```

## Screens (Customer App)

| Screen | Description |
|---|---|
| Splash | Brand intro, 2.2s timer |
| Login | Phone number + OTP (Supabase Auth) |
| Location | GPS/manual address selection |
| Home | Live meals feed, search, filters, Maa Online Banner |
| Meal Detail | Cook story, batch progress, FeedANeighbour |
| Cart | Quantity controls, bill breakdown |
| Payment | Razorpay UPI/Card integration |
| Order Confirmation | Success state, order ID |
| Order Tracking | Realtime status via Supabase |
| Orders | Order history |
| Profile | Diet preferences, addresses, sign out |

## API Endpoints

```
GET    /health
GET    /api/meals             - list available meals
GET    /api/meals/:id         - meal detail
POST   /api/meals             - cook: create meal
PATCH  /api/meals/:id         - cook: update meal

POST   /api/orders            - place order (post-payment)
GET    /api/orders/mine       - customer's orders
GET    /api/orders/:id        - order detail
PATCH  /api/orders/:id/status - cook: update status
GET    /api/orders/cook/queue - cook's active queue

POST   /api/payments/create-order   - Razorpay order
POST   /api/payments/verify         - verify signature
GET    /api/payments/cook/earnings  - cook earnings

GET    /api/cooks             - list cooks
GET    /api/cooks/me          - cook profile
POST   /api/cooks             - onboard cook
PATCH  /api/cooks/me          - update profile
PATCH  /api/cooks/me/toggle-online

POST   /api/reviews           - post review
POST   /api/donations         - feed a neighbour
GET    /api/donations/stats

GET    /api/profiles/me       - customer profile
PATCH  /api/profiles/me       - update profile
POST   /api/profiles/me/addresses
```

## Deployment

### API -> Railway
```bash
railway link
railway up --service api
```

### Cook Dashboard -> Vercel
```bash
cd apps/cook-dashboard
vercel --prod
```

### Public Website -> Vercel
```bash
cd apps/web
vercel --prod
```

### Customer App -> EAS
```bash
cd apps/customer-app
eas build --platform all --profile production
eas submit --platform all
```

## Unique Features

### 1. MaaOnlineBanner
Real-time banner showing which cook is currently online and cooking. Pulsing green dot, dismissible, spring animation.

### 2. TomorrowSection
Reserve tomorrow's meals today. Horizontal scroll of upcoming batches. Reduces food waste, helps cooks plan ahead.

### 3. FeedANeighbour
Donate a meal to someone in need. Social impact built into every order. Batch-safe with real inventory decrements.

## Brand

| Token | Value |
|---|---|
| Turmeric | #F4A300 |
| Mocha | #5C3A21 |
| Ivory | #F8F3E8 |
| Display font | Playfair Display 700 |
| Body font | Poppins 400/500/600/700 |

---

Built with love by [Pradeep Gatti](https://github.com/gpradeep7898)
