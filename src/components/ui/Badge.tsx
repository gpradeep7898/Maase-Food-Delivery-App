import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../lib/theme';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'muted';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const variantMap: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: '#DCFCE7', text: '#16A34A' },
  error:   { bg: '#FEE2E2', text: '#DC2626' },
  warning: { bg: '#FEF3C7', text: '#D97706' },
  info:    { bg: '#DBEAFE', text: '#1D4ED8' },
  muted:   { bg: Colors.border, text: Colors.textMuted },
};

export function Badge({ label, variant = 'info', size = 'sm', style }: BadgeProps) {
  const { bg, text } = variantMap[variant];
  return (
    <View style={[
      styles.base,
      { backgroundColor: bg },
      size === 'md' && styles.md,
      style,
    ]}>
      <Text style={[styles.label, { color: text }, size === 'md' && styles.labelMd]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  md: { paddingHorizontal: Spacing.md, paddingVertical: 5 },
  label: {
    fontFamily: Typography.semiBold,
    fontSize: 11,
  },
  labelMd: { fontSize: 13 },
});
