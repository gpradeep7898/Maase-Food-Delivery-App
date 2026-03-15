import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Typography, Radius, Spacing, Shadows } from '../lib/theme';
import { Meal } from '../types';
import { formatPrice } from '../lib/utils';

const PLACEHOLDER = 'https://placehold.co/200x112/FFF3D4/5C3A21?text=Tomorrow';

interface Props {
  meals: Meal[];
  onPreBook: (meal: Meal) => void;
}

function TomorrowCard({ meal, onPreBook }: { meal: Meal; onPreBook: () => void }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: meal.image_url || PLACEHOLDER }}
        style={styles.image}
        contentFit="cover"
        placeholder={{ uri: PLACEHOLDER }}
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>{meal.name}</Text>
        <Text style={styles.chef} numberOfLines={1}>{meal.chef?.kitchen_name}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(meal.price)}</Text>
          <TouchableOpacity onPress={onPreBook} style={styles.preBookBtn}>
            <Text style={styles.preBookText}>Pre-book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function TomorrowSection({ meals, onPreBook }: Props) {
  if (meals.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Pre-book for tomorrow 📅</Text>
      <FlatList
        data={meals}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TomorrowCard meal={item} onPreBook={() => onPreBook(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: Spacing.lg },
  sectionTitle: {
    fontFamily: Typography.heading,
    fontSize: 18,
    color: Colors.mocha,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  list: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  card: {
    width: 160,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...(Shadows.card as object),
  },
  image: { width: '100%', height: 90 },
  body: { padding: Spacing.sm },
  name: { fontFamily: Typography.semiBold, fontSize: 12, color: Colors.mocha, marginBottom: 3 },
  chef: { fontFamily: Typography.body, fontSize: 11, color: Colors.textMuted, marginBottom: 6 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontFamily: Typography.bold, fontSize: 14, color: Colors.turmericDeep },
  preBookBtn: {
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.turmericDeep + '44',
  },
  preBookText: { fontFamily: Typography.semiBold, fontSize: 11, color: Colors.turmericDeep },
});
