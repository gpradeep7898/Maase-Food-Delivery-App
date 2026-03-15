export type UserRole = 'customer' | 'chef' | 'admin' | 'delivery';
export type MealStatus = 'available' | 'sold_out' | 'hidden';
export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Profile {
  id: string;
  phone: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  flat_no?: string;
  building?: string;
  street: string;
  area: string;
  city: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  is_default: boolean;
}

export interface Chef {
  id: string;
  profile_id: string;
  kitchen_name: string;
  bio?: string;
  speciality: string[];
  avatar_url?: string;
  cover_image_url?: string;
  address_line: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  is_open: boolean;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  total_orders: number;
  created_at?: string;
}

export interface Meal {
  id: string;
  chef_id: string;
  chef?: Chef;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  cuisine_type: string;
  meal_type: string;
  is_veg: boolean;
  is_jain: boolean;
  serves: number;
  portions_available: number;
  status: MealStatus;
  tags?: string[];
  scheduled_for?: string;
  created_at?: string;
}

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  chef_id: string;
  chef?: Chef;
  delivery_address_id?: string;
  status: OrderStatus;
  subtotal: number;
  platform_fee: number;
  delivery_fee: number;
  gst: number;
  total: number;
  payment_method: string;
  payment_status: string;
  payment_ref?: string;
  estimated_delivery_minutes: number;
  notes?: string;
  is_feed_neighbour: boolean;
  scheduled_for?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  meal_id?: string;
  meal_name: string;
  meal_price: number;
  quantity: number;
  subtotal: number;
}

export interface Review {
  id: string;
  order_id: string;
  customer_id: string;
  chef_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  area: string;
  city: string;
}

// Navigation param types
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Onboarding: undefined;
  ChefSignup: undefined;
  Location: { fromOnboarding?: boolean };
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Search: undefined;
  ChefProfile: { chefId: string };
  MealDetail: { meal: Meal };
  Cart: undefined;
  Payment: undefined;
  OrderConfirmation: { orderId: string; orderNumber: string; chefName: string };
  OrderTracking: { orderId: string };
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderTracking: { orderId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Profile: undefined;
};
