// ─── Cook ─────────────────────────────────────────────────────────────────────
export interface Cook {
  id: string;
  userId: string;
  name: string;
  bio: string | null;
  phone: string;
  avatarUrl: string | null;
  avatarColor: string;
  initials: string;
  cuisine: string;
  rating: number;
  totalOrders: number;
  isOnline: boolean;
  locality: string;
  city: string;
  state: string;
  isVerified: boolean;
  createdAt: string;
}

// ─── Meal ─────────────────────────────────────────────────────────────────────
export interface Meal {
  id: string;
  cookId: string;
  cook: Cook;
  name: string;
  description: string;
  emoji: string;
  cuisine: string;
  price: number;
  batchTotal: number;
  batchRemaining: number;
  batchDate: string;
  items: string[];        // what you get
  tags: string[];
  rating: number;
  reviewCount: number;
  distanceKm: number;
  etaMinutes: number;
  cookedAt: string;
  isAvailable: boolean;
  imageUrl: string | null;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  platformFee: number;
  deliveryFee: number;
  gst: number;
  total: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'packed'
  | 'picked_up'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  meal: Meal;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderId: string;      // display: #MAS-XXXXXX
  customerId: string;
  cook: Cook;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  gst: number;
  total: number;
  deliveryAddress: Address;
  paymentMethod: string;
  paymentId: string | null;
  estimatedDelivery: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Address ─────────────────────────────────────────────────────────────────
export interface Address {
  id?: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  dietPreferences: string[];
  defaultAddress: Address | null;
  createdAt: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  cookId: string;
  mealId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

// ─── Donation ─────────────────────────────────────────────────────────────────
export interface Donation {
  id: string;
  donorId: string;
  mealId: string;
  cookId: string;
  quantity: number;
  message: string | null;
  createdAt: string;
}

// ─── Payment ─────────────────────────────────────────────────────────────────
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface PaymentVerification {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}

// ─── API Responses ───────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Realtime Events ─────────────────────────────────────────────────────────
export interface OrderStatusEvent {
  orderId: string;
  status: OrderStatus;
  updatedAt: string;
  message?: string;
}

export interface MealAvailabilityEvent {
  mealId: string;
  batchRemaining: number;
  isAvailable: boolean;
}
