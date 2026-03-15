import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { MealCard } from '../components/MealCard';
import { Colors, Typography, Spacing, Radius } from '../lib/theme';
import { HomeStackParamList, Chef, Meal } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'ChefProfile'>;

export default function ChefProfileScreen({ route, navigation }: Props) {
  const { chefId } = route.params;
  const [chef, setChef] = useState<Chef | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, clearAndAdd } = useCart();

  useEffect(() => {
    async function load() {
      const [chefRes, mealsRes] = await Promise.all([
        supabase.from('chefs').select('*').eq('id', chefId).single(),
        supabase
          .from('meals')
          .select('*, chef:chefs(*)')
          .eq('chef_id', chefId)
          .eq('status', 'available'),
      ]);
      setChef(chefRes.data ?? null);
      setMeals(mealsRes.data ?? []);
      setLoading(false);
    }
    load();
  }, [chefId]);

  const handleAdd = useCallback(async (meal: Meal) => {
    const result = await addToCart(meal);
    if (result === 'different_chef') await clearAndAdd(meal);
  }, [addToCart, clearAndAdd]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.turmeric} />
      </View>
    );
  }

  if (!chef) return null;

  const initials = chef.kitchen_name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.mocha} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.kitchenName}>{chef.kitchen_name}</Text>
            <View style={[styles.statusBadge, chef.is_open ? styles.openBadge : styles.closedBadge]}>
              {chef.is_open && <View style={styles.openDot} />}
              <Text style={[styles.statusText, chef.is_open ? styles.openText : styles.closedText]}>
                {chef.is_open ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>

          <Text style={styles.area}>📍 {chef.area}, {chef.city}</Text>
          <Text style={styles.rating}>
            ⭐ {chef.rating.toFixed(1)} ({chef.total_reviews} reviews) · {chef.total_orders} orders served
          </Text>

          {!!chef.bio && <Text style={styles.bio}>{chef.bio}</Text>}

          <View style={styles.chips}>
            {chef.speciality.map(s => (
              <View key={s} style={styles.chip}>
                <Text style={styles.chipText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Today's Menu */}
        <View style={styles.mealsSection}>
          <Text style={styles.mealsTitle}>Today's Menu</Text>
          {meals.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: Spacing.sm }}>🍳</Text>
              <Text style={styles.emptyText}>No meals available today</Text>
            </View>
          ) : (
            <View style={styles.mealsGrid}>
              {meals.map(meal => (
                <View key={meal.id} style={styles.mealWrap}>
                  <MealCard
                    meal={meal}
                    onPress={() => navigation.navigate('MealDetail', { meal })}
                    onAddToCart={() => handleAdd(meal)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.ivory,
  },
  hero: {
    backgroundColor: Colors.mocha,
    height: 180,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 12,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20, color: Colors.ivory },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.turmeric,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -40,
    borderWidth: 3,
    borderColor: Colors.ivory,
  },
  avatarText: { fontFamily: Typography.heading, fontSize: 28, color: Colors.mocha },
  infoSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: 52,
    paddingBottom: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  kitchenName: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.mocha,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  openBadge: { backgroundColor: '#E8F5E9' },
  closedBadge: { backgroundColor: '#F5F5F5' },
  openDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4CAF50' },
  statusText: { fontFamily: Typography.semiBold, fontSize: 12 },
  openText: { color: '#2E7D32' },
  closedText: { color: Colors.textMuted },
  area: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  rating: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  bio: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: Spacing.md,
    fontStyle: 'italic',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: { fontFamily: Typography.semiBold, fontSize: 12, color: Colors.mocha },
  mealsSection: { paddingHorizontal: Spacing.md },
  mealsTitle: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.mocha,
    marginBottom: Spacing.md,
  },
  mealsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  mealWrap: { width: '48.5%' },
  empty: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textMuted,
  },
});
