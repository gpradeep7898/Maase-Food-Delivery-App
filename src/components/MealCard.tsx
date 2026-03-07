import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Meal } from '../types';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { CookAvatar } from './ui';

interface Props {
  meal: Meal;
  onPress: () => void;
  onAdd: () => void;
  cartQuantity: number;
}

const MealCard: React.FC<Props> = ({ meal, onPress, onAdd, cartQuantity }) => {
  const isLowStock = meal.batchRemaining <= 3;
  const batchPct = ((meal.batchTotal - meal.batchRemaining) / meal.batchTotal) * 100;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
      {/* Image area */}
      <View style={styles.imageArea}>
        <Text style={styles.emoji}>{meal.emoji}</Text>

        {/* Cuisine tag top-left */}
        <View style={styles.cuisineTag}>
          <Text style={styles.cuisineTagText}>{meal.cuisine}</Text>
        </View>

        {/* Low stock badge top-right */}
        {isLowStock && (
          <View style={styles.lowStockBadge}>
            <Text style={styles.lowStockText}>🔥 {meal.batchRemaining} left!</Text>
          </View>
        )}

        {/* Cooked at badge bottom-left */}
        <View style={styles.cookedBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.cookedText}>Cooked at {meal.cookedAt}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title + price */}
        <View style={styles.titleRow}>
          <Text style={styles.mealName} numberOfLines={1}>{meal.name}</Text>
          <Text style={styles.price}>₹{meal.price}</Text>
        </View>

        {/* Cook row */}
        <View style={styles.cookRow}>
          <CookAvatar initials={meal.cook.initials} color={meal.cook.avatarColor} size={22} />
          <Text style={styles.cookName}>{meal.cook.name}</Text>
        </View>

        {/* Cook story */}
        {meal.cook.story && (
          <View style={styles.storyBox}>
            <Text style={styles.storyText} numberOfLines={2}>"{meal.cook.story}"</Text>
          </View>
        )}

        {/* Maa's Batch */}
        <View style={styles.batchRow}>
          <Text style={styles.batchLabel}>Maa's batch</Text>
          <View style={styles.batchBarBg}>
            <View style={[styles.batchBarFill, {
              width: `${batchPct}%` as any,
              backgroundColor: isLowStock ? Colors.warning : Colors.turmeric,
            }]} />
          </View>
          <Text style={[styles.batchCount, isLowStock && { color: Colors.warning }]}>
            {meal.batchRemaining}/{meal.batchTotal}
          </Text>
        </View>

        {/* Meta + Add button */}
        <View style={styles.metaRow}>
          <Text style={styles.meta}>⭐ {meal.rating} · 🕒 {meal.etaMinutes}m · 📍 {meal.distanceKm}km</Text>
          <TouchableOpacity
            style={[styles.addBtn, cartQuantity > 0 && styles.addBtnActive]}
            onPress={(e) => { e.stopPropagation?.(); onAdd(); }}
          >
            <Text style={[styles.addBtnText, cartQuantity > 0 && styles.addBtnTextActive]}>
              {cartQuantity > 0 ? `✓ ${cartQuantity}` : '+'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  imageArea: {
    height: 140,
    backgroundColor: Colors.turmericLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: { fontSize: 64 },
  cuisineTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cuisineTagText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: Typography.tiny,
    color: Colors.mocha,
  },
  lowStockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.warningLight,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lowStockText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: Typography.tiny,
    color: Colors.warning,
  },
  cookedBadge: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(92,58,33,0.85)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  greenDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4CAF50' },
  cookedText: { fontFamily: 'Poppins_700Bold', fontSize: Typography.tiny, color: Colors.ivory },
  content: { padding: Spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  mealName: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, color: Colors.text, flex: 1, marginRight: Spacing.sm },
  price: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: Colors.mocha },
  cookRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  cookName: { fontFamily: 'Poppins_500Medium', fontSize: Typography.caption, color: Colors.textSecondary },
  storyBox: {
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.turmeric,
    marginBottom: Spacing.sm,
  },
  storyText: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.mocha, fontStyle: 'italic' },
  batchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  batchLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: Typography.tiny, color: Colors.textSecondary },
  batchBarBg: { flex: 1, height: 6, backgroundColor: Colors.ivoryDark, borderRadius: 3, overflow: 'hidden' },
  batchBarFill: { height: '100%', borderRadius: 3 },
  batchCount: { fontFamily: 'Poppins_700Bold', fontSize: Typography.tiny, color: Colors.mocha },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { fontFamily: 'Poppins_400Regular', fontSize: Typography.tiny, color: Colors.textMuted, flex: 1 },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.turmericLight,
    borderWidth: 1.5, borderColor: Colors.turmeric,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnActive: { backgroundColor: Colors.turmeric, borderColor: Colors.turmeric },
  addBtnText: { fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.turmeric },
  addBtnTextActive: { color: Colors.mocha },
});

export default MealCard;
