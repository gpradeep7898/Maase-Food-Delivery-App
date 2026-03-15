import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../lib/theme';

interface Props {
  count: number;
  onDismiss: () => void;
}

export function MaaOnlineBanner({ count, onDismiss }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 18 }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.5, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  if (count === 0) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.row}>
        <Animated.View style={[styles.dot, { transform: [{ scale: pulse }] }]} />
        <Text style={styles.text}>
          🍳 <Text style={styles.count}>{count}</Text> cooks cooking right now in your area
        </Text>
      </View>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.close}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.turmericLight,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.turmericDeep + '33',
  },
  row: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  text: { fontFamily: Typography.medium, fontSize: 13, color: Colors.mocha, flex: 1 },
  count: { fontFamily: Typography.bold, color: Colors.turmericDeep },
  close: { fontFamily: Typography.body, fontSize: 14, color: Colors.textMuted, paddingLeft: Spacing.sm },
});
