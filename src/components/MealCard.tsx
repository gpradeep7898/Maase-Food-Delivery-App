import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors, Typography, Radius, Spacing, Shadows } from '../lib/theme';
import { Meal } from '../types';
import { formatPrice } from '../lib/utils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.md * 2 - Spacing.sm) / 2;
const PLACEHOLDER = 'https://placehold.co/400x225/FFF3D4/5C3A21?text=Meal';

interface Props {
  meal: Meal;
  onPress: () => void;
  onAddToCart: (meal: Meal) => void;
}

export function MealCard({ meal, onPress, onAddToCart }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  const isLowStock = meal.portions_available > 0 && meal.portions_available < 5;

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        style={styles.inner}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: meal.image_url || PLACEHOLDER }}
            style={styles.image}
            contentFit="cover"
            placeholder={{ uri: PLACEHOLDER }}
            transition={200}
          />
          <View style={[styles.vegBadge, { borderColor: meal.is_veg ? Colors.success : Colors.error }]}>
            <View style={[styles.vegDot, { backgroundColor: meal.is_veg ? Colors.success : Colors.error }]} />
          </View>
          {isLowStock && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>Only {meal.portions_available} left</Text>
            </View>
          )}
        </View>
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2}>{meal.name}</Text>
          <Text style={styles.chefName} numberOfLines={1}>
            {meal.chef?.kitchen_name ?? ''}
          </Text>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>{formatPrice(meal.price)}</Text>
              {!!meal.original_price && meal.original_price > meal.price && (
                <Text style={styles.originalPrice}>{formatPrice(meal.original_price)}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => onAddToCart(meal)}
              style={styles.addBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...(Shadows.card as object),
  },
  inner: { flex: 1 },
  imageContainer: { position: 'relative' },
  image: { width: '100%', aspectRatio: 16 / 9 },
  vegBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDot: { width: 8, height: 8, borderRadius: 4 },
  stockBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.error,
    borderRadius: Radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stockText: { fontFamily: Typography.bold, fontSize: 9, color: Colors.surface },
  body: { padding: Spacing.sm },
  name: { fontFamily: Typography.semiBold, fontSize: 13, color: Colors.mocha, marginBottom: 3 },
  chefName: { fontFamily: Typography.body, fontSize: 11, color: Colors.textMuted, marginBottom: Spacing.xs },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: { fontFamily: Typography.bold, fontSize: 15, color: Colors.turmericDeep },
  originalPrice: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.turmeric,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { fontFamily: Typography.bold, fontSize: 18, color: Colors.mocha, lineHeight: 22 },
});
