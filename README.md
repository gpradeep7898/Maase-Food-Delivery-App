# 🍱 Maase — Customer App

> "One extra meal from ma" — A food delivery platform connecting customers with home cooks.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

You'll also need the Google Fonts packages:
```bash
npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/poppins
```

### 2. Start the dev server

```bash
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with **Expo Go** app on your real phone

---

## Project Structure

```
maase/
├── App.tsx                     # Entry point, font loading
├── app.json                    # Expo config
├── src/
│   ├── constants/
│   │   ├── theme.ts            # Colors, typography, spacing
│   │   └── mockData.ts         # Mock meals, cooks, orders
│   ├── types/
│   │   └── index.ts            # All TypeScript types
│   ├── utils/
│   │   ├── supabase.ts         # Supabase client (add your keys)
│   │   └── cart.ts             # Cart calculation utilities
│   ├── components/
│   │   ├── ui.tsx              # Shared UI components
│   │   └── MealCard.tsx        # Meal card component
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── LocationScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── MealDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── PaymentAndTracking.tsx  # Payment + Confirmation + Tracking
│   │   └── OrdersAndProfile.tsx    # Orders list + Profile
│   └── navigation/
│       └── AppNavigator.tsx    # All navigation config
└── assets/                     # App icons, splash screen
```

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `Colors.turmeric` | `#F4A300` | Primary buttons, active states |
| `Colors.ivory` | `#F8F3E8` | App background |
| `Colors.mocha` | `#5C3A21` | Text, accents, headers |
| Font: Display | Playfair Display 700 | Titles, meal names |
| Font: Body | Poppins 400–700 | All body text |

---

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy your **Project URL** and **anon key**
4. Paste them into `src/utils/supabase.ts`

### Database tables needed (SQL):

```sql
-- Users (handled by Supabase Auth)

-- Meals
create table meals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price integer not null,
  cuisine text,
  tags text[],
  cook_id uuid references auth.users(id),
  batch_total integer default 5,
  batch_remaining integer default 5,
  cooked_at text,
  eta_minutes integer default 30,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id text primary key,
  user_id uuid references auth.users(id),
  meal_id uuid references meals(id),
  quantity integer default 1,
  status text default 'placed',
  total integer,
  delivery_address text,
  placed_at timestamptz default now()
);

-- Enable Realtime on orders table for live tracking
alter publication supabase_realtime add table orders;
```

---

## Unique Features (Maase-only)

| Feature | Description |
|---------|-------------|
| 🟢 Cook's Kitchen Live | Shows when a cook started cooking today |
| 🍳 Maa's Batch | Progress bar showing how many portions are left |
| 💬 Cook Story | Personal quote from each cook about today's dish |
| 🥗 Diet Memory | Remembers dietary preferences across sessions |

---

## Next Steps

- [ ] Wire up Supabase OTP auth (replace mock in `LoginScreen`)
- [ ] Wire up Supabase location queries (replace mock meals with DB query)
- [ ] Integrate real UPI payment SDK
- [ ] Add real-time order tracking via Supabase Realtime
- [ ] Add push notifications via Expo Notifications
- [ ] Build Homemaker (cook) app
