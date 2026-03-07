'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiFetch, createClient } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  isOnline: boolean;
  todayOrders: number;
  todayEarnings: number;
  batchRemaining: number;
  rating: number;
  totalOrders: number;
}

interface Order {
  id: string;
  displayId: string;
  status: string;
  total: number;
  createdAt: string;
  customer: { name: string | null; phone: string };
  items: { quantity: number; meal: { name: string } }[];
}

export default function DashboardPage() {
  const [cook, setCook] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // onAuthStateChange fires immediately with current session AND when magic link hash is processed
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        loadData();
      } else if (event === 'INITIAL_SESSION' || event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadData() {
    try {
      const [cookRes, ordersRes] = await Promise.all([
        apiFetch<{ data: any }>('/api/cooks/me'),
        apiFetch<{ data: Order[] }>('/api/orders/cook/queue'),
      ]);
      setCook(cookRes.data);
      setOrders(ordersRes.data);
    } catch { router.replace('/login'); }
    finally { setLoading(false); }
  }

  async function toggleOnline() {
    setToggling(true);
    const res = await apiFetch<{ data: { isOnline: boolean } }>('/api/cooks/me/toggle-online', { method: 'PATCH' });
    setCook((c: any) => ({ ...c, isOnline: res.data.isOnline }));
    setToggling(false);
  }

  async function updateStatus(orderId: string, status: string) {
    await apiFetch(`/api/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o).filter(o => !['delivered', 'cancelled'].includes(o.status)));
  }

  const todayEarnings = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Math.round(o.total * 0.85), 0);

  if (loading) return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-mocha text-lg animate-pulse">Loading your kitchen...</div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar cookName={cook?.name} />
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-mocha">Good {getGreeting()}, {cook?.name?.split(' ')[0] ?? 'Maa'} 👋</h1>
            <p className="text-amber-700 mt-1">Here's what's cooking today.</p>
          </div>
          <button
            onClick={toggleOnline}
            disabled={toggling}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition ${
              cook?.isOnline
                ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${cook?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            {toggling ? 'Updating...' : cook?.isOnline ? 'Online — Click to go offline' : 'Offline — Click to go online'}
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Orders', value: orders.length, emoji: '📦', color: 'bg-amber-50 border-amber-200' },
            { label: "Today's Earnings", value: `₹${todayEarnings}`, emoji: '💰', color: 'bg-green-50 border-green-200' },
            { label: 'Rating', value: `⭐ ${cook?.rating?.toFixed(1) ?? '—'}`, emoji: '', color: 'bg-blue-50 border-blue-200' },
            { label: 'Total Orders', value: cook?.totalOrders ?? 0, emoji: '🍳', color: 'bg-purple-50 border-purple-200' },
          ].map(({ label, value, emoji, color }) => (
            <div key={label} className={`rounded-2xl border p-5 ${color}`}>
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-2xl font-bold text-mocha">{emoji} {value}</p>
            </div>
          ))}
        </div>

        {/* Active Order Queue */}
        <div>
          <h2 className="font-display text-xl text-mocha mb-4">Live Order Queue</h2>
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center">
              <div className="text-5xl mb-3">🍽️</div>
              <p className="text-mocha font-semibold">No active orders</p>
              <p className="text-amber-700 text-sm mt-1">{cook?.isOnline ? 'Orders will appear here when customers place them.' : 'Go online to start receiving orders.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} onStatusChange={updateStatus} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const STATUS_NEXT: Record<string, string> = {
  pending: 'accepted',
  accepted: 'preparing',
  preparing: 'packed',
  packed: 'picked_up',
  picked_up: 'delivered',
};

const STATUS_LABEL: Record<string, string> = {
  pending: '🔔 New Order',
  accepted: '✅ Accepted',
  preparing: '🍳 Preparing',
  packed: '📦 Packed',
  picked_up: '🛵 Picked Up',
  delivered: '✅ Delivered',
};

function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, status: string) => void }) {
  const nextStatus = STATUS_NEXT[order.status];
  const mins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);

  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-5 flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-bold text-mocha">#{order.displayId}</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            {STATUS_LABEL[order.status]}
          </span>
          <span className="text-xs text-gray-400">{mins}m ago</span>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          {order.items.map(i => `${i.quantity}× ${i.meal.name}`).join(', ')}
        </p>
        <p className="text-sm text-gray-500">{order.customer.name ?? order.customer.phone} · ₹{order.total}</p>
      </div>
      {nextStatus && (
        <button
          onClick={() => onStatusChange(order.id, nextStatus)}
          className="ml-4 px-4 py-2 bg-turmeric text-mocha font-semibold text-sm rounded-xl hover:bg-amber-400 transition"
        >
          Mark {STATUS_LABEL[nextStatus].split(' ').slice(1).join(' ')} →
        </button>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
