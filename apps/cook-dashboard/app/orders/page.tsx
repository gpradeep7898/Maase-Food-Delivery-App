'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiFetch, createClient } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  displayId: string;
  status: string;
  total: number;
  createdAt: string;
  customer: { name: string | null; phone: string };
  items: { quantity: number; meal: { name: string } }[];
}

const STATUS_LABEL: Record<string, string> = {
  pending: '🔔 Pending',
  accepted: '✅ Accepted',
  preparing: '🍳 Preparing',
  packed: '📦 Packed',
  picked_up: '🛵 Picked Up',
  delivered: '✅ Delivered',
  cancelled: '❌ Cancelled',
};

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  packed: 'bg-purple-100 text-purple-800',
  picked_up: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cookName, setCookName] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        loadOrders();
      } else if (event === 'INITIAL_SESSION' || event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadOrders() {
    try {
      const [cookRes, ordersRes] = await Promise.all([
        apiFetch<{ data: any }>('/api/cooks/me'),
        apiFetch<{ data: Order[] }>('/api/orders/cook/all'),
      ]);
      setCookName(cookRes.data?.name ?? '');
      setOrders(ordersRes.data ?? []);
    } catch {
      // API not connected yet — show empty state
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="flex min-h-screen">
      <Sidebar cookName={cookName} />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="font-display text-3xl text-mocha mb-2">Order History 📦</h1>
        <p className="text-amber-700 mb-6">All orders placed with your kitchen.</p>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['all', 'pending', 'preparing', 'delivered', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === s
                  ? 'bg-turmeric text-mocha'
                  : 'bg-white border border-amber-200 text-mocha hover:bg-amber-50'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-mocha animate-pulse">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-mocha font-semibold">No orders yet</p>
            <p className="text-amber-700 text-sm mt-1">Orders will appear here once customers start ordering.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-amber-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-mocha">#{order.displayId}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </div>
                  <span className="font-semibold text-mocha">₹{order.total}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {order.items.map(i => `${i.quantity}× ${i.meal.name}`).join(', ')}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {order.customer?.name ?? order.customer?.phone} · {new Date(order.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
