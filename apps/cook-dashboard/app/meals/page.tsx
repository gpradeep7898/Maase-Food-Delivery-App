'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { apiFetch } from '../../lib/supabase';

interface Meal {
  id: string;
  name: string;
  emoji: string;
  cuisine: string;
  price: number;
  batchTotal: number;
  batchRemaining: number;
  isAvailable: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
}

const EMPTY_FORM = {
  name: '', description: '', emoji: '🍛', cuisine: 'North Indian',
  price: '', batchTotal: '', items: '', tags: '', cookedAt: 'Home kitchen', story: '',
};

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [cookName, setCookName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [cookRes, mealsRes] = await Promise.all([
      apiFetch<{ data: any }>('/api/cooks/me'),
      apiFetch<{ data: Meal[] }>('/api/meals'),
    ]);
    setCookName(cookRes.data.name);
    setMeals(mealsRes.data);
  }

  async function saveMeal(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const body = {
        ...form,
        price: Number(form.price),
        batchTotal: Number(form.batchTotal),
        items: form.items.split('\n').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await apiFetch<{ data: Meal }>('/api/meals', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setMeals(prev => [res.data, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(meal: Meal) {
    await apiFetch(`/api/meals/${meal.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable: !meal.isAvailable }),
    });
    setMeals(prev => prev.map(m => m.id === meal.id ? { ...m, isAvailable: !m.isAvailable } : m));
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar cookName={cookName} />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-mocha">My Meals 🍳</h1>
            <p className="text-amber-700 mt-1">Add and manage your daily batches</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-turmeric text-mocha font-semibold rounded-xl hover:bg-amber-400 transition"
          >
            + Add Today's Meal
          </button>
        </div>

        {/* Add Meal Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-amber-200 p-6 mb-6">
            <h2 className="font-display text-xl text-mocha mb-4">New Meal</h2>
            <form onSubmit={saveMeal} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mocha mb-1">Meal Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-amber-200 rounded-xl px-4 py-2.5 outline-none text-sm" placeholder="Dal Tadka" />
              </div>
              <div>
                <label className="block text-sm font-medium text-mocha mb-1">Emoji</label>
                <input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                  className="w-full border border-amber-200 rounded-xl px-4 py-2.5 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-mocha mb-1">Price (₹) *</label>
                <input required type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full border border-amber-200 rounded-xl px-4 py-2.5 outline-none text-sm" placeholder="120" />
              </div>
              <div>
                <label className="block text-sm font-medium text-mocha mb-1">Batch Size *</label>
                <input required type="number" value={form.batchTotal} onChange={e => setForm(f => ({ ...f, batchTotal: e.target.value }))}
                  className="w-full border border-amber-200 rounded-xl px-4 py-2.5 outline-none text-sm" placeholder="10" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-mocha mb-1">Description *</label>
                <textarea required rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-amber-200 rounded-xl px-4 py-2.5 outline-none text-sm resize-none"
                  placeholder="Slow-cooked yellow lentils tempered with cumin and ghee..." />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-mocha mb-1">What's included (one per line)</label>
                <textarea rows={3} value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))}
                  className="w-full border border-amber-200 rounded-xl px-4 py-2.5 outline-none text-sm resize-none"
                  placeholder="2 roti&#10;1 bowl dal&#10;1 bowl rice" />
              </div>
              <div>
                <label className="block text-sm font-medium text-mocha mb-1">Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  className="w-full border border-amber-200 rounded-xl px-4 py-2.5 outline-none text-sm"
                  placeholder="Vegetarian, Gluten-free" />
              </div>
              <div>
                <label className="block text-sm font-medium text-mocha mb-1">Cuisine</label>
                <select value={form.cuisine} onChange={e => setForm(f => ({ ...f, cuisine: e.target.value }))}
                  className="w-full border border-amber-200 rounded-xl px-4 py-2.5 outline-none text-sm bg-white">
                  {['North Indian', 'South Indian', 'Bengali', 'Gujarati', 'Maharashtrian', 'Punjabi', 'Rajasthani', 'Kerala', 'Other'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-mocha mb-1">Today's Story (optional)</label>
                <input value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
                  className="w-full border border-amber-200 rounded-xl px-4 py-2.5 outline-none text-sm"
                  placeholder="Made with love from my mother's recipe..." />
              </div>
              {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
              <div className="col-span-2 flex gap-3">
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-turmeric text-mocha font-semibold rounded-xl hover:bg-amber-400 disabled:opacity-50 transition">
                  {saving ? 'Saving...' : 'Post Meal'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 bg-amber-50 text-mocha rounded-xl hover:bg-amber-100 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Meals List */}
        <div className="grid gap-4">
          {meals.length === 0 && (
            <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center">
              <div className="text-5xl mb-3">🍳</div>
              <p className="text-mocha font-semibold">No meals posted yet</p>
              <p className="text-amber-700 text-sm mt-1">Add your first meal to start receiving orders.</p>
            </div>
          )}
          {meals.map(meal => (
            <div key={meal.id} className={`bg-white rounded-2xl border p-5 flex items-center gap-4 ${meal.isAvailable ? 'border-amber-100' : 'border-gray-100 opacity-60'}`}>
              <div className="text-4xl">{meal.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-mocha">{meal.name}</span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{meal.cuisine}</span>
                  {!meal.isAvailable && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>}
                </div>
                <p className="text-sm text-gray-500">
                  ₹{meal.price} · {meal.batchRemaining}/{meal.batchTotal} left ·
                  {meal.reviewCount > 0 ? ` ⭐ ${meal.rating.toFixed(1)} (${meal.reviewCount})` : ' No reviews yet'}
                </p>
              </div>
              <button
                onClick={() => toggleAvailability(meal)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  meal.isAvailable
                    ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
                    : 'bg-amber-50 text-amber-700 hover:bg-green-100 hover:text-green-700'
                }`}
              >
                {meal.isAvailable ? 'Available' : 'Hidden'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
