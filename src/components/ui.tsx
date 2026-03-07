import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { OrderStatus } from '../types';
import { ORDER_STATUS_CONFIG } from '../constants/mockData';

// ── PrimaryButton ────────────────────────────────────────────
interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: object;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label, onPress, disabled = false, loading = false, style,
}) => (
  <TouchableOpacity
    style={[styles.primary, disabled && styles.primaryDisabled, style]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.85}
  >
    {loading
      ? <ActivityIndicator color={Colors.mocha} />
      : <Text style={styles.primaryText}>{label}</Text>
    }
  </TouchableOpacity>
);

// ── SecondaryButton ──────────────────────────────────────────
interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  style?: object;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ label, onPress, style }) => (
  <TouchableOpacity
    style={[styles.secondary, style]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.secondaryText}>{label}</Text>
  </TouchableOpacity>
);

// ── CookAvatar ───────────────────────────────────────────────
interface CookAvatarProps {
  initials: string;
  color: string;
  size?: number;
}

export const CookAvatar: React.FC<CookAvatarProps> = ({ initials, color, size = 40 }) => (
  <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
    <Text style={[styles.avatarText, { fontSize: size * 0.35 }]}>{initials}</Text>
  </View>
);

// ── StatusBadge ──────────────────────────────────────────────
interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = ORDER_STATUS_CONFIG[status] ?? { label: status, emoji: '•', color: Colors.textMuted };
  return (
    <View style={[styles.badge, { backgroundColor: config.color + '22' }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>
        {config.emoji} {config.label}
      </Text>
    </View>
  );
};

// ── FilterChip ───────────────────────────────────────────────
interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

// ── SectionHeader ────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
  style?: object;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action, style }) => (
  <View style={[styles.sectionHeader, style]}>
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
    {action && (
      <TouchableOpacity onPress={action.onPress}>
        <Text style={styles.sectionAction}>{action.label}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ── Divider ──────────────────────────────────────────────────
export const Divider: React.FC<{ style?: object }> = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  primary: {
    height: 52,
    backgroundColor: Colors.turmeric,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.button,
  },
  primaryDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryText: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.body,
    color: Colors.mocha,
  },
  secondary: {
    height: 52,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Typography.bodyBold,
    color: Colors.surface,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  badgeText: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.tiny,
  },
  chip: {
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  chipSelected: {
    backgroundColor: Colors.turmeric,
    borderColor: Colors.turmeric,
  },
  chipText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.mocha,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Typography.display,
    fontSize: Typography.h3,
    color: Colors.text,
  },
  sectionSubtitle: {
    fontFamily: Typography.bodyRegular,
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionAction: {
    fontFamily: Typography.bodySemiBold,
    fontSize: Typography.bodySmall,
    color: Colors.turmeric,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
});
