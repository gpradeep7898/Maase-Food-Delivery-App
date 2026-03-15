import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Meal } from '../types';

interface MealsFilter {
  cuisine?: string;
  mealType?: string;
  isVeg?: boolean;
  search?: string;
}

export function useMeals(filter: MealsFilter = {}) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterKey = JSON.stringify(filter);

  useEffect(() => {
    fetchMeals();

    const channel = supabase
      .channel('meals_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meals' }, () => {
        fetchMeals();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [filterKey]);

  async function fetchMeals() {
    try {
      setLoading(true);
      let query = supabase
        .from('meals')
        .select('*, chef:chefs(*)')
        .eq('status', 'available')
        .is('scheduled_for', null);

      if (filter.cuisine && filter.cuisine !== 'All') {
        query = query.eq('cuisine_type', filter.cuisine);
      }
      if (filter.mealType) {
        query = query.eq('meal_type', filter.mealType);
      }
      if (filter.isVeg !== undefined) {
        query = query.eq('is_veg', filter.isVeg);
      }
      if (filter.search) {
        query = query.ilike('name', `%${filter.search}%`);
      }

      const { data, error: err } = await query.order('created_at', { ascending: false });
      if (err) throw err;
      setMeals(data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load meals');
    } finally {
      setLoading(false);
    }
  }

  async function fetchTomorrowMeals(): Promise<Meal[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const { data } = await supabase
      .from('meals')
      .select('*, chef:chefs(*)')
      .eq('status', 'available')
      .eq('scheduled_for', dateStr);
    return data ?? [];
  }

  return { meals, loading, error, refetch: fetchMeals, fetchTomorrowMeals };
}
