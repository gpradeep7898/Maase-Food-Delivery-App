import React, { useState } from 'react';
import {
  FlatList, RefreshControl, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, CartItem, Meal } from '../types';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { FilterChip, SectionHeader } from '../components/ui';
import MealCard from '../components/MealCard';
import MaaOnlineBanner from '../components/MaaOnlineBanner';
import TomorrowSection from '../components/TomorrowSection';
import { CUISINE_FILTERS } from '../constants/mockData';
import { addToCart, getItemCount } from '../utils/cart';
import { useMeals } from '../hooks/useMeals';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'> & {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning! 👋';
  if (hour < 17) return 'Good afternoon! 👋';
  return 'Good evening! 👋';
}

const HomeScreen: React.FC<Props> = ({ navigation, cartItems, setCartItems }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const cartCount = getItemCount(cartItems);

  const { meals, loading, refetch } = useMeals({
    cuisine: filter !== 'All' ? filter : undefined,
    search: search || undefined,
  });

  const filteredMeals = meals;

  const handleAdd = (meal: Meal) => setCartItems(addToCart(cartItems, meal));
  const getCartQty = (mealId: string) => cartItems.find(i => i.meal.id === mealId)?.quantity ?? 0;

  const onRefresh = async () => { await refetch(); };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredMeals}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={Colors.turmeric} />}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.locationRow}>
                <Text style={styles.locationPin}>📍</Text>
                <Text style={styles.locationText}>Banjara Hills, Hyderabad</Text>
                <Text style={styles.locationChevron}>›</Text>
              </View>
              <View style={styles.headerBottom}>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cart')}
                  style={styles.cartBtn}
                >
                  <Text style={styles.cartEmoji}>🛒</Text>
                  {cartCount > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{cartCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Maa Online Banner */}
            <MaaOnlineBanner />

            {/* Search */}
            <View style={styles.searchRow}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search meals, cooks, cuisines..."
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            {/* Filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
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

            <SectionHeader
              title="Fresh & Ready 🍳"
              subtitle={`${filteredMeals.length} meals within 3km`}
              style={styles.sectionHeader}
            />
          </>
        )}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <MealCard
              meal={item}
              onPress={() => navigation.navigate('MealDetail', { meal: item })}
              onAdd={() => handleAdd(item)}
              cartQuantity={getCartQty(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>No meals found</Text>
            <Text style={styles.emptySubtitle}>Try a different filter or search</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={{ paddingTop: Spacing.lg }}>
            <TomorrowSection />
            <View style={{ height: Spacing.xl }} />
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  list: { paddingBottom: Spacing.xl },
  header: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  locationPin: { fontSize: 13 },
  locationText: { fontFamily: Typography.bodySemiBold, fontSize: Typography.caption, color: Colors.textSecondary },
  locationChevron: { fontSize: 16, color: Colors.textMuted },
  headerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontFamily: Typography.display, fontSize: Typography.h3, color: Colors.text },
  cartBtn: {
    width: 44, height: 44, backgroundColor: Colors.surface,
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  cartEmoji: { fontSize: 20 },
  cartBadge: {
    position: 'absolute', top: -6, right: -6,
    backgroundColor: Colors.turmeric, width: 20, height: 20,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.ivory,
  },
  cartBadgeText: { fontFamily: Typography.bodyBold, fontSize: 10, color: Colors.mocha },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.md, marginBottom: Spacing.md, height: 48,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1, fontFamily: Typography.bodyRegular,
    fontSize: Typography.bodySmall, color: Colors.text,
  },
  filters: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  sectionHeader: { paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  cardWrapper: { paddingHorizontal: Spacing.md },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyEmoji: { fontSize: 52, marginBottom: Spacing.md },
  emptyTitle: { fontFamily: Typography.display, fontSize: Typography.h3, color: Colors.text },
  emptySubtitle: {
    fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall,
    color: Colors.textMuted, marginTop: 6,
  },
});

export default HomeScreen;
