export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Cook {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  rating: number;
  totalOrders: number;
  cuisine: string;
  story?: string;
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
  items: string[];
  batchTotal: number;
  batchRemaining: number;
  cookedAt: string;
  isAvailable: boolean;
  isTomorrow?: boolean;
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
}

export type DietPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Jain' | 'No Onion-Garlic' | 'Gluten Free' | 'Vegan';

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
