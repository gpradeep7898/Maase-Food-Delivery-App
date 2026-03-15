import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Colors, Typography, Radius, Shadows, Spacing } from '../lib/theme';
import { formatPrice } from '../lib/utils';

interface Props {
  itemCount: number;
  total: number;
  onPress: () => void;
}

export function CartFloatingButton({ itemCount, total, onPress }: Props) {
  const slideAnim = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: itemCount > 0 ? 0 : 80,
      useNativeDriver: true,
      damping: 18,
    }).start();
  }, [itemCount]);

  if (itemCount === 0) return null;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.button}>
        <Text style={styles.left}>🛒 {itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
        <Text style={styles.divider}>|</Text>
        <Text style={styles.right}>{formatPrice(total)} →</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 96 : 78,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 99,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.mocha,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    ...(Shadows.button as object),
  },
  left: { fontFamily: Typography.semiBold, fontSize: 14, color: Colors.surface },
  divider: { color: Colors.surface + '55', fontSize: 16 },
  right: { fontFamily: Typography.bold, fontSize: 14, color: Colors.turmeric },
});
