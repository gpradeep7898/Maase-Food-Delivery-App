import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Meal } from '../types';
import { Colors, Typography, Radius, Spacing, Shadows } from '../constants/theme';
import { CookAvatar, LiveIndicator } from './ui';

interface MealCardProps {
  meal: Meal;
  onPress: () => void;
  onAdd: () => void;
  cartQuantity: number;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onPress, onAdd, cartQuantity }) => {
  const [justAdded, setJustAdded] = useState(false);
  const isLowStock = meal.batchRemaining <= 3;
  const batchPct = ((meal.batchTotal - meal.batchRemaining) / meal.batchTotal) * 100;

  const handleAdd = () => {
    setJustAdded(true);
    onAdd();
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.92} style={styles.card}>
      {/* Image / emoji area */}
      <View style={styles.imageArea}>
        <Text style={styles.emoji}>{meal.emoji}</Text>

        {/* Cuisine tag */}
        <View style={styles.cuisineTag}>
          <Text style={styles.cuisineText}>{meal.cuisine}</Text>
        </View>

        {/* Low stock warning */}
        {isLowStock && (
          <View style={styles.stockWarning}>
            <Text style={styles.stockText}>🔥 {meal.batchRemaining} left!</Text>
          </View>
        )}

        {/* Cook's Kitchen Live — unique Maase feature */}
        <View style={styles.liveBar}>
          <View style={styles.liveDot} />
          <Text style={styles.liveBarText}>Cooked at {meal.cookedAt}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.mealName} numberOfLines={2}>{meal.name}</Text>
            <View style={styles.cookRow}>
              <CookAvatar initials={meal.cook.initials} color={meal.cook.avatarColor} size={22} />
              <Text style={styles.cookName}>{meal.cook.name}</Text>
            </View>
          </View>
          <Text style={styles.price}>₹{meal.price}</Text>
        </View>

        {/* Cook Story — unique Maase feature */}
        <View style={styles.storyBox}>
          <Text style={styles.storyText} numberOfLines={2}>
            💬 "{meal.cook.story}"
          </Text>
        </View>

        {/* Maa's Batch bar — unique Maase feature */}
        <View style={styles.batchRow}>
          <Text style={styles.batchLabel}>Maa's batch</Text>
          <View style={styles.batchBar}>
            <View style={[styles.batchFill, { width: `${batchPct}%` as any, backgroundColor: isLowStock ? Colors.warning : Colors.turmeric }]} />
          </View>
          <Text style={[styles.batchCount, { color: isLowStock ? Colors.warning : Colors.textMuted }]}>
            {meal.batchRemaining}/{meal.batchTotal}
          </Text>
        </View>

        {/* Meta + Add button */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⭐ {meal.rating} · 🕒 {meal.etaMinutes}m · 📍 {meal.distanceKm}km</Text>
          <TouchableOpacity
            onPress={handleAdd}
            activeOpacity={0.8}
            style={[styles.addBtn, (justAdded || cartQuantity > 0) && styles.addBtnActive]}
          >
            <Text style={[styles.addBtnText, (justAdded || cartQuantity > 0) && styles.addBtnTextActive]}>
              {cartQuantity > 0 ? `✓ ${cartQuantity}` : justAdded ? '✓' : '+ Add'}
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
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  imageArea: {
    backgroundColor: Colors.turmericLight,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: {
    fontSize: 64,
  },
  cuisineTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cuisineText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: Typography.caption,
    color: Colors.mocha,
  },
  stockWarning: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.warningLight,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  stockText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: Typography.caption,
    color: Colors.warning,
  },
  liveBar: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(92,58,33,0.85)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  liveBarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: Colors.ivory,
  },
  content: {
    padding: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  titleLeft: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  mealName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  cookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cookName: {
    fontFamily: 'Poppins_400Regular',
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  price: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: Colors.mocha,
  },
  storyBox: {
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.sm,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.turmeric,
    marginBottom: Spacing.sm,
  },
  storyText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: Colors.mocha,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  batchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  batchLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    color: Colors.textMuted,
    width: 64,
  },
  batchBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.ivoryDark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  batchFill: {
    height: '100%',
    borderRadius: 3,
  },
  batchCount: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 10,
    width: 28,
    textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  addBtn: {
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: Colors.turmeric,
  },
  addBtnActive: {
    backgroundColor: Colors.turmeric,
  },
  addBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: Typography.bodySmall,
    color: Colors.turmeric,
  },
  addBtnTextActive: {
    color: Colors.mocha,
  },
});

export default MealCard;
