import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, ScrollView, RefreshControl, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMeals } from '../hooks/useMeals';
import { useCart } from '../hooks/useCart';
import { useLocation } from '../hooks/useLocation';
import { useAuth } from '../hooks/useAuth';
import { MealCard } from '../components/MealCard';
import { MaaOnlineBanner } from '../components/MaaOnlineBanner';
import { TomorrowSection } from '../components/TomorrowSection';
import { CartFloatingButton } from '../components/CartFloatingButton';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { FilterChip } from '../components/FilterChip';
import { Colors, Typography, Spacing, Radius } from '../lib/theme';
import { HomeStackParamList, Meal } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

const CUISINE_FILTERS = ['All', 'North Indian', 'South Indian', 'Bengali', 'Gujarati', 'Punjabi', 'Street Food'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const { location } = useLocation();
  const [filter, setFilter] = useState('All');
  const { meals, loading, refetch } = useMeals({
    cuisine: filter !== 'All' ? filter : undefined,
  });
  const { totalItems, total, addToCart, clearAndAdd } = useCart();

  const handleAdd = useCallback(async (meal: Meal) => {
    const result = await addToCart(meal);
    if (result === 'different_chef') await clearAndAdd(meal);
  }, [addToCart, clearAndAdd]);

  const firstName = profile?.full_name?.split(' ')[0] ?? '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />
      <FlatList
        data={meals}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={Colors.turmeric} />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.locationRow}>
                <Text style={styles.locationPin}>📍</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {location ? `${location.area}, ${location.city}` : 'Locating...'}
                </Text>
                <Text style={styles.locationChev}>›</Text>
              </View>
              <View style={styles.headerBottom}>
                <Text style={styles.greeting} numberOfLines={1}>
                  {getGreeting()}{firstName ? `, ${firstName}` : ''} 👋
                </Text>
                <TouchableOpacity
                  style={styles.searchIconBtn}
                  onPress={() => navigation.navigate('Search')}
                >
                  <Text style={{ fontSize: 18 }}>🔍</Text>
                </TouchableOpacity>
              </View>
            </View>

            <MaaOnlineBanner count={1} onDismiss={() => {}} />

            {/* Search bar (tap to navigate) */}
            <TouchableOpacity
              style={styles.searchBar}
              onPress={() => navigation.navigate('Search')}
              activeOpacity={0.8}
            >
              <Text style={styles.searchBarIcon}>🔍</Text>
              <Text style={styles.searchPlaceholder}>Search meals, cuisines, chefs...</Text>
            </TouchableOpacity>

            {/* Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              {CUISINE_FILTERS.map(f => (
                <FilterChip
                  key={f}
                  label={f}
                  selected={filter === f}
                  onPress={() => setFilter(f)}
                />
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>
              Fresh & Ready 🍳{' '}
              <Text style={styles.sectionCount}>({meals.length} meals)</Text>
            </Text>

            {loading && <LoadingSkeleton type="mealCard" count={4} />}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <MealCard
              meal={item}
              onPress={() => navigation.navigate('MealDetail', { meal: item })}
              onAddToCart={() => handleAdd(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 52, textAlign: 'center', marginBottom: Spacing.md }}>🍽️</Text>
              <Text style={styles.emptyTitle}>No meals found</Text>
              <Text style={styles.emptySub}>Try a different filter or check back later</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View style={{ paddingHorizontal: Spacing.md }}>
            <TomorrowSection meals={[]} onPreBook={() => {}} />
            <View style={{ height: 100 }} />
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <CartFloatingButton itemCount={totalItems} total={total} onPress={() => navigation.navigate('Cart')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  list: { paddingBottom: Spacing.xl },
  row: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationPin: { fontSize: 12 },
  locationText: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  locationChev: { fontSize: 16, color: Colors.textMuted },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.mocha,
    flex: 1,
  },
  searchIconBtn: {
    width: 42,
    height: 42,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    height: 48,
  },
  searchBarIcon: { fontSize: 14 },
  searchPlaceholder: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textMuted,
    flex: 1,
  },
  filtersScroll: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Typography.heading,
    fontSize: 18,
    color: Colors.mocha,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionCount: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textMuted,
  },
  cardWrap: { flex: 1, marginBottom: Spacing.sm },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySub: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
