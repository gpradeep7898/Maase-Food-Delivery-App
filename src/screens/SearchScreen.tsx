import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMeals } from '../hooks/useMeals';
import { useCart } from '../hooks/useCart';
import { MealCard } from '../components/MealCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Colors, Typography, Spacing, Radius } from '../lib/theme';
import { HomeStackParamList, Meal } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Search'>;

const RECENT_SEARCHES = ['Dal Tadka', 'Biryani', 'Rajma', 'Chole', 'Pulao'];

export default function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const { meals, loading } = useMeals({ search: debouncedQuery || undefined });
  const { addToCart, clearAndAdd } = useCart();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = useCallback(async (meal: Meal) => {
    const result = await addToCart(meal);
    if (result === 'different_chef') await clearAndAdd(meal);
  }, [addToCart, clearAndAdd]);

  const showResults = debouncedQuery.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Search bar */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Search meals, cuisines..."
            placeholderTextColor={Colors.textMuted}
            returnKeyType="search"
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Recent searches */}
      {!showResults && (
        <View style={styles.recents}>
          <Text style={styles.recentsTitle}>RECENT SEARCHES</Text>
          {RECENT_SEARCHES.map(r => (
            <TouchableOpacity key={r} style={styles.recentRow} onPress={() => setQuery(r)}>
              <Text style={styles.recentIcon}>🕐</Text>
              <Text style={styles.recentText}>{r}</Text>
              <Text style={styles.recentArrow}>↗</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results */}
      {showResults && (
        loading ? (
          <LoadingSkeleton type="mealCard" count={4} />
        ) : (
          <FlatList
            data={meals}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
              <View style={styles.empty}>
                <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>🔍</Text>
                <Text style={styles.emptyTitle}>No results for "{debouncedQuery}"</Text>
                <Text style={styles.emptySub}>Try a different search term</Text>
              </View>
            }
          />
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: Colors.text },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ivory,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },
  searchIcon: { fontSize: 14 },
  input: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.text,
  },
  clearBtn: { padding: 4 },
  clearText: { fontSize: 13, color: Colors.textMuted },
  recents: { padding: Spacing.md },
  recentsTitle: {
    fontFamily: Typography.bold,
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentIcon: { fontSize: 15 },
  recentText: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.text,
  },
  recentArrow: { fontSize: 14, color: Colors.textMuted },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  row: { gap: Spacing.sm },
  cardWrap: { flex: 1, marginBottom: Spacing.sm },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyTitle: {
    fontFamily: Typography.heading,
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textMuted,
  },
});
