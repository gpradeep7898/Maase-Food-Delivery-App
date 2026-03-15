import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';

interface PlaceOrderData {
  chef_id: string;
  delivery_address_id: string;
  items: {
    meal_id: string;
    meal_name: string;
    meal_price: number;
    quantity: number;
    subtotal: number;
  }[];
  subtotal: number;
  platform_fee: number;
  delivery_fee: number;
  gst: number;
  total: number;
  notes?: string;
  is_feed_neighbour?: boolean;
}

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchOrders();

    const channel = supabase
      .channel(`orders_${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `customer_id=eq.${userId}` },
        () => fetchOrders(),
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  async function fetchOrders() {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*), chef:chefs(*)')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });
      setOrders(data ?? []);
    } catch (e) {
      console.error('fetchOrders error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function placeOrder(orderData: PlaceOrderData): Promise<Order> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: userId,
        chef_id: orderData.chef_id,
        delivery_address_id: orderData.delivery_address_id,
        subtotal: orderData.subtotal,
        platform_fee: orderData.platform_fee,
        delivery_fee: orderData.delivery_fee,
        gst: orderData.gst,
        total: orderData.total,
        notes: orderData.notes,
        is_feed_neighbour: orderData.is_feed_neighbour ?? false,
        payment_status: 'pending',
        payment_method: 'upi',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      meal_id: item.meal_id,
      meal_name: item.meal_name,
      meal_price: item.meal_price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Mark payment as paid (mock)
    await supabase
      .from('orders')
      .update({ payment_status: 'paid' })
      .eq('id', order.id);

    return order as Order;
  }

  async function getOrderById(orderId: string): Promise<Order | null> {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*), chef:chefs(*)')
      .eq('id', orderId)
      .single();
    return data ?? null;
  }

  return { orders, loading, placeOrder, getOrderById, refetch: fetchOrders };
}
