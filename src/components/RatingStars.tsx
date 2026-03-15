import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../lib/theme';

interface Props {
  rating: number;
  size?: 'sm' | 'md';
  showNumber?: boolean;
}

export function RatingStars({ rating, size = 'sm', showNumber = false }: Props) {
  const iconSize = size === 'sm' ? 12 : 16;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Ionicons key={i} name="star" size={iconSize} color={Colors.turmeric} />);
    } else if (rating >= i - 0.5) {
      stars.push(<Ionicons key={i} name="star-half" size={iconSize} color={Colors.turmeric} />);
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={iconSize} color={Colors.textMuted} />);
    }
  }

  return (
    <View style={styles.row}>
      {stars}
      {showNumber && (
        <Text style={[styles.number, size === 'md' && styles.numberMd]}>
          {' '}{rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  number: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  numberMd: { fontSize: 14 },
});
