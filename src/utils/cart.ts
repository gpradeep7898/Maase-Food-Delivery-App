import { CartItem, Cart, Meal } from '../types';

export function calculateCart(items: CartItem[]): Cart {
  const subtotal = items.reduce((sum, i) => sum + i.meal.price * i.quantity, 0);
  const platformFee = 10;
  const deliveryFee = 25;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + platformFee + deliveryFee + gst;
  return { items, subtotal, platformFee, deliveryFee, gst, total };
}

export function addToCart(items: CartItem[], meal: Meal): CartItem[] {
  const existing = items.find(i => i.meal.id === meal.id);
  if (existing) {
    return items.map(i =>
      i.meal.id === meal.id ? { ...i, quantity: i.quantity + 1 } : i
    );
  }
  return [...items, { meal, quantity: 1 }];
}

export function updateQuantity(items: CartItem[], mealId: string, delta: number): CartItem[] {
  return items
    .map(i => i.meal.id === mealId ? { ...i, quantity: i.quantity + delta } : i)
    .filter(i => i.quantity > 0);
}

export function removeFromCart(items: CartItem[], mealId: string): CartItem[] {
  return items.filter(i => i.meal.id !== mealId);
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
