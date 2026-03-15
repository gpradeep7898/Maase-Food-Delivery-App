import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart } from '../hooks/useCart';
import { FeedANeighbourModal } from '../components/FeedANeighbourModal';
import { Colors, Typography, Spacing, Radius, Shadows } from '../lib/theme';
import { HomeStackParamList } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'MealDetail'>;

export default function MealDetailScreen({ route, navigation }: Props) {
  const { meal } = route.params;
  const { addToCart, clearAndAdd, getQuantity } = useCart();
  const [feedVisible, setFeedVisible] = useState(false);

  const inCart = getQuantity(meal.id);
  const isLowStock = meal.portions_available <= 3;

  const chefInitials = meal.chef?.kitchen_name
    ? meal.chef.kitchen_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  async function handleAdd() {
    const result = await addToCart(meal);
    if (result === 'different_chef') {
      Alert.alert(
        'Different chef',
        'Your cart has items from another kitchen. Start a new cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Start new cart', style: 'destructive', onPress: () => clearAndAdd(meal) },
        ]
      );
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.turmericLight} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.heroEmoji}>🍲</Text>
          <View style={styles.heroBadges}>
            {meal.is_veg && (
              <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.badgeText, { color: '#2E7D32' }]}>🟢 Veg</Text>
              </View>
            )}
            {meal.is_jain && (
              <View style={[styles.badge, { backgroundColor: '#FFF8E1' }]}>
                <Text style={[styles.badgeText, { color: '#F57F17' }]}>Jain</Text>
              </View>
            )}
            {isLowStock && (
              <View style={[styles.badge, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.badgeText, { color: Colors.warning }]}>
                  🔥 Only {meal.portions_available} left
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.meta}>
            {meal.cuisine_type} · Serves {meal.serves} · {meal.portions_available} portions left
          </Text>

          {!!meal.description && (
            <Text style={styles.description}>{meal.description}</Text>
          )}

          {/* Chef card */}
          {meal.chef && (
            <TouchableOpacity
              style={styles.chefCard}
              onPress={() => navigation.navigate('ChefProfile', { chefId: meal.chef_id })}
              activeOpacity={0.85}
            >
              <View style={styles.chefAvatar}>
                <Text style={styles.chefInitials}>{chefInitials}</Text>
              </View>
              <View style={styles.chefInfo}>
                <Text style={styles.chefName}>{meal.chef.kitchen_name}</Text>
                <Text style={styles.chefMeta}>
                  ⭐ {meal.chef.rating.toFixed(1)} · {meal.chef.area}
                </Text>
              </View>
              <Text style={styles.chefArrow}>›</Text>
            </TouchableOpacity>
          )}

          {/* Tags */}
          {meal.tags && meal.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {meal.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Feed a neighbour */}
          <TouchableOpacity
            style={styles.feedTrigger}
            onPress={() => setFeedVisible(true)}
          >
            <Text style={styles.feedText}>🤲 Feed a neighbour with this meal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>₹{meal.price}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, inCart > 0 && styles.addBtnFilled]}
          onPress={inCart > 0 ? () => navigation.navigate('Cart') : handleAdd}
          activeOpacity={0.85}
        >
          <Text style={[styles.addBtnText, inCart > 0 && { color: Colors.ivory }]}>
            {inCart > 0 ? `✓ ${inCart} in Cart — View Cart →` : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>

      <FeedANeighbourModal
        visible={feedVisible}
        onClose={() => setFeedVisible(false)}
        onConfirm={(_msg) => setFeedVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  hero: {
    backgroundColor: Colors.turmericLight,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 12,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20, color: Colors.text },
  heroEmoji: { fontSize: 86 },
  heroBadges: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontFamily: Typography.semiBold, fontSize: 11 },
  content: { padding: Spacing.md },
  mealName: {
    fontFamily: Typography.heading,
    fontSize: 26,
    color: Colors.mocha,
    marginBottom: 4,
  },
  meta: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  description: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  chefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  chefAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.turmeric,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chefInitials: { fontFamily: Typography.heading, fontSize: 18, color: Colors.mocha },
  chefInfo: { flex: 1 },
  chefName: { fontFamily: Typography.semiBold, fontSize: 15, color: Colors.text },
  chefMeta: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chefArrow: { fontSize: 22, color: Colors.textMuted },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tag: {
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: { fontFamily: Typography.semiBold, fontSize: 12, color: Colors.mocha },
  feedTrigger: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.md,
  },
  feedText: { fontFamily: Typography.body, fontSize: 13, color: Colors.mochaSoft },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  priceLabel: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.textMuted,
  },
  price: { fontFamily: Typography.heading, fontSize: 22, color: Colors.mocha },
  addBtn: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.turmeric,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Shadows.button as object),
  },
  addBtnFilled: { backgroundColor: Colors.mocha },
  addBtnText: { fontFamily: Typography.bold, fontSize: 15, color: Colors.mocha },
});
