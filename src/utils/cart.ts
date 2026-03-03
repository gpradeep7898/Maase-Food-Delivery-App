import { CartItem, Cart, Meal } from '../types';

const PLATFORM_FEE = 10;
const DELIVERY_FEE = 25;
const GST_RATE = 0.05;

export function calculateCart(items: CartItem[]): Cart {
  const subtotal = items.reduce((sum, item) => sum + item.meal.price * item.quantity, 0);
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + PLATFORM_FEE + DELIVERY_FEE + gst;

  return {
    items,
    subtotal,
    platformFee: PLATFORM_FEE,
    deliveryFee: DELIVERY_FEE,
    gst,
    total,
  };
}

export function addToCart(items: CartItem[], meal: Meal): CartItem[] {
  const existing = items.findIndex(i => i.meal.id === meal.id);
  if (existing >= 0) {
    return items.map((item, idx) =>
      idx === existing ? { ...item, quantity: item.quantity + 1 } : item
    );
  }
  return [...items, { meal, quantity: 1 }];
}

export function removeFromCart(items: CartItem[], mealId: string): CartItem[] {
  return items.filter(i => i.meal.id !== mealId);
}

export function updateQuantity(items: CartItem[], mealId: string, delta: number): CartItem[] {
  return items
    .map(item =>
      item.meal.id === mealId
        ? { ...item, quantity: item.quantity + delta }
        : item
    )
    .filter(item => item.quantity > 0);
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
