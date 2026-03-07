'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiFetch } from '../../lib/supabase';

interface Earning {
  id: string;
  gross: number;
  commission: number;
  net: number;
  settledAt: string | null;
  createdAt: string;
  order: { displayId: string; total: number };
}

export default function EarningsPage() {
  const [data, setData] = useState<{ earnings: Earning[]; totalEarned: number; unsettled: number } | null>(null);
  const [cookName, setCookName] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch<{ data: any }>('/api/cooks/me'),
      apiFetch<{ data: any }>('/api/payments/cook/earnings'),
    ]).then(([cookRes, earningsRes]) => {
      setCookName(cookRes.data.name);
      setData(earningsRes.data);
    });
  }, []);

  const thisMonth = data?.earnings.filter(e => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, e) => sum + e.net, 0) ?? 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar cookName={cookName} />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="font-display text-3xl text-mocha mb-2">Earnings 💰</h1>
        <p className="text-amber-700 mb-8">Platform takes 15% commission — rest is yours.</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Earned', value: `₹${data?.totalEarned?.toLocaleString('en-IN') ?? 0}`, color: 'bg-green-50 border-green-200' },
            { label: 'This Month', value: `₹${thisMonth.toLocaleString('en-IN')}`, color: 'bg-amber-50 border-amber-200' },
            { label: 'Pending Settlement', value: `₹${data?.unsettled?.toLocaleString('en-IN') ?? 0}`, color: 'bg-blue-50 border-blue-200' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-2xl border p-5 ${color}`}>
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-2xl font-bold text-mocha">{value}</p>
            </div>
          ))}
        </div>

        {/* Earnings Table */}
        <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-amber-50 border-b border-amber-100">
              <tr>
                {['Order', 'Date', 'Gross', 'Commission (15%)', 'Your Earnings', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-amber-800 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {data?.earnings.map(e => (
                <tr key={e.id}>
                  <td className="px-4 py-3 font-medium text-mocha">#{e.order.displayId}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">₹{e.gross}</td>
                  <td className="px-4 py-3 text-red-600">-₹{e.commission}</td>
                  <td className="px-4 py-3 font-semibold text-green-700">₹{e.net}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${e.settledAt ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {e.settledAt ? 'Settled' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {!data?.earnings.length && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No earnings yet. Start cooking!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
