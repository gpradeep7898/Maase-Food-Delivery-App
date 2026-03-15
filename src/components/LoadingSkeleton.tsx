import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Colors, Radius, Spacing } from '../lib/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.md * 2 - Spacing.sm) / 2;

function ShimmerBox({ style }: { style: object }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: false }),
      ]),
    ).start();
  }, []);

  const bg = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f0e8d8', '#fff3d4'],
  });

  return <Animated.View style={[style, { backgroundColor: bg }]} />;
}

function MealCardSkeleton() {
  return (
    <View style={styles.mealCard}>
      <ShimmerBox style={styles.mealImage} />
      <View style={styles.mealBody}>
        <ShimmerBox style={styles.line1} />
        <ShimmerBox style={styles.line2} />
        <ShimmerBox style={styles.line3} />
      </View>
    </View>
  );
}

function ChefCardSkeleton() {
  return (
    <View style={styles.chefCard}>
      <ShimmerBox style={styles.chefAvatar} />
      <View style={styles.chefInfo}>
        <ShimmerBox style={styles.chefLine1} />
        <ShimmerBox style={styles.chefLine2} />
      </View>
    </View>
  );
}

function OrderCardSkeleton() {
  return (
    <View style={styles.orderCard}>
      <ShimmerBox style={styles.orderLine1} />
      <ShimmerBox style={styles.orderLine2} />
      <ShimmerBox style={styles.orderLine3} />
    </View>
  );
}

interface Props {
  type: 'mealCard' | 'chefCard' | 'orderCard';
  count?: number;
}

export function LoadingSkeleton({ type, count = 4 }: Props) {
  const items = Array.from({ length: count });

  if (type === 'mealCard') {
    return (
      <View style={styles.mealGrid}>
        {items.map((_, i) => <MealCardSkeleton key={i} />)}
      </View>
    );
  }
  if (type === 'chefCard') {
    return (
      <View>
        {items.map((_, i) => <ChefCardSkeleton key={i} />)}
      </View>
    );
  }
  return (
    <View>
      {items.map((_, i) => <OrderCardSkeleton key={i} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  mealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  mealCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  mealImage: { width: '100%', aspectRatio: 16 / 9, borderRadius: 0 },
  mealBody: { padding: Spacing.sm, gap: 6 },
  line1: { height: 14, borderRadius: Radius.sm, width: '80%' },
  line2: { height: 12, borderRadius: Radius.sm, width: '60%' },
  line3: { height: 16, borderRadius: Radius.sm, width: '40%' },
  chefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  chefAvatar: { width: 60, height: 60, borderRadius: 30 },
  chefInfo: { flex: 1, gap: 8 },
  chefLine1: { height: 14, borderRadius: Radius.sm, width: '70%' },
  chefLine2: { height: 12, borderRadius: Radius.sm, width: '50%' },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    gap: 8,
  },
  orderLine1: { height: 14, borderRadius: Radius.sm, width: '70%' },
  orderLine2: { height: 12, borderRadius: Radius.sm, width: '50%' },
  orderLine3: { height: 12, borderRadius: Radius.sm, width: '30%' },
});
