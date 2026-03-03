// ============================================================
// MAASE — TypeScript Types
// ============================================================

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Cook {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  rating: number;
  totalOrders: number;
  cuisine: string;
  story?: string; // Today's cook story — unique Maase feature
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  cuisine: string;
  tags: string[];
  cook: Cook;
  distanceKm: number;
  etaMinutes: number;
  rating: number;
  reviewCount: number;
  items: string[];           // What's included
  batchTotal: number;        // Total portions made today
  batchRemaining: number;    // Portions still available
  cookedAt: string;          // e.g. "11:30 AM" — unique Maase feature
  imageUrl?: string;
  isAvailable: boolean;
}

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  platformFee: number;
  deliveryFee: number;
  gst: number;
  total: number;
}

export interface Order {
  id: string;
  meal: Meal;
  quantity: number;
  status: OrderStatus;
  total: number;
  placedAt: string;
  deliveryAddress: string;
  estimatedDelivery: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  dietPreferences: DietPreference[]; // Diet Memory — unique Maase feature
  savedAddresses: Address[];
  totalOrders: number;
}

export type DietPreference =
  | 'Vegetarian'
  | 'Non-Vegetarian'
  | 'Jain'
  | 'No Onion-Garlic'
  | 'Gluten Free'
  | 'Vegan';

export interface Address {
  id: string;
  label: string; // "Home", "Office"
  fullAddress: string;
  lat?: number;
  lng?: number;
}

// ============================================================
// Navigation types
// ============================================================

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Location: undefined;
  MainTabs: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  MealDetail: { meal: Meal };
  Cart: undefined;
  Payment: undefined;
  OrderConfirmation: { orderId: string };
  OrderTracking: { orderId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};
