import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, CartItem, Meal } from '../types';
import { Colors, Typography, Radius, Spacing } from '../constants/theme';
import { PrimaryButton, CookAvatar } from '../components/ui';
import { addToCart, getItemCount } from '../utils/cart';

type Props = NativeStackScreenProps<HomeStackParamList, 'MealDetail'> & {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
};

const MealDetailScreen: React.FC<Props> = ({ route, navigation, cartItems, setCartItems }) => {
  const { meal } = route.params;
  const inCart = cartItems.find(i => i.meal.id === meal.id)?.quantity ?? 0;
  const batchPct = ((meal.batchTotal - meal.batchRemaining) / meal.batchTotal) * 100;
  const isLowStock = meal.batchRemaining <= 3;

  const handleAdd = () => setCartItems(addToCart(cartItems, meal));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.heroEmoji}>{meal.emoji}</Text>
          <View style={styles.heroBadge}>
            <View style={styles.heroBadgeDot} />
            <Text style={styles.heroBadgeText}>Cooked at {meal.cookedAt}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title & meta */}
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.meta}>⭐ {meal.rating} ({meal.reviewCount} reviews) · 📍 {meal.distanceKm}km · 🕒 {meal.etaMinutes} mins</Text>

          {/* Maa's Batch — unique Maase feature */}
          <View style={styles.batchCard}>
            <View style={styles.batchTop}>
              <Text style={styles.batchTitle}>🍳 Maa's Batch Today</Text>
              <Text style={[styles.batchCount, { color: isLowStock ? Colors.warning : Colors.mocha }]}>
                {meal.batchRemaining} of {meal.batchTotal} left
              </Text>
            </View>
            <View style={styles.batchBar}>
              <View style={[styles.batchFill, {
                width: `${batchPct}%` as any,
                backgroundColor: isLowStock ? Colors.warning : Colors.turmeric,
              }]} />
            </View>
            <Text style={styles.batchNote}>
              {isLowStock ? '🔥 Selling fast! Order before it runs out.' : 'Good availability — no rush!'}
            </Text>
          </View>

          {/* Cook card */}
          <View style={styles.cookCard}>
            <View style={styles.cookTop}>
              <CookAvatar initials={meal.cook.initials} color={meal.cook.avatarColor} size={52} />
              <View style={styles.cookInfo}>
                <Text style={styles.cookName}>{meal.cook.name}</Text>
                <Text style={styles.cookSub}>Home cook · {meal.cook.cuisine} cuisine</Text>
                <Text style={styles.cookSub}>⭐ {meal.cook.rating} · {meal.cook.totalOrders} orders served</Text>
              </View>
            </View>
            {/* Cook Story — unique Maase feature */}
            {meal.cook.story && (
              <View style={styles.storyBox}>
                <Text style={styles.storyLabel}>TODAY'S STORY</Text>
                <Text style={styles.storyText}>"{meal.cook.story}"</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>About this meal</Text>
          <Text style={styles.description}>{meal.description}</Text>

          {/* Items included */}
          <Text style={styles.sectionTitle}>What you get</Text>
          {meal.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <View style={styles.itemDot} />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}

          {/* Tags */}
          <View style={styles.tagsRow}>
            {meal.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Fixed bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>₹{meal.price}</Text>
        </View>
        <View style={styles.bottomBtnWrap}>
          {inCart > 0 ? (
            <PrimaryButton
              label={`✓ ${inCart} in Cart  —  Go to Cart →`}
              onPress={() => navigation.navigate('Cart')}
            />
          ) : (
            <PrimaryButton label="Add to Cart" onPress={handleAdd} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { paddingBottom: Spacing.xl },
  hero: {
    backgroundColor: Colors.turmericLight, height: 200,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  backBtn: {
    position: 'absolute', top: 12, left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12,
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 20, color: Colors.text },
  heroEmoji: { fontSize: 90 },
  heroBadge: {
    position: 'absolute', bottom: 12, left: 16,
    backgroundColor: 'rgba(92,58,33,0.85)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  heroBadgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4CAF50' },
  heroBadgeText: { fontFamily: 'Poppins_700Bold', fontSize: 12, color: Colors.ivory },
  content: { padding: Spacing.md },
  mealName: {
    fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h2,
    color: Colors.text, marginBottom: 6,
  },
  meta: {
    fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall,
    color: Colors.textSecondary, marginBottom: Spacing.md,
  },
  batchCard: {
    backgroundColor: Colors.turmericLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  batchTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  batchTitle: { fontFamily: 'Poppins_700Bold', fontSize: Typography.bodySmall, color: Colors.mocha },
  batchCount: { fontFamily: 'Poppins_700Bold', fontSize: Typography.bodySmall },
  batchBar: { height: 8, backgroundColor: Colors.ivoryDark, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  batchFill: { height: '100%', borderRadius: 4 },
  batchNote: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.textMuted },
  cookCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  cookTop: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  cookInfo: { flex: 1, justifyContent: 'center' },
  cookName: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: Colors.text, marginBottom: 2 },
  cookSub: { fontFamily: 'Poppins_400Regular', fontSize: Typography.caption, color: Colors.textSecondary },
  storyBox: {
    backgroundColor: Colors.ivory, borderRadius: Radius.md, padding: 12,
    borderLeftWidth: 3, borderLeftColor: Colors.turmeric,
  },
  storyLabel: {
    fontFamily: 'Poppins_700Bold', fontSize: 10, color: Colors.textMuted,
    marginBottom: 4, letterSpacing: 0.5,
  },
  storyText: { fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.mocha, fontStyle: 'italic', lineHeight: 20 },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: Colors.text, marginBottom: Spacing.sm, marginTop: Spacing.md },
  description: { fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.sm },
  itemDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.turmeric },
  itemText: { fontFamily: 'Poppins_400Regular', fontSize: Typography.body, color: Colors.text },
  tagsRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', marginTop: Spacing.md },
  tag: { backgroundColor: Colors.turmericLight, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  tagText: { fontFamily: 'Poppins_700Bold', fontSize: Typography.caption, color: Colors.mocha },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  priceLabel: { fontFamily: 'Poppins_400Regular', fontSize: Typography.caption, color: Colors.textMuted },
  price: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: Colors.mocha },
  bottomBtnWrap: { flex: 1 },
});

export default MealDetailScreen;
