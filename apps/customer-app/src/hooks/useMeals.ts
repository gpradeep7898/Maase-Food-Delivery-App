import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import type { Meal } from '../types';

interface UseMealsOptions {
  cuisine?: string;
  tag?: string;
  search?: string;
}

export function useMeals(options: UseMealsOptions = {}) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('meals')
        .select(`
          *,
          cook:cooks (
            id, name, cuisine, rating, total_orders,
            avatar_color, initials, is_online, locality
          )
        `)
        .eq('is_available', true)
        .gt('batch_remaining', 0)
        .order('created_at', { ascending: false });

      if (options.cuisine && options.cuisine !== 'All') {
        query = query.eq('cuisine', options.cuisine);
      }
      if (options.tag) {
        query = query.contains('tags', [options.tag]);
      }
      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,cuisine.ilike.%${options.search}%`);
      }

      const { data, error: err } = await query;
      if (err) throw err;

      // Adapt snake_case DB response to camelCase types
      const adapted: Meal[] = (data ?? []).map((m: any) => ({
        id: m.id,
        cookId: m.cook_id,
        cook: {
          id: m.cook.id,
          name: m.cook.name,
          cuisine: m.cook.cuisine,
          rating: m.cook.rating,
          totalOrders: m.cook.total_orders,
          avatarColor: m.cook.avatar_color,
          initials: m.cook.initials,
          isOnline: m.cook.is_online,
          locality: m.cook.locality,
          // fill remaining required fields with safe defaults
          userId: m.cook.id,
          bio: null, phone: '', avatarUrl: null,
          city: '', state: '', isVerified: true,
          createdAt: m.created_at,
        },
        name: m.name,
        description: m.description,
        emoji: m.emoji,
        cuisine: m.cuisine,
        price: m.price,
        batchTotal: m.batch_total,
        batchRemaining: m.batch_remaining,
        batchDate: m.batch_date,
        items: m.items ?? [],
        tags: m.tags ?? [],
        rating: m.rating,
        reviewCount: m.review_count,
        distanceKm: 1.5, // TODO: real geolocation
        etaMinutes: 30,
        cookedAt: m.cooked_at,
        isAvailable: m.is_available,
        imageUrl: m.image_url,
      }));

      setMeals(adapted);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [options.cuisine, options.tag, options.search]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  // Realtime subscription — update batch remaining live
  useEffect(() => {
    const channel = supabase
      .channel('meals-realtime')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'meals',
      }, (payload: any) => {
        setMeals(prev => prev.map(m =>
          m.id === payload.new.id
            ? { ...m, batchRemaining: payload.new.batch_remaining, isAvailable: payload.new.is_available }
            : m
        ));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { meals, loading, error, refetch: fetchMeals };
}
