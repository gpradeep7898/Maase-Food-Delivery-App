import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import type { Order, OrderStatus } from '../types';

export function useOrders(userId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        cook:cooks(id, name, cuisine, avatar_color, initials, phone),
        address:addresses(*),
        items:order_items(*, meal:meals(id, name, emoji, price))
      `)
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    setOrders((data ?? []).map(adaptOrder));
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Realtime order status updates
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`orders-${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `customer_id=eq.${userId}`,
      }, (payload: any) => {
        setOrders(prev => prev.map(o =>
          o.id === payload.new.id ? { ...o, status: payload.new.status as OrderStatus } : o
        ));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return { orders, loading, refetch: fetchOrders };
}

function adaptOrder(o: any): Order {
  return {
    id: o.id,
    orderId: o.display_id,
    customerId: o.customer_id,
    cook: {
      id: o.cook.id,
      name: o.cook.name,
      cuisine: o.cook.cuisine,
      avatarColor: o.cook.avatar_color,
      initials: o.cook.initials,
      phone: o.cook.phone,
      userId: o.cook.id,
      bio: null, avatarUrl: null,
      rating: 0, totalOrders: 0,
      isOnline: false, locality: '', city: '', state: '',
      isVerified: true, createdAt: '',
    },
    items: (o.items ?? []).map((i: any) => ({
      id: i.id,
      meal: i.meal,
      quantity: i.quantity,
      price: i.price,
    })),
    status: o.status,
    subtotal: o.subtotal,
    deliveryFee: o.delivery_fee,
    platformFee: o.platform_fee,
    gst: o.gst,
    total: o.total,
    deliveryAddress: o.address,
    paymentMethod: o.payment_method,
    paymentId: o.payment_id,
    estimatedDelivery: o.estimated_at,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
}
