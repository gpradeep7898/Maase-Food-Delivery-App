import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Radius, Spacing, Shadows } from '../lib/theme';
import { Chef } from '../types';
import { RatingStars } from './RatingStars';

interface Props {
  chef: Chef;
  onPress: () => void;
}

const AVATAR_PLACEHOLDER = 'https://placehold.co/120x120/FFF3D4/5C3A21?text=Chef';

export function ChefCard({ chef, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, !chef.is_open && styles.closed]}
    >
      <Image
        source={{ uri: chef.avatar_url || AVATAR_PLACEHOLDER }}
        style={styles.avatar}
        contentFit="cover"
        placeholder={{ uri: AVATAR_PLACEHOLDER }}
      />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{chef.kitchen_name}</Text>
          {chef.is_verified && (
            <Ionicons name="checkmark-circle" size={14} color={Colors.success} style={{ marginLeft: 4 }} />
          )}
        </View>
        <Text style={styles.area} numberOfLines={1}>{chef.area}, {chef.city}</Text>
        <View style={styles.row}>
          <RatingStars rating={chef.rating} size="sm" showNumber />
          {chef.speciality.slice(0, 2).map(s => (
            <View key={s} style={styles.chip}>
              <Text style={styles.chipText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.right}>
        <View style={[styles.openBadge, { backgroundColor: chef.is_open ? '#DCFCE7' : Colors.border }]}>
          <Text style={[styles.openText, { color: chef.is_open ? Colors.success : Colors.textMuted }]}>
            {chef.is_open ? 'Open' : 'Closed'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} style={{ marginTop: 8 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...(Shadows.card as object),
  },
  closed: { opacity: 0.6 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  name: { fontFamily: Typography.semiBold, fontSize: 14, color: Colors.mocha },
  area: { fontFamily: Typography.body, fontSize: 12, color: Colors.textMuted, marginBottom: 5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  chip: {
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: { fontFamily: Typography.medium, fontSize: 10, color: Colors.mochaSoft },
  right: { alignItems: 'center' },
  openBadge: { borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  openText: { fontFamily: Typography.semiBold, fontSize: 11 },
});
