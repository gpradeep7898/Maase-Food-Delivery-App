import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error ?? 'Request failed');
  }

  return res.json();
}

// ─── Place Order ──────────────────────────────────────────────────────────────
export async function placeOrder(params: {
  items: { mealId: string; quantity: number }[];
  addressId: string;
  cookId: string;
  paymentId?: string;
  rzpOrderId?: string;
  paymentMethod?: string;
}) {
  return apiFetch<{ data: any }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ─── Create Razorpay Order ────────────────────────────────────────────────────
export async function createPaymentOrder(amount: number) {
  return apiFetch<{ data: { id: string; amount: number; currency: string } }>('/api/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

// ─── Donate a meal ───────────────────────────────────────────────────────────
export async function donateMeal(params: { mealId: string; cookId: string; quantity?: number; message?: string }) {
  return apiFetch<{ data: any; message: string }>('/api/donations', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
