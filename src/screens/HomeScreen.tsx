import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList,
  ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, CartItem, Meal } from '../types';
import { Colors, Typography, Radius, Spacing } from '../constants/theme';
import { FilterChip, SectionHeader } from '../components/ui';
import MealCard from '../components/MealCard';
import { MOCK_MEALS, CUISINE_FILTERS } from '../constants/mockData';
import { addToCart, getItemCount } from '../utils/cart';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'> & {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
};

const HomeScreen: React.FC<Props> = ({ navigation, cartItems, setCartItems }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const cartCount = getItemCount(cartItems);

  const filteredMeals = MOCK_MEALS.filter(meal => {
    const matchFilter = filter === 'All' || meal.tags.includes(filter) || meal.cuisine === filter;
    const matchSearch =
      meal.name.toLowerCase().includes(search.toLowerCase()) ||
      meal.cook.name.toLowerCase().includes(search.toLowerCase()) ||
      meal.cuisine.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleAdd = (meal: Meal) => {
    setCartItems(addToCart(cartItems, meal));
  };

  const getCartQty = (mealId: string) => {
    return cartItems.find(i => i.meal.id === mealId)?.quantity ?? 0;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredMeals}
        keyExtractor={item => item.id}
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
                <Text style={styles.greeting}>Good afternoon! 👋</Text>
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

            {/* Cook's Kitchen Live banner — unique Maase feature */}
            <View style={styles.liveBanner}>
              <View style={styles.liveDotRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveDotLabel}>3 COOKS COOKING NOW</Text>
              </View>
              <Text style={styles.liveQuote}>
                "Sunita Aunty started cooking{'\n'}Dal Makhani at 11:30 AM" 🔥
              </Text>
              <Text style={styles.liveSubtext}>Order now · Ready in ~25 mins</Text>
            </View>

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

            {/* Filters */}
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
  locationText: { fontFamily: 'Poppins_600SemiBold', fontSize: Typography.caption, color: Colors.textSecondary },
  locationChevron: { fontSize: 16, color: Colors.textMuted },
  headerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h3, color: Colors.text },
  cartBtn: { width: 44, height: 44, backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  cartEmoji: { fontSize: 20 },
  cartBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: Colors.turmeric, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.ivory },
  cartBadgeText: { fontFamily: 'Poppins_700Bold', fontSize: 10, color: Colors.mocha },
  liveBanner: { marginHorizontal: Spacing.md, backgroundColor: Colors.mocha, borderRadius: Radius.xl, padding: Spacing.md, marginBottom: Spacing.md },
  liveDotRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' },
  liveDotLabel: { fontFamily: 'Poppins_700Bold', fontSize: 11, color: '#4CAF50' },
  liveQuote: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: Colors.ivory, lineHeight: 24, marginBottom: 4 },
  liveSubtext: { fontFamily: 'Poppins_400Regular', fontSize: Typography.caption, color: Colors.textMuted },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.md, marginHorizontal: Spacing.md, marginBottom: Spacing.md, height: 48 },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.text },
  filters: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  sectionHeader: { paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  cardWrapper: { paddingHorizontal: Spacing.md },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyEmoji: { fontSize: 52, marginBottom: Spacing.md },
  emptyTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h3, color: Colors.text },
  emptySubtitle: { fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.textMuted, marginTop: 6 },
});

export default HomeScreen;
