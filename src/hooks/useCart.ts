import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal, CartItem } from '../types';

const CART_KEY = '@maase_cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CART_KEY).then(raw => {
      if (raw) {
        try { setItems(JSON.parse(raw)); } catch { /* ignore */ }
      }
    });
  }, []);

  const save = async (newItems: CartItem[]) => {
    setItems(newItems);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(newItems));
  };

  const addToCart = async (meal: Meal): Promise<'added' | 'different_chef'> => {
    const existing = items.find(i => i.meal.id === meal.id);
    if (existing) {
      await save(items.map(i =>
        i.meal.id === meal.id ? { ...i, quantity: i.quantity + 1 } : i,
      ));
      return 'added';
    }
    const existingChef = items[0]?.meal.chef_id;
    if (existingChef && existingChef !== meal.chef_id) {
      return 'different_chef';
    }
    await save([...items, { meal, quantity: 1 }]);
    return 'added';
  };

  const removeFromCart = async (mealId: string) => {
    const existing = items.find(i => i.meal.id === mealId);
    if (!existing) return;
    if (existing.quantity === 1) {
      await save(items.filter(i => i.meal.id !== mealId));
    } else {
      await save(items.map(i =>
        i.meal.id === mealId ? { ...i, quantity: i.quantity - 1 } : i,
      ));
    }
  };

  const clearCart = async () => { await save([]); };

  const clearAndAdd = async (meal: Meal) => {
    await save([{ meal, quantity: 1 }]);
  };

  const getQuantity = (mealId: string): number =>
    items.find(i => i.meal.id === mealId)?.quantity ?? 0;

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.meal.price * i.quantity, 0);
  const platformFee = 10;
  const deliveryFee = 25;
  const gst = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + platformFee + deliveryFee + gst;
  const chefId = items[0]?.meal.chef_id ?? null;

  return {
    items,
    totalItems,
    subtotal,
    platformFee,
    deliveryFee,
    gst,
    total,
    chefId,
    addToCart,
    removeFromCart,
    clearCart,
    clearAndAdd,
    getQuantity,
  };
}
