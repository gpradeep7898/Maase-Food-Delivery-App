import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient(url: string, key: string) {
  return createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    realtime: {
      params: { eventsPerSecond: 10 },
    },
  });
}

export const BRAND = {
  turmeric: '#F4A300',
  turmericLight: '#FEF3D6',
  ivory: '#F8F3E8',
  ivoryDark: '#EDE8D8',
  mocha: '#5C3A21',
  surface: '#FFFFFF',
  border: '#E8E0D0',
  text: '#1A1207',
  textSecondary: '#6B5744',
  textMuted: '#9C8776',
  warning: '#E85D1A',
  success: '#2D7A3A',
} as const;

export const PLATFORM_FEE = 10;
export const DELIVERY_FEE = 25;
export const GST_RATE = 0.05;

export function calculateCartTotals(subtotal: number) {
  const gst = Math.round(subtotal * GST_RATE);
  return {
    subtotal,
    platformFee: PLATFORM_FEE,
    deliveryFee: DELIVERY_FEE,
    gst,
    total: subtotal + PLATFORM_FEE + DELIVERY_FEE + gst,
  };
}

export function formatOrderId(id: string) {
  return `#MAS-${id.slice(0, 6).toUpperCase()}`;
}

export function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}
